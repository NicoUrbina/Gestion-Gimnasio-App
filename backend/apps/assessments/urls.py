"""
URLs para Evaluaciones Físicas
Sistema de Gestión de Gimnasio
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FitnessAssessmentViewSet, GoalViewSet, NutritionPlanViewSet

router = DefaultRouter()
router.register('assessments', FitnessAssessmentViewSet, basename='assessment')
router.register('goals', GoalViewSet, basename='goal')
router.register('nutrition-plans', NutritionPlanViewSet, basename='nutrition-plan')

urlpatterns = [
    path('', include(router.urls)),
]
