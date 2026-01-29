"""
URLs for Audit API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, UserSessionViewSet

router = DefaultRouter()
router.register(r'logs', AuditLogViewSet, basename='auditlog')
router.register(r'sessions', UserSessionViewSet, basename='usersession')

urlpatterns = [
    path('', include(router.urls)),
]
