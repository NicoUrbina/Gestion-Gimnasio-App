"""
Modelos de Usuario y Roles
Sistema de Gestión de Gimnasio
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    """Roles del sistema con permisos"""
    
    # Constantes de roles
    ADMIN = 'admin'
    STAFF = 'staff'
    TRAINER = 'trainer'
    MEMBER = 'member'
    
    ROLE_CHOICES = [
        (ADMIN, 'Administrador'),
        (STAFF, 'Empleado'),
        (TRAINER, 'Entrenador'),
        (MEMBER, 'Miembro/Cliente'),
    ]
    
    name = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        unique=True,
        verbose_name='Nombre del rol'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    permissions = models.JSONField(
        default=dict,
        verbose_name='Permisos',
        help_text='Permisos adicionales en formato JSON'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
        ordering = ['name']
    
    def __str__(self):
        return self.get_name_display()


class User(AbstractUser):
    """Usuario personalizado del sistema"""
    
    email = models.EmailField(
        unique=True,
        verbose_name='Correo electrónico'
    )
    phone = models.CharField(
        max_length=20, 
        blank=True,
        verbose_name='Teléfono'
    )
    # Temporalmente usar CharField hasta instalar Pillow
    # photo = models.ImageField(upload_to='users/photos/', blank=True, null=True)
    photo = models.CharField(
        max_length=255, 
        blank=True,
        verbose_name='URL de foto de perfil',
        help_text='Temporalmente texto hasta instalar Pillow'
    )
    role = models.ForeignKey(
        Role, 
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='users',
        verbose_name='Rol'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    @property
    def is_admin(self):
        return self.role and self.role.name == Role.ADMIN
    
    @property
    def is_staff_member(self):
        return self.role and self.role.name == Role.STAFF
    
    @property
    def is_trainer(self):
        return self.role and self.role.name == Role.TRAINER
    
    @property
    def is_member(self):
        return self.role and self.role.name == Role.MEMBER
