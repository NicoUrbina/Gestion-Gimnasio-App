"""
Audit and Logging Models
Tracks all critical actions in the gym management system
"""
from django.db import models
from django.conf import settings
from django.utils import timezone


class AuditLog(models.Model):
    """
    Comprehensive audit log for tracking all system actions.
    Records who did what, when, where, and what changed.
    """
    
    ACTION_CHOICES = [
        ('CREATE', 'Crear'),
        ('UPDATE', 'Actualizar'),
        ('DELETE', 'Eliminar'),
        ('APPROVE', 'Aprobar'),
        ('REJECT', 'Rechazar'),
        ('LOGIN', 'Iniciar Sesión'),
        ('LOGOUT', 'Cerrar Sesión'),
        ('FAILED_LOGIN', 'Intento de Login Fallido'),
        ('ACCESS', 'Acceso al Gimnasio'),
        ('FREEZE', 'Congelar'),
        ('UNFREEZE', 'Descongelar'),
        ('CANCEL', 'Cancelar'),
        ('EXPORT', 'Exportar'),
        ('VIEW', 'Visualizar'),
    ]
    
    # Who performed the action
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='action_logs',  # Changed from audit_logs to avoid conflict
        verbose_name='Usuario'
    )
    
    # What action was performed
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name='Acción',
        db_index=True
    )
    
    # What was affected
    model_name = models.CharField(
        max_length=100,
        verbose_name='Modelo',
        db_index=True,
        help_text='Nombre del modelo afectado (ej: Payment, Membership)'
    )
    object_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='ID del Objeto',
        db_index=True
    )
    object_repr = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Representación del Objeto',
        help_text='Representación en texto del objeto'
    )
    
    # What changed (for UPDATE actions)
    changes = models.JSONField(
        null=True,
        blank=True,
        verbose_name='Cambios',
        help_text='Diccionario con valores antes/después'
    )
    
    # Where it came from
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='Dirección IP'
    )
    user_agent = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='User Agent',
        help_text='Navegador y sistema operativo'
    )
    
   # When it happened
    timestamp = models.DateTimeField(
        default=timezone.now,
        verbose_name='Fecha y Hora',
        db_index=True
    )
    
    # Additional context
    extra_data = models.JSONField(
        null=True,
        blank=True,
        verbose_name='Datos Adicionales',
        help_text='Información contextual adicional'
    )
    
    # Status/result
    success = models.BooleanField(
        default=True,
        verbose_name='Exitoso',
        help_text='Si la acción se completó exitosamente'
    )
    error_message = models.TextField(
        blank=True,
        verbose_name='Mensaje de Error'
    )
    
    class Meta:
        verbose_name = 'Log de Auditoría'
        verbose_name_plural = 'Logs de Auditoría'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['model_name', 'object_id']),
            models.Index(fields=['action', '-timestamp']),
        ]
    
    def __str__(self):
        user_str = self.user.get_full_name() if self.user else 'Sistema'
        return f"{user_str} - {self.get_action_display()} - {self.model_name} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    
    def get_changes_summary(self):
        """Returns a human-readable summary of changes."""
        if not self.changes:
            return "Sin cambios registrados"
        
        summary = []
        for field, values in self.changes.items():
            old_val = values.get('old', 'N/A')
            new_val = values.get('new', 'N/A')
            summary.append(f"{field}: '{old_val}' → '{new_val}'")
        
        return " | ".join(summary)


class UserSession(models.Model):
    """
    Tracks user login sessions for security and analytics.
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sessions',
        verbose_name='Usuario'
    )
    
    session_key = models.CharField(
        max_length=40,
        unique=True,
        verbose_name='Clave de Sesión'
    )
    
    ip_address = models.GenericIPAddressField(
        verbose_name='Dirección IP'
    )
    
    user_agent = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='User Agent'
    )
    
    login_time = models.DateTimeField(
        default=timezone.now,
        verbose_name='Hora de Login'
    )
    
    logout_time = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Hora de Logout'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    
    # Geographic info (optional, can be added later)
    location = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Ubicación',
        help_text='Ciudad/País si está disponible'
    )
    
    class Meta:
        verbose_name = 'Sesión de Usuario'
        verbose_name_plural = 'Sesiones de Usuario'
        ordering = ['-login_time']
        indexes = [
            models.Index(fields=['user', '-login_time']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.login_time.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def duration(self):
        """Calculate session duration."""
        if self.logout_time:
            return self.logout_time - self.login_time
        elif self.is_active:
            return timezone.now() - self.login_time
        return None
    
    @property
    def duration_str(self):
        """Human-readable session duration."""
        duration = self.duration
        if not duration:
            return "N/A"
        
        total_seconds = int(duration.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"
