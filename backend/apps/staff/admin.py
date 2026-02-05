"""
Admin para Modelos de Personal
"""

from django.contrib import admin
from .models import Staff, Schedule


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['user', 'staff_type', 'hire_date', 'is_instructor', 'is_active']
    list_filter = ['staff_type', 'is_instructor', 'is_active']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    
    def save_model(self, request, obj, form, change):
        """Sincronizar is_active entre Staff y User"""
        # Si is_active cambió, actualizar también el usuario
        if 'is_active' in form.changed_data:
            obj.user.is_active = obj.is_active
            obj.user.save(update_fields=['is_active'])
        super().save_model(request, obj, form, change)


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['staff', 'day_of_week', 'start_time', 'end_time', 'is_available']
    list_filter = ['day_of_week', 'is_available']
