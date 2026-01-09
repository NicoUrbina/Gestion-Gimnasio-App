"""
URLs para la aplicación Access
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccessLogViewSet, AbandonmentAlertViewSet

router = DefaultRouter()
router.register(r'alerts', AbandonmentAlertViewSet, basename='abandonment-alert')
router.register(r'', AccessLogViewSet, basename='access-log')

urlpatterns = [
    path('', include(router.urls)),
]
