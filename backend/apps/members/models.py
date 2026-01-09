"""
Modelos de Miembros
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class Member(models.Model):
    """Perfil extendido para miembros/clientes del gimnasio"""
    
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    SUBSCRIPTION_STATUS = [
        ('active', 'Activo'),
        ('inactive', 'Inactivo'),
        ('expired', 'Vencido'),
        ('frozen', 'Congelado'),
    ]
    
    user = models.OneToOneField(
        'users.User', 
        on_delete=models.CASCADE, 
        related_name='member_profile',
        verbose_name='Usuario'
    )
    date_of_birth = models.DateField(
        null=True, 
        blank=True,
        verbose_name='Fecha de nacimiento'
    )
    gender = models.CharField(
        max_length=1, 
        choices=GENDER_CHOICES,
        blank=True,
        verbose_name='Género'
    )
    phone = models.CharField(
        max_length=20, 
        blank=True,
        verbose_name='Teléfono'
    )
    address = models.TextField(
        blank=True,
        verbose_name='Dirección'
    )
    emergency_contact_name = models.CharField(
        max_length=100, 
        blank=True,
        verbose_name='Contacto de emergencia'
    )
    emergency_contact_phone = models.CharField(
        max_length=20, 
        blank=True,
        verbose_name='Teléfono de emergencia'
    )
    medical_notes = models.TextField(
        blank=True,
        verbose_name='Notas médicas',
        help_text='Alergias, condiciones, etc.'
    )
    subscription_status = models.CharField(
        max_length=20, 
        choices=SUBSCRIPTION_STATUS,
        default='inactive',
        verbose_name='Estado de suscripción'
    )
    joined_date = models.DateField(
        auto_now_add=True,
        verbose_name='Fecha de registro'
    )
    last_access = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name='Último acceso'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Miembro'
        verbose_name_plural = 'Miembros'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_subscription_status_display()}"
    
    @property
    def active_membership(self):
        """Retorna la membresía activa actual"""
        from apps.memberships.models import Membership
        return self.memberships.filter(
            status='active', 
            end_date__gte=timezone.now().date()
        ).first()
    
    @property
    def is_active(self):
        """Verifica si el miembro tiene membresía activa"""
        return self.active_membership is not None
    
    @property
    def days_inactive(self):
        """Días desde el último acceso (para alertas de abandono)"""
        if self.last_access:
            delta = timezone.now() - self.last_access
            return delta.days
        return None
