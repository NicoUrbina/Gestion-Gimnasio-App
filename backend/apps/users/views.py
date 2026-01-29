"""
ViewSets para Usuarios
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
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
        queryset = User.objects.all()
        
        # Permission-based filtering
        if not (user.is_superuser or (user.role and user.role.name == 'admin')):
            queryset = queryset.filter(id=user.id)
        
        # Multi-field search with Q objects
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(username__icontains=search)
            )
        
        # Optimize query and order results
        return queryset.select_related('role').order_by('-date_joined')
    
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
    
    
    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Resetear contraseña de un usuario (solo admin)"""
        user = request.user
        if not (user.is_superuser or (user.role and user.role.name == 'admin')):
            return Response(
                {'error': 'No tienes permisos para resetear contraseñas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        target_user = self.get_object()
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response(
                {'error': 'new_password es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(new_password) < 6:
            return Response(
                {'error': 'La contraseña debe tener al menos 6 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        target_user.set_password(new_password)
        target_user.save()
        
        return Response({'message': 'Contraseña reseteada correctamente'})
    
    
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
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Estadísticas mejoradas para el usuario actual
        GET /api/users/me/stats/
        
        Para members retorna datos completos de membresía, clases y progreso
        Para trainers/admin/staff retorna stats básicas
        """
        from apps.members.models import Member
        from apps.memberships.models import Membership
        from apps.classes.models import Reservation
        from apps.payments.models import Payment
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Sum, Count
        
        user = request.user
        now = timezone.now()
        today = now.date()
        
        # Si es member, retornar stats completas
        try:
            member = user.member_profile
            
            # Membresía activa
            active_membership = Membership.objects.filter(
                member=member,
                status='active'
            ).first()
            
            days_remaining = None
            if active_membership:
                delta = active_membership.end_date - today
                days_remaining = delta.days
            
            # Reservas próximas
            upcoming_reservations = Reservation.objects.filter(
                member=member,
                gym_class__start_datetime__gte=now,
                status__in=['confirmed', 'waitlist']
            ).count()
            
            # Clases asistidas este mes
            month_start = now.replace(day=1, hour=0, minute=0, second=0)
            classes_attended = Reservation.objects.filter(
                member=member,
                gym_class__start_datetime__gte=month_start,
                status='attended'
            ).count()
            
            # Racha actual (días consecutivos con asistencia)
            # Simplificado: contar días únicos de asistencia en últimas 2 semanas
            two_weeks_ago = now - timedelta(days=14)
            attended_dates = Reservation.objects.filter(
                member=member,
                gym_class__start_datetime__gte=two_weeks_ago,
                status='attended'
            ).values_list('gym_class__start_datetime__date', flat=True).distinct()
            
            current_streak = len(set(attended_dates))
            
            # Objetivo mensual (asumido: 12 clases/mes)
            monthly_goal = 12
            monthly_progress = classes_attended
            
            # Obtener lista de próximas clases reservadas
            upcoming_classes_list = []
            upcoming_reservations_qs = Reservation.objects.filter(
                member=member,
                gym_class__start_datetime__gte=now,
                status__in=['confirmed', 'waitlist']
            ).select_related('gym_class__class_type', 'gym_class__instructor__user').order_by('gym_class__start_datetime')[:5]
            
            for reservation in upcoming_reservations_qs:
                upcoming_classes_list.append({
                    'id': reservation.id,
                    'class_name': reservation.gym_class.class_type.name if reservation.gym_class.class_type else reservation.gym_class.title,
                    'trainer_name': reservation.gym_class.instructor.user.get_full_name() if reservation.gym_class.instructor else 'Sin asignar',
                    'date': reservation.gym_class.start_datetime.strftime('%d/%m/%Y'),
                    'time': reservation.gym_class.start_datetime.strftime('%I:%M %p')
                })
            
            return Response({
                'membership': {
                    'days_remaining': days_remaining if days_remaining is not None else 0,
                    'expiring_soon': days_remaining is not None and days_remaining <= 7,
                },
                'reservations': {
                    'upcoming': upcoming_reservations,
                    'list': upcoming_classes_list
                },
                'attendance': {
                    'month': classes_attended
                },
                'streak': {
                    'days': current_streak,
                    'best': current_streak  # Simplificado por ahora
                },
                'goals': {
                    'monthlyClasses': monthly_goal
                }
            })
            
        except Member.DoesNotExist:
            # No es member, retornar stats básicas para otros roles
            return Response({
                'membership': {
                    'days_remaining': 0,
                    'expiring_soon': False
                },
                'reservations': {
                    'upcoming': 0,
                    'list': []
                },
                'attendance': {
                    'month': 0
                },
                'streak': {
                    'days': 0,
                    'best': 0
                },
                'goals': {
                    'monthlyClasses': 12
                }
            })


