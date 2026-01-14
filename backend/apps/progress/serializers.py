"""
Serializers para Progreso y Tracking
Sistema de Gestión de Gimnasio
"""

from rest_framework import serializers
from .models import ProgressLog, Achievement, WorkoutSession, ExerciseLog


class ProgressLogSerializer(serializers.ModelSerializer):
    """Serializer para registros de progreso físico"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    bmi = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProgressLog
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer para logros del atleta"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    
    class Meta:
        model = Achievement
        fields = '__all__'
        read_only_fields = ['created_at']


class ExerciseLogSerializer(serializers.ModelSerializer):
    """Serializer para logs de ejercicios"""
    
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    muscle_group = serializers.CharField(source='exercise.muscle_group.name', read_only=True)
    
    class Meta:
        model = ExerciseLog
        fields = '__all__'


class ExerciseLogCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear logs (sin session, se agrega en nested)"""
    
    class Meta:
        model = ExerciseLog
        fields = ['exercise', 'routine_exercise', 'planned_sets', 'planned_reps', 
                  'actual_sets', 'actual_reps', 'weight_used', 'difficulty_rating', 
                  'completed', 'notes']


class WorkoutSessionSerializer(serializers.ModelSerializer):
    """Serializer completo para sesiones de entrenamiento"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    routine_name = serializers.CharField(source='routine.name', read_only=True)
    exercise_logs = ExerciseLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutSession
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class WorkoutSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear sesiones con logs anidados"""
    
    exercise_logs = ExerciseLogCreateSerializer(many=True)
    
    class Meta:
        model = WorkoutSession
        fields = ['member', 'routine', 'date', 'completed', 'duration_minutes', 
                  'notes', 'exercise_logs']
    
    def create(self, validated_data):
        logs_data = validated_data.pop('exercise_logs')
        session = WorkoutSession.objects.create(**validated_data)
        
        for log_data in logs_data:
            ExerciseLog.objects.create(session=session, **log_data)
        
        return session


class ProgressStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de progreso"""
    
    total_sessions = serializers.IntegerField()
    total_workouts_completed = serializers.IntegerField()
    current_weight = serializers.DecimalField(max_digits=5, decimal_places=2)
    weight_change = serializers.DecimalField(max_digits=5, decimal_places=2)
    latest_bmi = serializers.DecimalField(max_digits=4, decimal_places=2)
