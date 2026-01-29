"""
Django Admin configuration for Audit models
"""
from django.contrib import admin
from django.utils.html import format_html
import json
from .models import AuditLog, UserSession


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin interface for audit logs - Read only."""
    
    list_display = [
        'id', 'timestamp', 'user_link', 'action_badge',
        'model_name', 'object_repr', 'ip_address', 'success_indicator'
    ]
    list_filter = ['action', 'model_name', 'success', 'timestamp']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'object_repr', 'ip_address']
    readonly_fields = [
        'user', 'action', 'model_name', 'object_id', 'object_repr',
        'changes_display', 'ip_address', 'user_agent', 'timestamp',
        'extra_data_display', 'success', 'error_message'
    ]
    date_hierarchy = 'timestamp'
    ordering = ['-timestamp']
    
    def has_add_permission(self, request):
        """Logs cannot be added manually."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Logs cannot be deleted (unless superuser)."""
        return request.user.is_superuser
    
    def has_change_permission(self, request, obj=None):
        """Logs cannot be edited."""
        return False
    
    def user_link(self, obj):
        """Display user as a link."""
        if obj.user:
            return format_html(
                '<a href="/admin/users/user/{}/change/">{}</a>',
                obj.user.id,
                obj.user.get_full_name()
            )
        return 'Sistema'
    user_link.short_description = 'Usuario'
    
    def action_badge(self, obj):
        """Display action with color coding."""
        colors = {
            'CREATE': '#10B981',
            'UPDATE': '#3B82F6',
            'DELETE': '#EF4444',
            'APPROVE': '#8B5CF6',
            'REJECT': '#F59E0B',
            'LOGIN': '#06B6D4',
            'LOGOUT': '#64748B',
            'FAILED_LOGIN': '#DC2626',
        }
        color = colors.get(obj.action, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>',
            color,
            obj.get_action_display()
        )
    action_badge.short_description = 'Acción'
    
    def success_indicator(self, obj):
        """Display success status with icon."""
        if obj.success:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    success_indicator.short_description = 'Éxito'
    
    def changes_display(self, obj):
        """Display changes in a formatted way."""
        if obj.changes:
            return format_html('<pre>{}</pre>', json.dumps(obj.changes, indent=2, ensure_ascii=False))
        return 'Sin cambios'
    changes_display.short_description = 'Cambios'
    
    def extra_data_display(self, obj):
        """Display extra data in a formatted way."""
        if obj.extra_data:
            return format_html('<pre>{}</pre>', json.dumps(obj.extra_data, indent=2, ensure_ascii=False))
        return 'Sin datos adicionales'
    extra_data_display.short_description = 'Datos Adicionales'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin interface for user sessions."""
    
    list_display = [
        'id', 'user_link', 'login_time', 'logout_time',
        'duration_display', 'ip_address', 'is_active_indicator'
    ]
    list_filter = ['is_active', 'login_time']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'ip_address']
    readonly_fields = [
        'user', 'session_key', 'ip_address', 'user_agent',
        'login_time', 'logout_time', 'is_active', 'location', 'duration_str'
    ]
    date_hierarchy = 'login_time'
    ordering = ['-login_time']
    
    def has_add_permission(self, request):
        """Sessions cannot be added manually."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Sessions can only be deleted by superuser."""
        return request.user.is_superuser
    
    def has_change_permission(self, request, obj=None):
        """Sessions are read-only."""
        return False
    
    def user_link(self, obj):
        """Display user as a link."""
        return format_html(
            '<a href="/admin/users/user/{}/change/">{}</a>',
            obj.user.id,
            obj.user.get_full_name()
        )
    user_link.short_description = 'Usuario'
    
    def is_active_indicator(self, obj):
        """Display active status with color."""
        if obj.is_active:
            return format_html('<span style="color: green; font-weight: bold;">Activa</span>')
        return format_html('<span style="color: gray;">Cerrada</span>')
    is_active_indicator.short_description = 'Estado'
    
    def duration_display(self, obj):
        """Display session duration."""
        return obj.duration_str
    duration_display.short_description = 'Duración'
