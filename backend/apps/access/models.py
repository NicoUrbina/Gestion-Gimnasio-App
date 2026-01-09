"""
Modelos de Control de Acceso (Asistencia)
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class AccessLog(models.Model):
    """Registro de accesos/asistencias al gimnasio"""
    
    ACCESS_TYPES = [
        ('entry', 'Entrada'),
        ('exit', 'Salida'),
    ]
    
    member = models.ForeignKey(
        'members.Member', 
        on_delete=models.CASCADE, 
        related_name='access_logs',
        verbose_name='Miembro'
    )
    access_type = models.CharField(
        max_length=10, 
        choices=ACCESS_TYPES,
        default='entry',
        verbose_name='Tipo de acceso'
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha y hora'
    )
    registered_by = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        verbose_name='Registrado por'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    
    class Meta:
        verbose_name = 'Registro de Acceso'
        verbose_name_plural = 'Registros de Acceso'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.member} - {self.get_access_type_display()} - {self.timestamp}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Actualizar último acceso del miembro
        if self.access_type == 'entry':
            self.member.last_access = self.timestamp
            self.member.save(update_fields=['last_access'])


class AbandonmentAlert(models.Model):
    """Alertas de abandono (miembros inactivos)"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('contacted', 'Contactado'),
        ('resolved', 'Resuelto'),
        ('dismissed', 'Descartado'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='abandonment_alerts',
        verbose_name='Miembro'
    )
    days_inactive = models.PositiveIntegerField(
        verbose_name='Días inactivo'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creación'
    )
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Fecha de resolución'
    )
    resolved_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_alerts',
        verbose_name='Resuelto por'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    
    class Meta:
        verbose_name = 'Alerta de Abandono'
        verbose_name_plural = 'Alertas de Abandono'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Alerta: {self.member} - {self.days_inactive} días inactivo"
    
    def resolve(self, user, notes=''):
        """Marca la alerta como resuelta"""
        self.status = 'resolved'
        self.resolved_at = timezone.now()
        self.resolved_by = user
        self.notes = notes
        self.save()
