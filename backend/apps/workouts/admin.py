"""
Admin para Modelos de Rutinas y Ejercicios
"""

from django.contrib import admin
from .models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise


@admin.register(MuscleGroup)
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'muscle_group', 'difficulty', 'is_active', 'created_by']
    list_filter = ['muscle_group', 'difficulty', 'is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


class RoutineExerciseInline(admin.TabularInline):
    model = RoutineExercise
    extra = 1
    fields = ['exercise', 'day_of_week', 'order', 'sets', 'reps', 'rest_seconds', 'weight_kg']


@admin.register(WorkoutRoutine)
class WorkoutRoutineAdmin(admin.ModelAdmin):
    list_display = ['name', 'member', 'trainer', 'is_active', 'duration_weeks', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'member__user__email', 'trainer__user__email']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [RoutineExerciseInline]
