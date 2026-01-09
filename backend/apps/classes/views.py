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
    ReservationSerializer, RoutineSerializer, RoutineAssignmentSerializer
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
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GymClassListSerializer
        return GymClassSerializer
    
    def get_queryset(self):
        queryset = GymClass.objects.select_related('class_type', 'instructor__user')
        
        # Filtrar por fecha
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(start_datetime__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(start_datetime__date__lte=date_to)
        
        # Por defecto solo futuras
        if not date_from and self.action == 'list':
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
