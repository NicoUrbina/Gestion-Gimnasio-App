"""
URLs para la aplicación Progress
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressLogViewSet, AchievementViewSet

router = DefaultRouter()
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'', ProgressLogViewSet, basename='progress-log')

urlpatterns = [
    path('', include(router.urls)),
]
