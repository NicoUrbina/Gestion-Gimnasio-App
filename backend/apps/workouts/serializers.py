"""
Serializers para Rutinas y Ejercicios
Sistema de Gestión de Gimnasio
"""

from rest_framework import serializers
from .models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise


class MuscleGroupSerializer(serializers.ModelSerializer):
    """Serializer para grupos musculares"""
    
    class Meta:
        model = MuscleGroup
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer para ejercicios"""
    
    muscle_group_name = serializers.CharField(source='muscle_group.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.user.get_full_name', read_only=True)
    
    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    """Serializer para ejercicios dentro de una rutina"""
    
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = RoutineExercise
        fields = '__all__'


class RoutineExerciseCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear ejercicios en rutina (solo IDs)"""
    
    class Meta:
        model = RoutineExercise
        fields = ['exercise', 'day_of_week', 'order', 'sets', 'reps', 'rest_seconds', 'weight_kg', 'notes']


class WorkoutRoutineSerializer(serializers.ModelSerializer):
    """Serializer completo para rutinas"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    trainer_name = serializers.CharField(source='trainer.user.get_full_name', read_only=True)
    exercises = RoutineExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutRoutine
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'notified_at']


class WorkoutRoutineCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear rutinas con ejercicios anidados"""
    
    exercises = RoutineExerciseCreateSerializer(many=True)
    
    class Meta:
        model = WorkoutRoutine
        fields = ['member', 'trainer', 'name', 'description', 'goal', 'duration_weeks', 'is_active', 'exercises']
    
    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        routine = WorkoutRoutine.objects.create(**validated_data)
        
        for exercise_data in exercises_data:
            RoutineExercise.objects.create(routine=routine, **exercise_data)
        
        return routine
