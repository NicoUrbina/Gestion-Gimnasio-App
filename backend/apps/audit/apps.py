"""
Audit App Configuration
"""
from django.apps import AppConfig


class AuditConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.audit'
    verbose_name = 'Auditoría y Logs'
    
    def ready(self):
        """Import signal handlers when app is ready."""
        import apps.audit.signals  # noqa
