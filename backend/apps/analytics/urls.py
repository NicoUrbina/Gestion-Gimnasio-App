"""
URLs para la aplicación Analytics
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MetricTypeViewSet, AthleteMetricViewSet, MetricSnapshotViewSet,
    PerformanceGoalViewSet, TrainingLogViewSet, GymSettingsViewSet, AuditLogViewSet
)

router = DefaultRouter()
router.register(r'metric-types', MetricTypeViewSet, basename='metric-type')
router.register(r'metrics', AthleteMetricViewSet, basename='athlete-metric')
router.register(r'snapshots', MetricSnapshotViewSet, basename='metric-snapshot')
router.register(r'goals', PerformanceGoalViewSet, basename='performance-goal')
router.register(r'training-logs', TrainingLogViewSet, basename='training-log')
router.register(r'settings', GymSettingsViewSet, basename='gym-settings')
router.register(r'audit', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('', include(router.urls)),
]
