"""
Modelos de Personal (Entrenadores y Staff)
Sistema de Gestión de Gimnasio
"""

from django.db import models


class Staff(models.Model):
    """Perfil de personal: entrenadores, empleados, etc."""
    
    STAFF_TYPE_CHOICES = [
        ('trainer', 'Entrenador'),
        ('receptionist', 'Recepcionista'),
        ('admin', 'Administrativo'),
        ('maintenance', 'Mantenimiento'),
    ]
    
    user = models.OneToOneField(
        'users.User', 
        on_delete=models.CASCADE, 
        related_name='staff_profile',
        verbose_name='Usuario'
    )
    staff_type = models.CharField(
        max_length=20,
        choices=STAFF_TYPE_CHOICES,
        default='trainer',
        verbose_name='Tipo de personal'
    )
    specializations = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Especializaciones',
        help_text='Lista de especializaciones: ["Yoga", "CrossFit", "Pilates"]'
    )
    bio = models.TextField(
        blank=True,
        verbose_name='Biografía'
    )
    certifications = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Certificaciones'
    )
    hire_date = models.DateField(
        verbose_name='Fecha de contratación'
    )
    hourly_rate = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name='Tarifa por hora'
    )
    is_instructor = models.BooleanField(
        default=True,
        verbose_name='Es instructor de clases'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Personal'
        verbose_name_plural = 'Personal'
        ordering = ['user__first_name']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_staff_type_display()}"
    
    @property
    def is_trainer(self):
        return self.staff_type == 'trainer'


class Schedule(models.Model):
    """Horario de trabajo del personal"""
    
    DAYS_OF_WEEK = [
        (0, 'Lunes'),
        (1, 'Martes'),
        (2, 'Miércoles'),
        (3, 'Jueves'),
        (4, 'Viernes'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    ]
    
    staff = models.ForeignKey(
        Staff, 
        on_delete=models.CASCADE, 
        related_name='schedules',
        verbose_name='Personal'
    )
    day_of_week = models.IntegerField(
        choices=DAYS_OF_WEEK,
        verbose_name='Día de la semana'
    )
    start_time = models.TimeField(
        verbose_name='Hora de inicio'
    )
    end_time = models.TimeField(
        verbose_name='Hora de fin'
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name='Disponible'
    )
    
    class Meta:
        verbose_name = 'Horario'
        verbose_name_plural = 'Horarios'
        ordering = ['day_of_week', 'start_time']
        unique_together = ['staff', 'day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.staff} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
