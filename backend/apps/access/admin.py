"""
Admin para Modelos de Acceso
"""

from django.contrib import admin
from .models import AccessLog, AbandonmentAlert


@admin.register(AccessLog)
class AccessLogAdmin(admin.ModelAdmin):
    list_display = ['member', 'access_type', 'timestamp', 'registered_by']
    list_filter = ['access_type', 'timestamp']
    search_fields = ['member__user__email', 'member__user__first_name']
    date_hierarchy = 'timestamp'


@admin.register(AbandonmentAlert)
class AbandonmentAlertAdmin(admin.ModelAdmin):
    list_display = ['member', 'days_inactive', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['member__user__email']
