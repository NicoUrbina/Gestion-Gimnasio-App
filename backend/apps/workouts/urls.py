"""
URLs para Rutinas y Ejercicios
Sistema de Gestión de Gimnasio
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MuscleGroupViewSet,
    ExerciseViewSet,
    WorkoutRoutineViewSet,
    RoutineExerciseViewSet,
    WorkoutSessionViewSet,
    ExerciseLogViewSet
)

router = DefaultRouter()
router.register('muscle-groups', MuscleGroupViewSet, basename='muscle-group')
router.register('exercises', ExerciseViewSet, basename='exercise')
router.register('routines', WorkoutRoutineViewSet, basename='routine')
router.register('routine-exercises', RoutineExerciseViewSet, basename='routine-exercise')
router.register('sessions', WorkoutSessionViewSet, basename='workout-session')
router.register('exercise-logs', ExerciseLogViewSet, basename='exercise-log')

urlpatterns = [
    path('', include(router.urls)),
]
