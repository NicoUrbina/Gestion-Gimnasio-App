"""
ViewSets para Clases
"""
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import ClassType, GymClass, Reservation, Routine, RoutineAssignment
from .serializers import (
    ClassTypeSerializer, GymClassSerializer, GymClassListSerializer,
    ReservationSerializer, ReservationCreateSerializer, RoutineSerializer, RoutineAssignmentSerializer
)


class ClassTypeViewSet(viewsets.ModelViewSet):
    queryset = ClassType.objects.all()
    serializer_class = ClassTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return ClassType.objects.filter(is_active=True)
        return ClassType.objects.all()


class GymClassViewSet(viewsets.ModelViewSet):
    queryset = GymClass.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['class_type', 'instructor', 'is_cancelled']
    ordering_fields = ['start_datetime']
    ordering = ['start_datetime']
    
    def list(self, request, *args, **kwargs):
        # Desactivar paginación si se filtra por fechas (para el calendario)
        if request.query_params.get('date_from') and request.query_params.get('date_to'):
            self.pagination_class = None
        return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'list':
            return GymClassListSerializer
        return GymClassSerializer
    
    def get_queryset(self):
        queryset = GymClass.objects.select_related('class_type', 'instructor__user')
        
        # Filtrar por fecha
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from and date_to:
            # Si se especifican ambas fechas, usarlas exactamente
            queryset = queryset.filter(
                start_datetime__date__gte=date_from,
                start_datetime__date__lte=date_to
            )
        elif date_from:
            # Solo fecha de inicio
            queryset = queryset.filter(start_datetime__date__gte=date_from)
        elif date_to:
            # Solo fecha de fin
            queryset = queryset.filter(start_datetime__date__lte=date_to)
        else:
            # Sin filtros de fecha: mostrar solo futuras por defecto
            if self.action == 'list':
                queryset = queryset.filter(start_datetime__gte=timezone.now())
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancelar una clase"""
        gym_class = self.get_object()
        reason = request.data.get('reason', '')
        
        gym_class.is_cancelled = True
        gym_class.cancellation_reason = reason
        gym_class.save()
        
        # TODO: Notificar a los miembros inscritos
        
        return Response({'message': 'Clase cancelada'})
    
    @action(detail=True, methods=['get'])
    def reservations(self, request, pk=None):
        """Listar reservaciones de una clase"""
        gym_class = self.get_object()
        reservations = gym_class.reservations.select_related('member__user')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Reservation.objects.select_related('gym_class', 'member__user')
        
        # Miembros solo ven sus propias reservaciones
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        return queryset
    
    def get_serializer_class(self):
        """Usar serializer específico para creación"""
        if self.action == 'create':
            return ReservationCreateSerializer
        
        return ReservationSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create para agregar logging"""
        print(f"=== CREATE RESERVATION DEBUG ===")
        print(f"User: {request.user}")
        print(f"User ID: {request.user.id}")
        print(f"Has member_profile: {hasattr(request.user, 'member_profile')}")
        if hasattr(request.user, 'member_profile'):
            print(f"Member ID: {request.user.member_profile.id}")
        print(f"Request data: {request.data}")
        print(f"Serializer class: {self.get_serializer_class().__name__}")
        
        return super().create(request, *args, **kwargs)
    
    def get_serializer(self, *args, **kwargs):
        """Override para configurar serializer según contexto"""
        return super().get_serializer(*args, **kwargs)
    
    def perform_create(self, serializer):
        # Force the member to be the profile of the logged-in user
        # unless it's a staff member creating a reservation for someone else
        user = self.request.user
        
        # Para usuarios no-staff, siempre usar su propio member_profile
        if not (user.is_staff or (hasattr(user, 'role') and user.role and user.role.name in ['admin', 'staff', 'trainer'])):
            if hasattr(user, 'member_profile'):
                # Verificar si ya tiene una reserva para esta clase
                gym_class = serializer.validated_data['gym_class']
                existing_reservation = Reservation.objects.filter(
                    gym_class=gym_class,
                    member=user.member_profile,
                    status__in=['confirmed', 'waitlist']
                ).first()
                
                if existing_reservation:
                    from rest_framework.exceptions import ValidationError
                    if existing_reservation.status == 'confirmed':
                        raise ValidationError({'detail': 'Ya tienes una reserva confirmada para esta clase'})
                    elif existing_reservation.status == 'waitlist':
                        raise ValidationError({'detail': 'Ya estás en la lista de espera para esta clase'})
                
                serializer.save(member=user.member_profile)
            else:
                # Si el usuario no tiene member_profile, es un error
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'detail': 'Usuario no tiene perfil de miembro asociado'})
        else:
            # Staff/Admin pueden especificar member en el body, o usar su propio perfil si no se especifica
            if 'member' not in serializer.validated_data and hasattr(user, 'member_profile'):
                serializer.save(member=user.member_profile)
            else:
                serializer.save()
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancelar una reservación"""
        reservation = self.get_object()
        
        if reservation.cancel():
            return Response({'message': 'Reservación cancelada'})
        return Response(
            {'error': 'No se puede cancelar esta reservación'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def attend(self, request, pk=None):
        """Marcar asistencia"""
        reservation = self.get_object()
        
        if reservation.mark_attended():
            return Response({'message': 'Asistencia registrada'})
        return Response(
            {'error': 'No se puede registrar asistencia'},
            status=status.HTTP_400_BAD_REQUEST
        )


class RoutineViewSet(viewsets.ModelViewSet):
    queryset = Routine.objects.select_related('trainer__user').all()
    serializer_class = RoutineSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class RoutineAssignmentViewSet(viewsets.ModelViewSet):
    queryset = RoutineAssignment.objects.all()
    serializer_class = RoutineAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
