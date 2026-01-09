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
    
    @action(detail=True, methods=['post'])
    def freeze(self, request, pk=None):
        """Congelar una membresía"""
        membership = self.get_object()
        reason = request.data.get('reason', '')
        
        if membership.freeze():
            MembershipFreeze.objects.create(
                membership=membership,
                start_date=membership.frozen_at,
                reason=reason
            )
            return Response({'message': 'Membresía congelada exitosamente'})
        return Response(
            {'error': 'No se puede congelar esta membresía'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
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
