"""
Serializers para Rutinas y Ejercicios
Sistema de Gestión de Gimnasio
"""

from rest_framework import serializers
from .models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise
from apps.progress.models import WorkoutSession, ExerciseLog


class MuscleGroupSerializer(serializers.ModelSerializer):
    """Serializer para grupos musculares"""
    
    class Meta:
        model = MuscleGroup
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer para ejercicios"""
    
    muscle_group_name = serializers.CharField(source='muscle_group.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.user.get_full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    """Serializer para ejercicios dentro de una rutina"""
    
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    muscle_group = serializers.CharField(source='exercise.muscle_group.name', read_only=True)
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
    """Serializer completo para rutinas con optimización de queries"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    member_email = serializers.CharField(source='member.user.email', read_only=True)
    trainer_name = serializers.CharField(source='trainer.user.get_full_name', read_only=True)
    exercises = RoutineExerciseSerializer(many=True, read_only=True)
    exercise_count = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkoutRoutine
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'notified_at']
    
    def get_exercise_count(self, obj):
        """Contador de ejercicios en la rutina"""
        return obj.exercises.count()


class WorkoutRoutineCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear rutinas con ejercicios anidados"""
    
    exercises = RoutineExerciseCreateSerializer(many=True)
    
    class Meta:
        model = WorkoutRoutine
        fields = ['member', 'trainer', 'name', 'description', 'goal', 'duration_weeks', 'is_active', 'exercises']
        read_only_fields = ['trainer']
    
    def validate(self, data):
        """Validar que solo haya una rutina activa por miembro"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"=== VALIDATING ROUTINE DATA ===")
        logger.info(f"Data keys: {data.keys()}")
        logger.info(f"Member: {data.get('member')}")
        logger.info(f"Exercises count: {len(data.get('exercises', []))}")
        
        # Log each exercise
        for idx, ex in enumerate(data.get('exercises', [])):
            logger.info(f"  Exercise {idx}: {ex}")
            if 'exercise' not in ex:
                logger.error(f"  ❌ MISSING 'exercise' field in exercise {idx}!")
        
        if data.get('is_active', False):
            member = data.get('member')
            # Si está actualizando, excluir la rutina actual
            existing_active = WorkoutRoutine.objects.filter(
                member=member,
                is_active=True
            )
            if self.instance:
                existing_active = existing_active.exclude(pk=self.instance.pk)
            
            if existing_active.exists():
                raise serializers.ValidationError({
                    'is_active': f'El miembro {member.user.get_full_name()} ya tiene una rutina activa. Desactívala primero.'
                })
        
        # Validar que haya al menos un ejercicio
        if 'exercises' in data and len(data['exercises']) == 0:
            raise serializers.ValidationError({
                'exercises': 'La rutina debe tener al menos un ejercicio.'
            })
        
        return data
    
    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        routine = WorkoutRoutine.objects.create(**validated_data)
        
        for exercise_data in exercises_data:
            RoutineExercise.objects.create(routine=routine, **exercise_data)
        
        return routine
    
    def update(self, instance, validated_data):
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"=== UPDATING ROUTINE {instance.id} ===")
        logger.info(f"Validated data keys: {validated_data.keys()}")
        
        exercises_data = validated_data.pop('exercises', None)
        logger.info(f"Exercises data: {exercises_data}")
        
        # Actualizar rutina
        for attr, value in validated_data.items():
            logger.info(f"Setting {attr} = {value}")
            setattr(instance, attr, value)
        instance.save()
        logger.info("Routine fields updated")
        
        # Si se proporcionaron ejercicios, reemplazar todos
        if exercises_data is not None:
            logger.info(f"Deleting {instance.exercises.count()} existing exercises")
            instance.exercises.all().delete()
            for idx, exercise_data in enumerate(exercises_data):
                logger.info(f"Creating exercise {idx}: {exercise_data}")
                RoutineExercise.objects.create(routine=instance, **exercise_data)
            logger.info(f"Created {len(exercises_data)} new exercises")
        
        logger.info("Update complete")
        return instance


class ExerciseLogSerializer(serializers.ModelSerializer):
    """Serializer para logs de ejercicios completados"""
    
    exercise_name = serializers.CharField(source='routine_exercise.exercise.name', read_only=True)
    muscle_group = serializers.CharField(source='routine_exercise.exercise.muscle_group.name', read_only=True)
    planned_sets = serializers.IntegerField(source='routine_exercise.sets', read_only=True)
    planned_reps = serializers.IntegerField(source='routine_exercise.reps', read_only=True)
    avg_reps_per_set = serializers.SerializerMethodField()
    
    class Meta:
        model = ExerciseLog
        fields = '__all__'
        read_only_fields = ['completed_at']
    
    def get_avg_reps_per_set(self, obj):
        """Calcular promedio de reps por serie"""
        if obj.actual_sets > 0:
            return round(obj.actual_reps / obj.actual_sets, 1)
        return 0


class WorkoutSessionSerializer(serializers.ModelSerializer):
    """Serializer para sesiones de entrenamiento"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    routine_name = serializers.CharField(source='routine.name', read_only=True)
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    exercise_logs = ExerciseLogSerializer(many=True, read_only=True)
    completed_exercises_count = serializers.SerializerMethodField()
    total_exercises_count = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkoutSession
        fields = '__all__'
        read_only_fields = ['date']
    
    def get_completed_exercises_count(self, obj):
        """Contador de ejercicios completados"""
        return obj.exercise_logs.count()
    
    def get_total_exercises_count(self, obj):
        """Total de ejercicios planeados para este día"""
        if obj.routine and obj.day_of_week:
            return obj.routine.exercises.filter(day_of_week=obj.day_of_week).count()
        return 0


class WorkoutSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer para iniciar sesión de entrenamiento"""
    
    class Meta:
        model = WorkoutSession
        fields = ['member', 'routine', 'day_of_week', 'notes']


class ExerciseLogCreateSerializer(serializers.ModelSerializer):
    """Serializer para marcar ejercicio como completado"""
    
    class Meta:
        model = ExerciseLog
        fields = ['session', 'routine_exercise', 'exercise', 'actual_sets', 'actual_reps', 
                  'weight_used', 'difficulty_rating', 'notes', 'planned_sets', 'planned_reps']
