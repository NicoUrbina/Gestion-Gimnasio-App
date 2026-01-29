"""
Serializers for Audit API
"""
from rest_framework import serializers
from .models import AuditLog, UserSession


class AuditLogSerializer(serializers.ModelSerializer):
    """Full audit log serializer with all details."""
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    changes_summary = serializers.CharField(source='get_changes_summary', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_name', 'action', 'action_display',
            'model_name', 'object_id', 'object_repr',
            'changes', 'changes_summary',
            'ip_address', 'user_agent', 'timestamp',
            'extra_data', 'success', 'error_message'
        ]
        read_only_fields = fields


class AuditLogListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view."""
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user_name', 'action', 'action_display',
            'model_name', 'object_repr', 'timestamp', 'success'
        ]
        read_only_fields = fields


class UserSessionSerializer(serializers.ModelSerializer):
    """User session serializer."""
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    duration_str = serializers.CharField(read_only=True)
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'user_name', 'session_key',
            'ip_address', 'user_agent', 'login_time',
            'logout_time', 'is_active', 'location',
            'duration_str'
        ]
        read_only_fields = fields


class AuditStatsSerializer(serializers.Serializer):
    """Statistics serializer."""
    
    total_today = serializers.IntegerField()
    total_week = serializers.IntegerField()
    total_month = serializers.IntegerField()
    
    actions_by_type = serializers.DictField()
    top_users = serializers.ListField()
    recent_critical = serializers.ListField()
    
    failed_logins_today = serializers.IntegerField()
    active_sessions = serializers.IntegerField()
