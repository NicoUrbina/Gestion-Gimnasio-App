"""
ViewSets para Membresías
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MembershipPlan, Membership, MembershipFreeze
from .serializers import (
    MembershipPlanSerializer, MembershipSerializer,
    MembershipCreateSerializer, MembershipFreezeSerializer
)


class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            # Solo mostrar planes activos a usuarios normales
            if not self.request.user.is_staff:
                return MembershipPlan.objects.filter(is_active=True)
        return MembershipPlan.objects.all()


class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.select_related('member__user', 'plan').all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MembershipCreateSerializer
        return MembershipSerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'member_profile') and not user.is_staff:
            return Membership.objects.filter(member__user=user)
        return Membership.objects.select_related('member__user', 'plan').all()
    
    def create(self, request, *args, **kwargs):
        """Crear membresía con validaciones"""
        member_id = request.data.get('member')
        
        # VALIDACIÓN: Verificar si ya tiene membresía activa
        existing_active = Membership.objects.filter(
            member_id=member_id,
            status='active'
        ).exists()
        
        if existing_active:
            return Response(
                {'detail': 'El miembro ya tiene una membresía activa. Debe expirar o cancelarse primero.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def expiring(self, request):
        """Membresías por vencer en los próximos 7 días"""
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        seven_days_ahead = today + timedelta(days=7)
        
        expiring_memberships = Membership.objects.filter(
            status='active',
            end_date__gte=today,
            end_date__lte=seven_days_ahead
        ).select_related('member__user', 'plan')
        
        serializer = self.get_serializer(expiring_memberships, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def freeze(self, request, pk=None):
        """Congelar membresía con validación de límite"""
        membership = self.get_object()
        reason = request.data.get('reason', '')
        days = request.data.get('days', 7)
        
        if membership.status != 'active':
            return Response(
                {'message': 'Solo se pueden congelar membresías activas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # VALIDACIÓN: Verificar límite de congelaciones por año
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        # Contar días congelados en el último año
        one_year_ago = timezone.now() - timedelta(days=365)
        
        total_frozen_days = Membership.objects.filter(
            member=membership.member,
            freeze_start_date__gte=one_year_ago,
            freeze_end_date__isnull=False
        ).aggregate(
            total_days=models.Sum(
                models.F('freeze_end_date') - models.F('freeze_start_date')
            )
        )['total_days']
        
        # Convertir timedelta a días
        if total_frozen_days:
            total_frozen_days = total_frozen_days.days
        else:
            total_frozen_days = 0
        
        freeze_limit = membership.plan.freeze_days_per_year
        
        if total_frozen_days + days > freeze_limit:
            return Response(
                {'detail': f'Límite de congelación excedido. Has usado {total_frozen_days} de {freeze_limit} días este año.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Congelar membresía
        membership.status = 'frozen'
        membership.freeze_start_date = timezone.now().date()
        membership.freeze_end_date = timezone.now().date() + timedelta(days=days)
        
        # Extender end_date
        membership.end_date = membership.end_date + timedelta(days=days)
        membership.save()
        
        return Response({
            'message': f'Membresía congelada por {days} días',
            'freeze_until': membership.freeze_end_date
        })
    
    @action(detail=True, methods=['post'])
    def unfreeze(self, request, pk=None):
        """Descongelar una membresía"""
        membership = self.get_object()
        
        if membership.unfreeze():
            # Actualizar el registro de congelación
            freeze = membership.freezes.filter(end_date__isnull=True).first()
            if freeze:
                from django.utils import timezone
                freeze.end_date = timezone.now().date()
                freeze.save()
            return Response({'message': 'Membresía descongelada exitosamente'})
        return Response(
            {'error': 'No se puede descongelar esta membresía'},
            status=status.HTTP_400_BAD_REQUEST
        )


class MembershipFreezeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MembershipFreeze.objects.all()
    serializer_class = MembershipFreezeSerializer
    permission_classes = [permissions.IsAuthenticated]
