"""
URLs para la aplicación Staff
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, ScheduleViewSet

router = DefaultRouter()
router.register(r'schedules', ScheduleViewSet, basename='schedule')
router.register(r'', StaffViewSet, basename='staff')

urlpatterns = [
    path('', include(router.urls)),
]
