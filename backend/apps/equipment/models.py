"""
Modelos de Equipamiento y Mantenimiento
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class EquipmentCategory(models.Model):
    """Categorías de equipos"""
    
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    class Meta:
        verbose_name = 'Categoría de Equipo'
        verbose_name_plural = 'Categorías de Equipos'
    
    def __str__(self):
        return self.name


class Equipment(models.Model):
    """Equipos del gimnasio (máquinas, pesas, etc.)"""
    
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('in_use', 'En uso'),
        ('maintenance', 'En mantenimiento'),
        ('out_of_order', 'Fuera de servicio'),
    ]
    
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    category = models.ForeignKey(
        EquipmentCategory,
        on_delete=models.PROTECT,
        related_name='equipment',
        verbose_name='Categoría'
    )
    brand = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Marca'
    )
    model = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Modelo'
    )
    serial_number = models.CharField(
        max_length=100,
        blank=True,
        unique=True,
        verbose_name='Número de serie'
    )
    location = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Ubicación',
        help_text='Ej: Sala de cardio, Área de pesas'
    )
    purchase_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de compra'
    )
    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Precio de compra'
    )
    warranty_expiry = models.DateField(
        null=True,
        blank=True,
        verbose_name='Vencimiento de garantía'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        verbose_name='Estado'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    image = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='URL de imagen'
    )
    is_reservable = models.BooleanField(
        default=False,
        verbose_name='Puede reservarse'
    )
    last_maintenance = models.DateField(
        null=True,
        blank=True,
        verbose_name='Último mantenimiento'
    )
    next_maintenance = models.DateField(
        null=True,
        blank=True,
        verbose_name='Próximo mantenimiento'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
    
    @property
    def is_warranty_valid(self):
        if self.warranty_expiry:
            return self.warranty_expiry >= timezone.now().date()
        return False


class MaintenanceRecord(models.Model):
    """Registro de mantenimiento de equipos"""
    
    MAINTENANCE_TYPES = [
        ('preventive', 'Preventivo'),
        ('corrective', 'Correctivo'),
        ('emergency', 'Emergencia'),
        ('inspection', 'Inspección'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Programado'),
        ('in_progress', 'En progreso'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
    ]
    
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='maintenance_records',
        verbose_name='Equipo'
    )
    maintenance_type = models.CharField(
        max_length=20,
        choices=MAINTENANCE_TYPES,
        default='preventive',
        verbose_name='Tipo de mantenimiento'
    )
    description = models.TextField(
        verbose_name='Descripción del trabajo'
    )
    scheduled_date = models.DateField(
        verbose_name='Fecha programada'
    )
    completed_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha completada'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        verbose_name='Estado'
    )
    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Costo'
    )
    performed_by = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Realizado por'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas adicionales'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Registro de Mantenimiento'
        verbose_name_plural = 'Registros de Mantenimiento'
        ordering = ['-scheduled_date']
    
    def __str__(self):
        return f"{self.equipment} - {self.get_maintenance_type_display()} ({self.scheduled_date})"


class EquipmentReservation(models.Model):
    """Reserva de equipos específicos"""
    
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
    ]
    
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='reservations',
        verbose_name='Equipo'
    )
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='equipment_reservations',
        verbose_name='Miembro'
    )
    start_time = models.DateTimeField(
        verbose_name='Hora de inicio'
    )
    end_time = models.DateTimeField(
        verbose_name='Hora de fin'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Estado'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Reserva de Equipo'
        verbose_name_plural = 'Reservas de Equipos'
        ordering = ['-start_time']
    
    def __str__(self):
        return f"{self.equipment} - {self.member} ({self.start_time})"
