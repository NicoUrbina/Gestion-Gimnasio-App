"""
Serializers para Analytics
"""
from rest_framework import serializers
from .models import (
    MetricType, AthleteMetric, MetricSnapshot,
    PerformanceGoal, TrainingLog, GymSettings, AuditLog
)


class MetricTypeSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    unit_display = serializers.CharField(source='get_unit_display', read_only=True)
    
    class Meta:
        model = MetricType
        fields = [
            'id', 'name', 'description', 'category', 'category_display',
            'unit', 'unit_display', 'custom_unit', 'is_higher_better',
            'min_value', 'max_value', 'color', 'icon', 'is_active', 'created_at'
        ]
        read_only_fields = ['created_at']


class AthleteMetricSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    metric_name = serializers.CharField(source='metric_type.name', read_only=True)
    unit = serializers.CharField(source='metric_type.get_unit_display', read_only=True)
    
    class Meta:
        model = AthleteMetric
        fields = [
            'id', 'member', 'member_name', 'metric_type', 'metric_name',
            'value', 'unit', 'recorded_date', 'recorded_time', 'notes',
            'recorded_by', 'source', 'created_at'
        ]
        read_only_fields = ['created_at']


class MetricSnapshotSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    period_type_display = serializers.CharField(source='get_period_type_display', read_only=True)
    
    class Meta:
        model = MetricSnapshot
        fields = [
            'id', 'member', 'member_name', 'period_type', 'period_type_display',
            'period_start', 'period_end', 'metrics_data', 'summary', 'generated_at'
        ]
        read_only_fields = ['generated_at']


class PerformanceGoalSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    metric_name = serializers.CharField(source='metric_type.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    progress_percentage = serializers.FloatField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_on_track = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = PerformanceGoal
        fields = [
            'id', 'member', 'member_name', 'metric_type', 'metric_name',
            'initial_value', 'target_value', 'current_value',
            'start_date', 'target_date', 'status', 'status_display',
            'achieved_date', 'notes', 'progress_percentage',
            'days_remaining', 'is_on_track', 'created_at', 'updated_at'
        ]
        read_only_fields = ['achieved_date', 'created_at', 'updated_at']


class TrainingLogSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    intensity_display = serializers.CharField(source='get_intensity_display', read_only=True)
    
    class Meta:
        model = TrainingLog
        fields = [
            'id', 'member', 'member_name', 'date', 'duration_minutes',
            'training_type', 'intensity', 'intensity_display',
            'calories_burned', 'gym_class', 'routine', 'exercises_data',
            'notes', 'mood_before', 'mood_after', 'created_at'
        ]
        read_only_fields = ['created_at']


class GymSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymSettings
        fields = [
            'gym_name', 'address', 'phone', 'email',
            'opening_time', 'closing_time',
            'days_for_abandonment_alert', 'days_for_renewal_reminder',
            'logo_url', 'primary_color', 'updated_at'
        ]
        read_only_fields = ['updated_at']


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'action', 'action_display',
            'model_name', 'object_id', 'description',
            'old_values', 'new_values', 'ip_address', 'created_at'
        ]
        read_only_fields = ['created_at']
