"""
ViewSets para Usuarios
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Role
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    ChangePasswordSerializer, RoleSerializer, CustomTokenObtainPairSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para login con JWT"""
    serializer_class = CustomTokenObtainPairSerializer


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or (user.role and user.role.name == 'admin'):
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtener datos del usuario actual"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Cambiar contraseña del usuario actual"""
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Contraseña actualizada correctamente'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Estadísticas para el dashboard
        GET /api/users/dashboard_stats/
        """
        from apps.members.models import Member
        from apps.memberships.models import Membership
        from apps.payments.models import Payment
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Sum, Count
        
        user = request.user
        now = timezone.now()
        today = now.date()
        
        # Stats básicas para admin/staff - devolver estructura compatible
        if user.is_staff or (user.role and user.role.name in ['admin', 'manager']):
            # Total miembros
            total_members = Member.objects.count()
            active_members = Member.objects.filter(subscription_status='active').count()
            
            # Membresías por vencer (próximos 7 días)
            expiring_soon = Membership.objects.filter(
                status='active',
                end_date__lte=today + timedelta(days=7),
                end_date__gte=today
            ).count()
            
            # Ingresos del mes
            month_start = now.replace(day=1, hour=0, minute=0, second=0)
            revenue_month = Payment.objects.filter(
                payment_date__gte=month_start,
                status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Ingresos de hoy
            revenue_today = Payment.objects.filter(
                payment_date__date=today,
                status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Pagos pendientes
            pending_payments = Payment.objects.filter(status='pending').count()
            
            # Retornar stats de admin pero en estructura compatible con frontend
            return Response({
                'total_members': total_members,
                'active_members': active_members,
                'expiring_soon': expiring_soon,
                'revenue_month': float(revenue_month),
                'revenue_today': float(revenue_today),
                'pending_payments': pending_payments,
                # Agregar estructura esperada por EnhancedDashboardPage
                'membership': {
                    'is_active': True,  # Admin siempre "activo"
                    'plan_name': 'Administrador',
                    'days_until_expiry': None,
                    'expiring_soon': False
                },
                'next_class': {
                    'has_reservation': False,
                    'class_name': None,
                    'date': None,
                    'time': None
                },
                'activity': {
                    'sessions_this_month': 0,
                    'classes_last_30_days': 0,
                    'last_progress_date': None,
                    'current_weight': None
                }
            })
        
        # Stats para miembros
        try:
            member = user.member_profile
        except:
            return Response({
                'membership': {
                    'is_active': False,
                    'plan_name': None,
                    'days_until_expiry': None,
                    'expiring_soon': False
                },
                'next_class': {
                    'has_reservation': False,
                    'class_name': None,
                    'date': None,
                    'time': None
                },
                'activity': {
                    'sessions_this_month': 0,
                    'classes_last_30_days': 0,
                    'last_progress_date': None,
                    'current_weight': None
                }
            }, status=status.HTTP_200_OK)
        
        # Membresía activa
        active_membership = Membership.objects.filter(
            member=member,
            status='active'
        ).first()
        
        days_until_expiry = None
        if active_membership:
            delta = active_membership.end_date - today
            days_until_expiry = delta.days
        
        return Response({
            'membership': {
                'is_active': bool(active_membership),
                'plan_name': active_membership.plan.name if active_membership else None,
                'days_until_expiry': days_until_expiry,
                'expiring_soon': days_until_expiry is not None and days_until_expiry <= 7
            },
            'next_class': {
                'has_reservation': False,
                'class_name': None,
                'date': None,
                'time': None
            },
            'activity': {
                'sessions_this_month': 0,
                'classes_last_30_days': 0,
                'last_progress_date': None,
                'current_weight': None
            }
        })


