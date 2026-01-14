"""
Views para Rutinas y Ejercicios
Sistema de Gestión de Gimnasio
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise
from .serializers import (
    MuscleGroupSerializer,
    ExerciseSerializer,
    WorkoutRoutineSerializer,
    WorkoutRoutineCreateSerializer,
    RoutineExerciseSerializer
)


class MuscleGroupViewSet(viewsets.ModelViewSet):
    """ViewSet para grupos musculares"""
    
    queryset = MuscleGroup.objects.all()
    serializer_class = MuscleGroupSerializer
    permission_classes = [IsAuthenticated]


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    ViewSet para biblioteca de ejercicios
    
    Endpoints:
    - GET /exercises/ - Lista de ejercicios
    - POST /exercises/ - Crear ejercicio (solo trainers)
    - GET /exercises/{id}/ - Detalle de ejercicio
    - PUT/PATCH /exercises/{id}/ - Actualizar ejercicio
    - DELETE /exercises/{id}/ - Desactivar ejercicio
    """
    
    queryset = Exercise.objects.filter(is_active=True).select_related('muscle_group', 'created_by')
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros opcionales
        muscle_group = self.request.query_params.get('muscle_group', None)
        difficulty = self.request.query_params.get('difficulty', None)
        
        if muscle_group:
            queryset = queryset.filter(muscle_group_id=muscle_group)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        return queryset
    
    def perform_create(self, serializer):
        """Auto-asignar created_by si es staff"""
        if hasattr(self.request.user, 'staff'):
            serializer.save(created_by=self.request.user.staff)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        """Soft delete - solo desactivar"""
        instance.is_active = False
        instance.save()


class WorkoutRoutineViewSet(viewsets.ModelViewSet):
    """
    ViewSet para rutinas de entrenamiento
    
    Endpoints:
    - GET /routines/ - Lista de rutinas
    - POST /routines/ - Crear rutina con ejercicios (trainer)
    - GET /routines/{id}/ - Detalle de rutina
    - PUT/PATCH /routines/{id}/ - Actualizar rutina
    - POST /routines/{id}/activate/ - Activar rutina (desactiva otras)
    - POST /routines/{id}/notify/ - Notificar al cliente
    - GET /routines/my_routine/ - Rutina activa del cliente
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            # Clientes solo ven sus rutinas
            return WorkoutRoutine.objects.filter(member__user=user).prefetch_related('exercises__exercise')
        elif user.role.name in ['Entrenador', 'Administrador']:
            # Staff ve todas
            return WorkoutRoutine.objects.all().select_related('member__user', 'trainer__user').prefetch_related('exercises__exercise')
        
        return WorkoutRoutine.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return WorkoutRoutineCreateSerializer
        return WorkoutRoutineSerializer
    
    def perform_create(self, serializer):
        """Auto-asignar trainer si es staff"""
        if hasattr(self.request.user, 'staff'):
            serializer.save(trainer=self.request.user.staff)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_routine(self, request):
        """
        Obtener rutina activa del cliente autenticado
        GET /routines/my_routine/
        """
        try:
            member = request.user.member
        except:
            return Response(
                {'error': 'Usuario no es un miembro'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        routine = WorkoutRoutine.objects.filter(
            member=member,
            is_active=True
        ).prefetch_related('exercises__exercise').first()
        
        if not routine:
            return Response(
                {'message': 'No tienes una rutina activa asignada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = WorkoutRoutineSerializer(routine)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Activar rutina (desactiva otras del mismo miembro)
        POST /routines/{id}/activate/
        """
        routine = self.get_object()
        routine.is_active = True
        routine.save()  # El save() automáticamente desactiva otras
        
        return Response(WorkoutRoutineSerializer(routine).data)
    
    @action(detail=True, methods=['post'])
    def notify(self, request, pk=None):
        """
        Notificar al cliente sobre nueva rutina
        POST /routines/{id}/notify/
        """
        routine = self.get_object()
        
        if routine.notified_at:
            return Response(
                {'message': 'Cliente ya fue notificado anteriormente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TODO: Integrar con sistema de notificaciones
        routine.notified_at = timezone.now()
        routine.save()
        
        return Response({
            'message': 'Cliente notificado exitosamente',
            'notified_at': routine.notified_at
        })


class RoutineExerciseViewSet(viewsets.ModelViewSet):
    """ViewSet para manejar ejercicios individuales en rutinas"""
    
    queryset = RoutineExercise.objects.all().select_related('routine', 'exercise')
    serializer_class = RoutineExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        routine_id = self.request.query_params.get('routine', None)
        
        if routine_id:
            queryset = queryset.filter(routine_id=routine_id)
        
        return queryset
