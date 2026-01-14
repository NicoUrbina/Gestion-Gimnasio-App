"""
URLs para Progreso y Tracking
Sistema de Gestión de Gimnasio
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressLogViewSet, AchievementViewSet, WorkoutSessionViewSet, ExerciseLogViewSet

router = DefaultRouter()
router.register('logs', ProgressLogViewSet, basename='progress-log')
router.register('achievements', AchievementViewSet, basename='achievement')
router.register('sessions', WorkoutSessionViewSet, basename='workout-session')
router.register('exercise-logs', ExerciseLogViewSet, basename='exercise-log')

urlpatterns = [
    path('', include(router.urls)),
]
