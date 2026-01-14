"""
Public Registration and Dashboard Stats Views
Add to users/views.py or create separate file
"""

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


# Add to UserViewSet:

@action(detail=False, methods=['post'], permission_classes=[AllowAny])
def public_register(self, request):
    """
    Registro público de nuevos miembros
    POST /api/users/public_register/
    
    Body: {
        first_name, last_name, email, password,
        phone, birth_date, emergency_contact, emergency_phone
    }
    """
    from apps.members.models import Member
    from apps.roles.models import Role
    
    # Validar datos requeridos
    required = ['first_name', 'last_name', 'email', 'password']
    for field in required:
        if not request.data.get(field):
            return Response(
                {'error': f'Campo {field} es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    email = request.data.get('email')
    
    # Verificar si email ya existe
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Este email ya está registrado'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Obtener rol de Miembro
    try:
        member_role = Role.objects.get(name='Miembro')
    except Role.DoesNotExist:
        return Response(
            {'error': 'Error de configuración del sistema'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Crear usuario
    user = User.objects.create_user(
        email=email,
        password=request.data.get('password'),
        first_name=request.data.get('first_name'),
        last_name=request.data.get('last_name'),
        role=member_role
    )
    
    # Crear perfil de miembro
    member = Member.objects.create(
        user=user,
        phone=request.data.get('phone', ''),
        birth_date=request.data.get('birth_date'),
        emergency_contact=request.data.get('emergency_contact', ''),
        emergency_phone=request.data.get('emergency_phone', '')
    )
    
    # Crear notificación de bienvenida
    from apps.notifications.models import Notification
    Notification.objects.create(
        user=user,
        type='welcome',
        title='¡Bienvenido al Gimnasio!',
        message='Tu cuenta ha sido creada exitosamente. Un asesor se contactará contigo pronto para completar tu membresía.',
        priority='medium'
    )
    
    return Response({
        'message': 'Registro exitoso',
        'user_id': user.id,
        'member_id': member.id,
        'email': user.email
    }, status=status.HTTP_201_CREATED)


@action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
def dashboard_stats(self, request):
    """
    Estadísticas rápidas para dashboard del miembro
    GET /api/users/dashboard_stats/
    """
    user = request.user
    
    if user.role.name != 'Miembro':
        return Response(
            {'error': 'Solo disponible para miembros'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from apps.members.models import Member
    from apps.memberships.models import Membership
    from apps.classes.models import Reservation
    from apps.progress.models import WorkoutSession, ProgressLog
    
    try:
        member = user.member
    except:
        return Response({'error': 'Perfil de miembro no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    now = timezone.now()
    
    # Membresía activa
    active_membership = Membership.objects.filter(
        member=member,
        status='active'
    ).first()
    
    days_until_expiry = None
    if active_membership:
        delta = active_membership.end_date - now
        days_until_expiry = delta.days
    
    # Próxima clase
    next_class = Reservation.objects.filter(
        member=member,
        scheduled_class__date__gte=now,
        status__in=['confirmed', 'pending']
    ).select_related('scheduled_class__gym_class').order_by('scheduled_class__date').first()
    
    # Sesiones este mes
    month_start = now.replace(day=1, hour=0, minute=0, second=0)
    sessions_this_month = WorkoutSession.objects.filter(
        member=member,
        date__gte=month_start,
        completed=True
    ).count()
    
    # Último progreso registrado
    last_progress = ProgressLog.objects.filter(
        member=member
    ).order_by('-date').first()
    
    # Clases atendidas últimos 30 días
    thirty_days_ago = now - timedelta(days=30)
    classes_attended = Reservation.objects.filter(
        member=member,
        scheduled_class__date__gte=thirty_days_ago,
        status='attended'
    ).count()
    
    stats = {
        'membership': {
            'is_active': bool(active_membership),
            'plan_name': active_membership.plan.name if active_membership else None,
            'days_until_expiry': days_until_expiry,
            'expiring_soon': days_until_expiry is not None and days_until_expiry <= 7
        },
        'next_class': {
            'has_reservation': bool(next_class),
            'class_name': next_class.scheduled_class.gym_class.name if next_class else None,
            'date': next_class.scheduled_class.date if next_class else None,
            'time': next_class.scheduled_class.time if next_class else None
        },
        'activity': {
            'sessions_this_month': sessions_this_month,
            'classes_last_30_days': classes_attended,
            'last_progress_date': last_progress.date if last_progress else None,
            'current_weight': float(last_progress.weight) if last_progress and last_progress.weight else None
        }
    }
    
    return Response(stats)
