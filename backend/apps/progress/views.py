"""
Views para Progreso y Tracking
Sistema de Gestión de Gimnasio
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Avg, Max, Min
from datetime import timedelta

from .models import ProgressLog, Achievement, WorkoutSession, ExerciseLog
from .serializers import (
    ProgressLogSerializer,
    AchievementSerializer,
    WorkoutSessionSerializer,
    WorkoutSessionCreateSerializer,
    ExerciseLogSerializer,
    ProgressStatsSerializer
)


class ProgressLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet para registros de progreso físico
    
    Endpoints:
    - GET /progress/logs/ - Lista de registros
    - POST /progress/logs/ - Crear registro (atleta actualiza datos)
    - GET /progress/logs/{id}/ - Detalle
    - PUT/PATCH /progress/logs/{id}/ - Actualizar
    - GET /progress/logs/evolution/ - Datos para gráficas
    """
    
    serializer_class = ProgressLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return ProgressLog.objects.filter(member__user=user)
        elif user.role.name in ['Entrenador', 'Administrador']:
            return ProgressLog.objects.all().select_related('member__user')
        
        return ProgressLog.objects.none()
    
    def perform_create(self, serializer):
        """Auto-asignar member si es cliente"""
        if self.request.user.role.name == 'Miembro':
            serializer.save(
                member=self.request.user.member,
                registered_by=self.request.user
            )
        else:
            serializer.save(registered_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def evolution(self, request):
        """
        Datos de evolución física para gráficas
        GET /progress/logs/evolution/
        Query params: ?days=30
        """
        days = int(request.query_params.get('days', 90))
        
        if request.user.role.name == 'Miembro':
            member = request.user.member
        else:
            member_id = request.query_params.get('member_id')
            if not member_id:
                return Response(
                    {'error': 'Se requiere member_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            member = member_id
        
        since_date = timezone.now().date() - timedelta(days=days)
        logs = ProgressLog.objects.filter(
            member=member,
            date__gte=since_date
        ).order_by('date')
        
        # Preparar datos para gráficas
        evolution_data = {
            'dates': [log.date.isoformat() for log in logs],
            'weight': [float(log.weight) if log.weight else None for log in logs],
            'body_fat': [float(log.body_fat_percentage) if log.body_fat_percentage else None for log in logs],
            'muscle_mass': [float(log.muscle_mass) if log.muscle_mass else None for log in logs],
            'chest': [float(log.chest) if log.chest else None for log in logs],
            'waist': [float(log.waist) if log.waist else None for log in logs],
            'hips': [float(log.hips) if log.hips else None for log in logs],
            'bmi': [log.bmi for log in logs],
        }
        
        return Response(evolution_data)


class AchievementViewSet(viewsets.ModelViewSet):
    """ViewSet para logros del atleta"""
    
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return Achievement.objects.filter(member__user=user)
        elif user.role.name in ['Entrenador', 'Administrador']:
            return Achievement.objects.all().select_related('member__user')
        
        return Achievement.objects.none()


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para sesiones de entrenamiento
    
    Endpoints:
    - GET /progress/sessions/ - Lista de sesiones
    - POST /progress/sessions/ - Crear sesión con logs
    - GET /progress/sessions/{id}/ - Detalle
    - POST /progress/sessions/{id}/add_feedback/ - Trainer agrega feedback
    - GET /progress/sessions/stats/ - Estadísticas
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return WorkoutSessionCreateSerializer
        return WorkoutSessionSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return WorkoutSession.objects.filter(member__user=user).prefetch_related('exercise_logs__exercise')
        elif user.role.name in ['Entrenador', 'Administrador']:
            return WorkoutSession.objects.all().select_related('member__user', 'routine').prefetch_related('exercise_logs__exercise')
        
        return WorkoutSession.objects.none()
    
    def perform_create(self, serializer):
        """Auto-asignar member si es cliente"""
        if self.request.user.role.name == 'Miembro':
            serializer.save(member=self.request.user.member)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'])
    def add_feedback(self, request, pk=None):
        """
        Trainer agrega feedback a sesión
        POST /progress/sessions/{id}/add_feedback/
        Body: { trainer_feedback: "..." }
        """
        session = self.get_object()
        feedback = request.data.get('trainer_feedback', '')
        
        session.trainer_feedback = feedback
        session.save()
        
        return Response(WorkoutSessionSerializer(session).data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Estadísticas de entrenamiento
        GET /progress/sessions/stats/
        """
        if request.user.role.name == 'Miembro':
            member = request.user.member
        else:
            member_id = request.query_params.get('member_id')
            if not member_id:
                return Response(
                    {'error': 'Se requiere member_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            from apps.members.models import Member
            member = Member.objects.get(id=member_id)
        
        sessions = WorkoutSession.objects.filter(member=member)
        completed_sessions = sessions.filter(completed=True)
        
        # Obtener último registro de peso
        latest_log = ProgressLog.objects.filter(member=member).order_by('-date').first()
        first_log = ProgressLog.objects.filter(member=member).order_by('date').first()
        
        stats_data = {
            'total_sessions': sessions.count(),
            'total_workouts_completed': completed_sessions.count(),
            'current_weight': float(latest_log.weight) if latest_log and latest_log.weight else 0,
            'weight_change': float(latest_log.weight - first_log.weight) if (latest_log and first_log and latest_log.weight and first_log.weight) else 0,
            'latest_bmi': latest_log.bmi if latest_log else 0,
        }
        
        serializer = ProgressStatsSerializer(stats_data)
        return Response(serializer.data)


class ExerciseLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet read-only para logs de ejercicios individuales"""
    
    serializer_class = ExerciseLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return ExerciseLog.objects.filter(session__member__user=user).select_related('exercise', 'session')
        elif user.role.name in ['Entrenador', 'Administrador']:
            return ExerciseLog.objects.all().select_related('exercise', 'session__member')
        
        return ExerciseLog.objects.none()
    
    @action(detail=False, methods=['get'])
    def exercise_history(self, request):
        """
        Historial de un ejercicio específico
        GET /progress/exercise-logs/exercise_history/?exercise_id=1
        """
        exercise_id = request.query_params.get('exercise_id')
        if not exercise_id:
            return Response(
                {'error': 'Se requi exercise_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.user.role.name == 'Miembro':
            member = request.user.member
        else:
            member_id = request.query_params.get('member_id')
            if not member_id:
                return Response(
                    {'error': 'Se requiere member_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            from apps.members.models import Member
            member = Member.objects.get(id=member_id)
        
        logs = ExerciseLog.objects.filter(
            session__member=member,
            exercise_id=exercise_id,
            completed=True
        ).select_related('session').order_by('session__date')
        
        history_data = {
            'dates': [log.session.date.isoformat() for log in logs],
            'weights': [float(log.weight_used) for log in logs],
            'sets': [log.actual_sets for log in logs],
            'reps': [log.actual_reps for log in logs],
            'total_volume': [float(log.weight_used) * log.actual_sets * log.actual_reps for log in logs],
        }
        
        return Response(history_data)
