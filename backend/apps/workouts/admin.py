from django.contrib import admin
from .models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise


@admin.register(MuscleGroup)
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'muscle_group', 'difficulty', 'is_active', 'created_by']
    list_filter = ['difficulty', 'is_active', 'muscle_group']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


class RoutineExerciseInline(admin.TabularInline):
    model = RoutineExercise
    extra = 1
    fields = ['exercise', 'day_of_week', 'order', 'sets', 'reps', 'rest_seconds', 'weight_kg', 'notes']


@admin.register(WorkoutRoutine)
class WorkoutRoutineAdmin(admin.ModelAdmin):
    list_display = ['name', 'member', 'trainer', 'duration_weeks', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'member__user__first_name', 'member__user__last_name']
    readonly_fields = ['created_at', 'updated_at', 'notified_at']
    inlines = [RoutineExerciseInline]
