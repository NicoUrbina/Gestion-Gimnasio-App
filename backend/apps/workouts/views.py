"""
Views para Rutinas y Ejercicios
Sistema de Gestión de Gimnasio
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q

from .models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise
from apps.progress.models import WorkoutSession, ExerciseLog
from .permissions import (
    IsTrainerOrAdmin,
    IsTrainerOrAdminOrReadOnly,
    CanManageRoutines,
    CanLogExercises
)
from .serializers import (
    MuscleGroupSerializer,
    ExerciseSerializer,
    WorkoutRoutineSerializer,
    WorkoutRoutineCreateSerializer,
    RoutineExerciseSerializer,
    WorkoutSessionSerializer,
    WorkoutSessionCreateSerializer,
    ExerciseLogSerializer,
    ExerciseLogCreateSerializer
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
    permission_classes = [IsAuthenticated, IsTrainerOrAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros opcionales
        muscle_group = self.request.query_params.get('muscle_group', None)
        difficulty = self.request.query_params.get('difficulty', None)
        search = self.request.query_params.get('search', None)
        
        if muscle_group:
            queryset = queryset.filter(muscle_group_id=muscle_group)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
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
    
    permission_classes = [IsAuthenticated, CanManageRoutines]
    
    def get_queryset(self):
        user = self.request.user
        # Usar role_name de manera segura
        role_name = getattr(user, 'role_name', None) or (user.role.name if hasattr(user, 'role') and user.role else None)
        
        if role_name == 'member':
            # Clientes solo ven sus rutinas
            return WorkoutRoutine.objects.filter(member__user=user).prefetch_related('exercises__exercise__muscle_group')
        elif role_name in ['trainer', 'admin', 'staff']:
            # Staff/Trainers/Admins ven todas
            return WorkoutRoutine.objects.all().select_related('member__user', 'trainer__user').prefetch_related('exercises__exercise__muscle_group')
        
        return WorkoutRoutine.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return WorkoutRoutineCreateSerializer
        return WorkoutRoutineSerializer
    
    def perform_create(self, serializer):
        """Auto-assign trainer from logged-in user if they are a trainer"""
        trainer = None
        if hasattr(self.request.user, 'staff_profile'):  # ✅ Changed from 'staff' to 'staff_profile'
            trainer = self.request.user.staff_profile
        serializer.save(trainer=trainer)
    
    def perform_update(self, serializer):
        """Preserve trainer on update or assign if missing"""
        # If the user is a trainer, assign them as the trainer
        if hasattr(self.request.user, 'staff_profile'):  # ✅ Changed from 'staff' to 'staff_profile'
            serializer.save(trainer=self.request.user.staff_profile)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_routine(self, request):
        """
        Obtener rutina activa del cliente autenticado
        GET /routines/my_routine/
        """
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"=== MY_ROUTINE REQUEST ===")
        logger.info(f"User: {request.user}")
        logger.info(f"User has 'member': {hasattr(request.user, 'member')}")
        logger.info(f"User has 'member_profile': {hasattr(request.user, 'member_profile')}")
        
        try:
            member = request.user.member_profile  # ✅ Changed from 'member' to 'member_profile'
            logger.info(f"Member found: {member}")
        except Exception as e:
            logger.error(f"Error getting member: {str(e)}")
            return Response(
                {'error': 'Usuario no es un miembro'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        routine = WorkoutRoutine.objects.filter(
            member=member,
            is_active=True
        ).prefetch_related('exercises__exercise__muscle_group').first()
        
        logger.info(f"Routine found: {routine}")
        
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
    
    queryset = RoutineExercise.objects.all().select_related('routine', 'exercise__muscle_group')
    serializer_class = RoutineExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        routine_id = self.request.query_params.get('routine', None)
        day_of_week = self.request.query_params.get('day', None)
        
        if routine_id:
            queryset = queryset.filter(routine_id=routine_id)
        if day_of_week:
            queryset = queryset.filter(day_of_week=day_of_week)
        
        return queryset


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para sesiones de entrenamiento
    
    Endpoints:
    - GET /sessions/ - Lista de sesiones
    - POST /sessions/ - Iniciar nueva sesión
    - GET /sessions/{id}/ - Detalle de sesión
    - POST /sessions/{id}/complete/ - Marcar sesión como completada
    - GET /sessions/my_sessions/ - Historial del miembro autenticado
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            # Miembros solo ven sus sesiones
            return WorkoutSession.objects.filter(member__user=user).select_related(
                'member__user', 'routine'
            ).prefetch_related('exercise_logs__routine_exercise__exercise')
        elif user.role.name in ['Entrenador', 'Administrador']:
            # Staff ve todas
            return WorkoutSession.objects.all().select_related(
                'member__user', 'routine'
            ).prefetch_related('exercise_logs__routine_exercise__exercise')
        
        return WorkoutSession.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return WorkoutSessionCreateSerializer
        return WorkoutSessionSerializer
    
    @action(detail=False, methods=['get'])
    def my_sessions(self, request):
        """
        Obtener historial de sesiones del miembro autenticado
        GET /sessions/my_sessions/
        """
        try:
            member = request.user.member
        except:
            return Response(
                {'error': 'Usuario no es un miembro'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        sessions = WorkoutSession.objects.filter(
            member=member
        ).select_related('routine').prefetch_related('exercise_logs').order_by('-date')
        
        serializer = WorkoutSessionSerializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Marcar sesión como completada
        POST /sessions/{id}/complete/
        """
        session = self.get_object()
        
        if session.completed:
            return Response(
                {'message': 'La sesión ya estaba completada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.completed = True
        session.duration_minutes = request.data.get('duration_minutes', None)
        session.save()
        
        return Response(WorkoutSessionSerializer(session).data)


class ExerciseLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet para logs de ejercicios
    
    Endpoints:
    - GET /exercise-logs/ - Lista de logs
    - POST /exercise-logs/ - Registrar ejercicio completado
    - GET /exercise-logs/{id}/ - Detalle de log
    - GET /exercise-logs/progress/{routine_exercise_id}/ - Progreso de un ejercicio específico
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return ExerciseLog.objects.filter(
                session__member__user=user
            ).select_related('session', 'routine_exercise__exercise', 'exercise')
        elif user.role.name in ['Entrenador', 'Administrador']:
            return ExerciseLog.objects.all().select_related(
                'session__member__user', 'routine_exercise__exercise', 'exercise'
            )
        
        return ExerciseLog.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExerciseLogCreateSerializer
        return ExerciseLogSerializer
    
    @action(detail=False, methods=['get'])
    def progress(self, request):
        """
        Obtener progreso histórico de un ejercicio específico
        GET /exercise-logs/progress/?routine_exercise={id}
        """
        routine_exercise_id = request.query_params.get('routine_exercise', None)
        
        if not routine_exercise_id:
            return Response(
                {'error': 'Parámetro routine_exercise es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logs = ExerciseLog.objects.filter(
            routine_exercise_id=routine_exercise_id
        ).order_by('session__date')
        
        serializer = ExerciseLogSerializer(logs, many=True)
        return Response(serializer.data)
