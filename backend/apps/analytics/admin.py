"""Admin para Analytics del Atleta"""
from django.contrib import admin
from .models import MetricType, AthleteMetric, MetricSnapshot, PerformanceGoal, TrainingLog, GymSettings, AuditLog

@admin.register(MetricType)
class MetricTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'unit', 'is_higher_better', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name']

@admin.register(AthleteMetric)
class AthleteMetricAdmin(admin.ModelAdmin):
    list_display = ['member', 'metric_type', 'value', 'recorded_date', 'source']
    list_filter = ['metric_type', 'recorded_date']
    search_fields = ['member__user__email']
    date_hierarchy = 'recorded_date'

@admin.register(MetricSnapshot)
class MetricSnapshotAdmin(admin.ModelAdmin):
    list_display = ['member', 'period_type', 'period_start', 'period_end']
    list_filter = ['period_type']

@admin.register(PerformanceGoal)
class PerformanceGoalAdmin(admin.ModelAdmin):
    list_display = ['member', 'metric_type', 'initial_value', 'target_value', 'status', 'target_date']
    list_filter = ['status', 'metric_type']

@admin.register(TrainingLog)
class TrainingLogAdmin(admin.ModelAdmin):
    list_display = ['member', 'date', 'training_type', 'duration_minutes', 'intensity']
    list_filter = ['training_type', 'intensity', 'date']
    date_hierarchy = 'date'

@admin.register(GymSettings)
class GymSettingsAdmin(admin.ModelAdmin):
    list_display = ['gym_name', 'email', 'phone']

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'model_name', 'created_at', 'ip_address']
    list_filter = ['action', 'created_at']
    search_fields = ['description']
    date_hierarchy = 'created_at'
