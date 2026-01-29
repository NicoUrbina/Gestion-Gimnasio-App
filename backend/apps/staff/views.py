"""
ViewSets para Staff y Endpoints de Trainers
"""
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta, datetime
from .models import Staff, Schedule
from .serializers import StaffSerializer, StaffListSerializer, ScheduleSerializer
from apps.common.permissions import role_required, is_trainer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'specializations']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StaffListSerializer
        return StaffSerializer
    
    def get_queryset(self):
        queryset = Staff.objects.select_related('user').prefetch_related('schedules')
        
        # Filtrar por tipo de staff
        staff_type = self.request.query_params.get('staff_type')
        if staff_type:
            queryset = queryset.filter(staff_type=staff_type)
        
        # Filtrar solo instructores
        is_instructor = self.request.query_params.get('is_instructor')
        if is_instructor:
            queryset = queryset.filter(is_instructor=True)
        
        # Solo activos por defecto
        if self.action == 'list':
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Estadísticas operativas del día para staff
        GET /api/staff/dashboard/
        
        Retorna estadísticas del día para staff operativo:
            - payments: Pagos de hoy
            - reservations: Reservas de hoy
            - members: Miembros nuevos del mes
            - renewals: Renovaciones pendientes
            - classes: Clases programadas hoy
        """
        from apps.payments.models import Payment
        from apps.classes.models import Reservation, GymClass
        from apps.members.models import Member
        from apps.memberships.models import Membership
        from django.db.models import Sum, Count
        from datetime import timedelta
        
        now = timezone.now()
        today = now.date()
        
        # Pagos de hoy
        payments_today = Payment.objects.filter(
            payment_date=today,
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Reservas de hoy
        reservations_today = Reservation.objects.filter(
            gym_class__start_datetime__date=today,
            status='confirmed'
        ).count()
        
        # Miembros nuevos del mes
        month_start = now.replace(day=1, hour=0, minute=0, second=0)
        members_new = Member.objects.filter(
            joined_date__gte=month_start.date(),
            joined_date__lte=today
        ).count()
        
        # Renovaciones pendientes (membresías que vencen en los próximos 7 días)
        renewals_pending = Membership.objects.filter(
            end_date__lte=today + timedelta(days=7),
            end_date__gte=today,
            is_active=True
        ).count()
        
        # Clases de hoy con información detallada
        classes_today = GymClass.objects.filter(
            start_datetime__date=today,
            is_cancelled=False
        ).select_related('instructor__user', 'class_type').annotate(
            reservations_count=Count('reservations', filter=Q(reservations__status='confirmed'))
        ).order_by('start_datetime')
        
        # Formatear clases
        classes_data = []
        for gym_class in classes_today:
            classes_data.append({
                'id': gym_class.id,
                'name': gym_class.class_type.name if gym_class.class_type else gym_class.title,
                'trainer': gym_class.instructor.user.get_full_name() if gym_class.instructor else 'Sin asignar',
                'time': gym_class.start_datetime.strftime('%I:%M %p'),
                'reservations': gym_class.reservations_count,
                'capacity': gym_class.capacity
            })
        
        return Response({
            'payments': {'today': float(payments_today)},
            'reservations': {'today': reservations_today},
            'members': {'newThisMonth': members_new},
            'renewals': {'pending': renewals_pending},
            'classes': classes_data
        })
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """
        Estadísticas del trainer actual
        GET /api/staff/my-stats/
        
        Retorna:
            - my_classes_today: Número de clases hoy
            - my_classes_week: Número de clases esta semana
            - assigned_clients: Número de clientes asignados
            - total_sessions_month: Total de sesiones del mes
        """
        user = request.user
        
        # Verificar que el usuario es trainer
        if not is_trainer(user):
            return Response(
                {'detail': 'Solo los entrenadores pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener perfil de staff del usuario
        try:
            staff_profile = user.staff_profile
        except Staff.DoesNotExist:
            return Response(
                {'detail': 'No se encontró perfil de staff para este usuario'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        from apps.classes.models import GymClass
        from apps.members.models import Member
        
        now = timezone.now()
        today = now.date()
        
        # Clases de hoy
        classes_today = GymClass.objects.filter(
            instructor=staff_profile,
            start_datetime__date=today,
            is_cancelled=False
        ).count()
        
        # Clases de esta semana (lunes a domingo)
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        classes_week = GymClass.objects.filter(
            instructor=staff_profile,
            start_datetime__date__gte=week_start,
            start_datetime__date__lte=week_end,
            is_cancelled=False
        ).count()
        
        # Clientes asignados (miembros que han tomado clases con este trainer)
        # Usamos un enfoque simplificado: contar reservas únicas
        from apps.classes.models import Reservation
        assigned_clients = Reservation.objects.filter(
            gym_class__instructor=staff_profile,
            status__in=['confirmed', 'attended']
        ).values('member').distinct().count()
        
        # Total de sesiones del mes
        month_start = now.replace(day=1, hour=0, minute=0, second=0)
        total_sessions_month = GymClass.objects.filter(
            instructor=staff_profile,
            start_datetime__gte=month_start,
            start_datetime__lte=now,
            is_cancelled=False
        ).count()
        
        # Obtener lista de próximas clases
        upcoming_classes = GymClass.objects.filter(
            instructor=staff_profile,
            start_datetime__gte=now,
            is_cancelled=False
        ).select_related('class_type').annotate(
            participants_count=Count('reservations', filter=Q(reservations__status='confirmed'))
        ).order_by('start_datetime')[:5]
        
        # Formatear clases
        classes_list = []
        for gym_class in upcoming_classes:
            # Determinar si es hoy o fecha relativa
            class_date = gym_class.start_datetime.date()
            if class_date == today:
                date_str = 'Hoy'
            elif class_date == today + timedelta(days=1):
                date_str = 'Mañana'
            else:
                date_str = class_date.strftime('%d/%m')
            
            classes_list.append({
                'id': gym_class.id,
                'name': gym_class.class_type.name if gym_class.class_type else gym_class.title,
                'time': gym_class.start_datetime.strftime('%I:%M %p'),
                'date': date_str,
                'participants': gym_class.participants_count,
                'capacity': gym_class.capacity
            })
        
        # Obtener lista de clientes top
        # Clientes con más clases tomadas ordenados descendentemente
        clients_list = []
        member_ids = Reservation.objects.filter(
            gym_class__instructor=staff_profile,
            status__in=['confirmed', 'attended']
        ).values_list('member_id', flat=True).distinct()
        
        from apps.members.models import Member
        members = Member.objects.filter(
            id__in=member_ids
        ).select_related('user')[:5]
        
        for member in members:
            # Total de clases este mes
            classes_month = Reservation.objects.filter(
                member=member,
                gym_class__instructor=staff_profile,
                status='attended',
                gym_class__start_datetime__gte=month_start
            ).count()
            
            # Última visita
            last_reservation = Reservation.objects.filter(
                member=member,
                gym_class__instructor=staff_profile,
                status='attended'
            ).order_by('-gym_class__start_datetime').first()
            
            if last_reservation:
                last_date = last_reservation.gym_class.start_datetime.date()
                if last_date == today:
                    last_visit = 'Hoy'
                elif last_date == today - timedelta(days=1):
                    last_visit = 'Ayer'
                else:
                    days_ago = (today - last_date).days
                    last_visit = f'{days_ago} días'
            else:
                last_visit = 'Nunca'
            
            # Progreso (simplificado por ahora)
            if classes_month >= 12:
                progress = 'up'
            elif classes_month >= 6:
                progress = 'stable'
            else:
                progress = 'down'
            
            clients_list.append({
                'id': member.id,
                'name': member.user.get_full_name(),
                'classes': classes_month,
                'lastVisit': last_visit,
                'progress': progress
            })
        
        # Ordenar por clases este mes
        clients_list.sort(key=lambda x: x['classes'], reverse=True)
        
        return Response({
            'classes': {
                'today': classes_today,
                'week': classes_week,
                'list': classes_list
            },
            'clients': {
                'total': assigned_clients,
                'list': clients_list
            },
            'sessions': {'month': total_sessions_month}
        })
    
    @action(detail=False, methods=['get'])
    def my_classes(self, request):
        """
        Clases del trainer actual
        GET /api/staff/my-classes/?date=YYYY-MM-DD
        
        Parámetros opcionales:
            - date: Fecha específica (default: hoy)
            - upcoming: true para solo futuras
        
        Retorna: Lista de clases con detalles
        """
        user = request.user
        
        # Verificar que el usuario es trainer
        if not is_trainer(user):
            return Response(
                {'detail': 'Solo los entrenadores pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            staff_profile = user.staff_profile
        except Staff.DoesNotExist:
            return Response(
                {'detail': 'No se encontró perfil de staff para este usuario'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        from apps.classes.models import GymClass
        
        # Filtrar por fecha
        date_param = request.query_params.get('date')
        upcoming_param = request.query_params.get('upcoming')
        
        queryset = GymClass.objects.filter(
            instructor=staff_profile,
            is_cancelled=False
        ).select_related('class_type').prefetch_related('reservations')
        
        if upcoming_param:
            # Solo clases futuras
            queryset = queryset.filter(start_datetime__gte=timezone.now())
        elif date_param:
            # Fecha específica
            try:
                target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                queryset = queryset.filter(start_datetime__date=target_date)
            except ValueError:
                return Response(
                    {'detail': 'Formato de fecha inválido. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Por defecto: hoy
            queryset = queryset.filter(start_datetime__date=timezone.now().date())
        
        queryset = queryset.order_by('start_datetime')
        
        # Serializar manualmente para incluir info adicional
        classes_data = []
        for gym_class in queryset:
            confirmed_count = gym_class.reservations.filter(status='confirmed').count()
            classes_data.append({
                'id': gym_class.id,
                'title': gym_class.title,
                'class_type_name': gym_class.class_type.name,
                'start_datetime': gym_class.start_datetime,
                'end_datetime': gym_class.end_datetime,
                'location': gym_class.location,
                'capacity': gym_class.capacity,
                'confirmed_reservations': confirmed_count,
                'available_spots': gym_class.capacity - confirmed_count,
                'duration_minutes': int((gym_class.end_datetime - gym_class.start_datetime).total_seconds() / 60)
            })
        
        return Response(classes_data)
    
    @action(detail=False, methods=['get'])
    def my_clients(self, request):
        """
        Clientes del trainer actual
        GET /api/staff/my-clients/
        
        Retorna: Lista de clientes que han tomado clases con este trainer
        """
        user = request.user
        
        # Verificar que el usuario es trainer
        if not is_trainer(user):
            return Response(
                {'detail': 'Solo los entrenadores pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            staff_profile = user.staff_profile
        except Staff.DoesNotExist:
            return Response(
                {'detail': 'No se encontró perfil de staff para este usuario'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        from apps.classes.models import Reservation, GymClass
        from apps.members.models import Member
        
        # Obtener clientes únicos que han reservado clases con este trainer
        member_ids = Reservation.objects.filter(
            gym_class__instructor=staff_profile,
            status__in=['confirmed', 'attended']
        ).values_list('member_id', flat=True).distinct()
        
        members = Member.objects.filter(
            id__in=member_ids
        ).select_related('user')
        
        # Serializar con información adicional
        clients_data = []
        for member in members:
            # Total de clases tomadas con este trainer
            total_classes = Reservation.objects.filter(
                member=member,
                gym_class__instructor=staff_profile,
                status='attended'
            ).count()
            
            # Última clase asistida
            last_class = Reservation.objects.filter(
                member=member,
                gym_class__instructor=staff_profile,
                status='attended'
            ).order_by('-gym_class__start_datetime').first()
            
            clients_data.append({
                'id': member.id,
                'name': member.user.get_full_name(),
                'email': member.user.email,
                'phone': member.phone,
                'total_classes_with_trainer': total_classes,
                'last_class_date': last_class.gym_class.start_datetime if last_class else None,
                'subscription_status': member.subscription_status
            })
        
        # Ordenar por total de clases (clientes más activos primero)
        clients_data.sort(key=lambda x: x['total_classes_with_trainer'], reverse=True)
        
        return Response(clients_data)


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Schedule.objects.select_related('staff__user')
        
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)
        
        return queryset
