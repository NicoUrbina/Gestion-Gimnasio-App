"""
URLs para la aplicación Classes
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClassTypeViewSet, GymClassViewSet, ReservationViewSet,
    RoutineViewSet, RoutineAssignmentViewSet
)

router = DefaultRouter()
router.register(r'types', ClassTypeViewSet, basename='class-type')
router.register(r'reservations', ReservationViewSet, basename='reservation')
router.register(r'routines', RoutineViewSet, basename='routine')
router.register(r'routine-assignments', RoutineAssignmentViewSet, basename='routine-assignment')
router.register(r'', GymClassViewSet, basename='gym-class')

urlpatterns = [
    path('', include(router.urls)),
]
