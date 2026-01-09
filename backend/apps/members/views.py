"""
ViewSets para Miembros
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Member
from .serializers import MemberSerializer, MemberListSerializer, MemberCreateSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subscription_status', 'gender']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'phone']
    ordering_fields = ['joined_date', 'last_access', 'user__first_name']
    ordering = ['-joined_date']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MemberListSerializer
        elif self.action == 'create':
            return MemberCreateSerializer
        return MemberSerializer
    
    def get_queryset(self):
        user = self.request.user
        # Miembros solo pueden ver su propio perfil
        if hasattr(user, 'member_profile'):
            if not (user.is_staff or user.is_superuser):
                return Member.objects.filter(user=user)
        return Member.objects.select_related('user').all()
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de miembros"""
        total = Member.objects.count()
        active = Member.objects.filter(subscription_status='active').count()
        inactive = Member.objects.filter(subscription_status='inactive').count()
        expired = Member.objects.filter(subscription_status='expired').count()
        
        return Response({
            'total': total,
            'active': active,
            'inactive': inactive,
            'expired': expired,
            'active_percentage': round(active / total * 100, 1) if total > 0 else 0
        })
    
    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        """Miembros con membresía por vencer en 7 días"""
        from apps.memberships.models import Membership
        from django.utils import timezone
        from datetime import timedelta
        
        expiring = Membership.objects.filter(
            status='active',
            end_date__lte=timezone.now().date() + timedelta(days=7),
            end_date__gte=timezone.now().date()
        ).select_related('member__user')
        
        data = [
            {
                'member_id': m.member.id,
                'name': m.member.user.get_full_name(),
                'email': m.member.user.email,
                'end_date': m.end_date,
                'days_remaining': m.days_remaining
            }
            for m in expiring
        ]
        return Response(data)
