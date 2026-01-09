"""
Admin para Modelos de Clases
"""

from django.contrib import admin
from .models import ClassType, GymClass, Reservation, Routine, RoutineAssignment


@admin.register(ClassType)
class ClassTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'default_duration_minutes', 'default_capacity', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']


@admin.register(GymClass)
class GymClassAdmin(admin.ModelAdmin):
    list_display = ['title', 'class_type', 'instructor', 'start_datetime', 'capacity', 'available_spots', 'is_cancelled']
    list_filter = ['class_type', 'instructor', 'is_cancelled', 'start_datetime']
    search_fields = ['title', 'instructor__user__first_name']
    date_hierarchy = 'start_datetime'
    
    def available_spots(self, obj):
        return obj.available_spots
    available_spots.short_description = 'Cupos disponibles'


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['member', 'gym_class', 'status', 'reserved_at']
    list_filter = ['status', 'reserved_at']
    search_fields = ['member__user__email', 'gym_class__title']


@admin.register(Routine)
class RoutineAdmin(admin.ModelAdmin):
    list_display = ['name', 'trainer', 'difficulty_level', 'duration_minutes', 'is_active']
    list_filter = ['difficulty_level', 'is_active', 'trainer']
    search_fields = ['name']


@admin.register(RoutineAssignment)
class RoutineAssignmentAdmin(admin.ModelAdmin):
    list_display = ['member', 'routine', 'assigned_by', 'assigned_at']
    list_filter = ['assigned_at', 'routine']
