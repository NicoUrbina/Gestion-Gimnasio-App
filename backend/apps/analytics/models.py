"""
Modelos de Analytics del Atleta
Sistema de Gestión de Gimnasio

Estos modelos permiten rastrear métricas del desarrollo del atleta
a lo largo del tiempo para generar gráficas y análisis.
"""

from django.db import models
from django.utils import timezone
from datetime import timedelta


class MetricType(models.Model):
    """Tipos de métricas que se pueden rastrear"""
    
    UNIT_TYPES = [
        ('kg', 'Kilogramos'),
        ('lb', 'Libras'),
        ('cm', 'Centímetros'),
        ('in', 'Pulgadas'),
        ('min', 'Minutos'),
        ('sec', 'Segundos'),
        ('rep', 'Repeticiones'),
        ('percent', 'Porcentaje'),
        ('bpm', 'Latidos por minuto'),
        ('cal', 'Calorías'),
        ('km', 'Kilómetros'),
        ('count', 'Cantidad'),
        ('custom', 'Personalizado'),
    ]
    
    CATEGORY_CHOICES = [
        ('body_composition', 'Composición corporal'),
        ('strength', 'Fuerza'),
        ('endurance', 'Resistencia'),
        ('flexibility', 'Flexibilidad'),
        ('cardio', 'Cardiovascular'),
        ('nutrition', 'Nutrición'),
        ('wellness', 'Bienestar'),
        ('custom', 'Personalizado'),
    ]
    
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nombre de métrica'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default='custom',
        verbose_name='Categoría'
    )
    unit = models.CharField(
        max_length=20,
        choices=UNIT_TYPES,
        default='custom',
        verbose_name='Unidad de medida'
    )
    custom_unit = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Unidad personalizada'
    )
    is_higher_better = models.BooleanField(
        default=True,
        verbose_name='Mayor es mejor',
        help_text='Si es True, valores más altos indican mejora. Si es False, valores más bajos son mejores (ej: % grasa)'
    )
    min_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Valor mínimo'
    )
    max_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Valor máximo'
    )
    color = models.CharField(
        max_length=7,
        default='#3B82F6',
        verbose_name='Color para gráficas'
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Ícono'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Tipo de Métrica'
        verbose_name_plural = 'Tipos de Métricas'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_unit_display() if self.unit != 'custom' else self.custom_unit})"


class AthleteMetric(models.Model):
    """Registro individual de una métrica del atleta"""
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='athlete_metrics',
        verbose_name='Miembro'
    )
    metric_type = models.ForeignKey(
        MetricType,
        on_delete=models.PROTECT,
        related_name='measurements',
        verbose_name='Tipo de métrica'
    )
    value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor'
    )
    recorded_date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha de registro'
    )
    recorded_time = models.TimeField(
        null=True,
        blank=True,
        verbose_name='Hora de registro'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    recorded_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='metrics_recorded',
        verbose_name='Registrado por'
    )
    source = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Fuente',
        help_text='Ej: manual, app, báscula inteligente'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Métrica del Atleta'
        verbose_name_plural = 'Métricas del Atleta'
        ordering = ['-recorded_date', '-created_at']
        # Un miembro puede tener múltiples registros del mismo tipo en el mismo día
    
    def __str__(self):
        return f"{self.member} - {self.metric_type.name}: {self.value}"


class MetricSnapshot(models.Model):
    """
    Snapshots periódicos del estado del atleta.
    Útil para comparaciones de período a período (semanal, mensual).
    """
    
    PERIOD_TYPES = [
        ('weekly', 'Semanal'),
        ('monthly', 'Mensual'),
        ('quarterly', 'Trimestral'),
        ('yearly', 'Anual'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='metric_snapshots',
        verbose_name='Miembro'
    )
    period_type = models.CharField(
        max_length=20,
        choices=PERIOD_TYPES,
        default='monthly',
        verbose_name='Tipo de período'
    )
    period_start = models.DateField(
        verbose_name='Inicio del período'
    )
    period_end = models.DateField(
        verbose_name='Fin del período'
    )
    metrics_data = models.JSONField(
        default=dict,
        verbose_name='Datos de métricas',
        help_text='JSON con promedios, máximos, mínimos de cada métrica'
    )
    summary = models.TextField(
        blank=True,
        verbose_name='Resumen del período'
    )
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Snapshot de Métricas'
        verbose_name_plural = 'Snapshots de Métricas'
        ordering = ['-period_end']
        unique_together = ['member', 'period_type', 'period_start']
    
    def __str__(self):
        return f"{self.member} - {self.get_period_type_display()} ({self.period_start} a {self.period_end})"


class PerformanceGoal(models.Model):
    """Metas de rendimiento específicas para métricas"""
    
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('achieved', 'Lograda'),
        ('failed', 'No lograda'),
        ('abandoned', 'Abandonada'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='performance_goals',
        verbose_name='Miembro'
    )
    metric_type = models.ForeignKey(
        MetricType,
        on_delete=models.PROTECT,
        related_name='goals',
        verbose_name='Tipo de métrica'
    )
    initial_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor inicial'
    )
    target_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor objetivo'
    )
    current_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Valor actual'
    )
    start_date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha de inicio'
    )
    target_date = models.DateField(
        verbose_name='Fecha objetivo'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Estado'
    )
    achieved_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de logro'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Meta de Rendimiento'
        verbose_name_plural = 'Metas de Rendimiento'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.member} - {self.metric_type.name}: {self.initial_value} → {self.target_value}"
    
    @property
    def progress_percentage(self):
        """Calcula el porcentaje de progreso"""
        if self.current_value is None:
            self.current_value = self.initial_value
        
        total_change_needed = float(self.target_value) - float(self.initial_value)
        if total_change_needed == 0:
            return 100 if self.current_value == self.target_value else 0
        
        current_change = float(self.current_value) - float(self.initial_value)
        percentage = (current_change / total_change_needed) * 100
        return min(100, max(0, percentage))
    
    @property
    def days_remaining(self):
        """Días restantes para alcanzar la meta"""
        if self.status != 'active':
            return 0
        delta = self.target_date - timezone.now().date()
        return max(0, delta.days)
    
    @property
    def is_on_track(self):
        """Verifica si va en camino de cumplir la meta a tiempo"""
        if self.status != 'active':
            return False
        
        total_days = (self.target_date - self.start_date).days
        days_elapsed = (timezone.now().date() - self.start_date).days
        
        if total_days == 0:
            return self.progress_percentage >= 100
        
        expected_progress = (days_elapsed / total_days) * 100
        return self.progress_percentage >= expected_progress


class TrainingLog(models.Model):
    """Log de entrenamientos del atleta"""
    
    INTENSITY_CHOICES = [
        ('low', 'Baja'),
        ('moderate', 'Moderada'),
        ('high', 'Alta'),
        ('max', 'Máxima'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='training_logs',
        verbose_name='Miembro'
    )
    date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha'
    )
    duration_minutes = models.PositiveIntegerField(
        verbose_name='Duración (minutos)'
    )
    training_type = models.CharField(
        max_length=100,
        verbose_name='Tipo de entrenamiento',
        help_text='Ej: Cardio, Fuerza, HIIT, Yoga'
    )
    intensity = models.CharField(
        max_length=20,
        choices=INTENSITY_CHOICES,
        default='moderate',
        verbose_name='Intensidad'
    )
    calories_burned = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Calorías quemadas'
    )
    gym_class = models.ForeignKey(
        'classes.GymClass',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='training_logs',
        verbose_name='Clase'
    )
    routine = models.ForeignKey(
        'classes.Routine',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='training_logs',
        verbose_name='Rutina'
    )
    exercises_data = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Datos de ejercicios',
        help_text='JSON con ejercicios realizados, series, repeticiones, peso'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    mood_before = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Estado de ánimo antes (1-5)'
    )
    mood_after = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Estado de ánimo después (1-5)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Log de Entrenamiento'
        verbose_name_plural = 'Logs de Entrenamiento'
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.member} - {self.training_type} ({self.date})"


class GymSettings(models.Model):
    """Configuraciones del gimnasio (singleton)"""
    
    gym_name = models.CharField(
        max_length=200,
        default='Mi Gimnasio',
        verbose_name='Nombre del gimnasio'
    )
    address = models.TextField(
        blank=True,
        verbose_name='Dirección'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Teléfono'
    )
    email = models.EmailField(
        blank=True,
        verbose_name='Email'
    )
    opening_time = models.TimeField(
        null=True,
        blank=True,
        verbose_name='Hora de apertura'
    )
    closing_time = models.TimeField(
        null=True,
        blank=True,
        verbose_name='Hora de cierre'
    )
    days_for_abandonment_alert = models.PositiveIntegerField(
        default=15,
        verbose_name='Días para alerta de abandono'
    )
    days_for_renewal_reminder = models.PositiveIntegerField(
        default=7,
        verbose_name='Días antes para recordatorio de renovación'
    )
    logo_url = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='URL del logo'
    )
    primary_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        verbose_name='Color primario'
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Configuración del Gimnasio'
        verbose_name_plural = 'Configuraciones del Gimnasio'
    
    def __str__(self):
        return self.gym_name
    
    def save(self, *args, **kwargs):
        # Asegurar que solo exista una configuración
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class AuditLog(models.Model):
    """Log de auditoría para cambios importantes"""
    
    ACTION_TYPES = [
        ('create', 'Crear'),
        ('update', 'Actualizar'),
        ('delete', 'Eliminar'),
        ('login', 'Inicio de sesión'),
        ('logout', 'Cierre de sesión'),
        ('payment', 'Pago'),
        ('membership', 'Membresía'),
        ('other', 'Otro'),
    ]
    
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs',
        verbose_name='Usuario'
    )
    action = models.CharField(
        max_length=20,
        choices=ACTION_TYPES,
        verbose_name='Acción'
    )
    model_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Modelo afectado'
    )
    object_id = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='ID del objeto'
    )
    description = models.TextField(
        verbose_name='Descripción'
    )
    old_values = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Valores anteriores'
    )
    new_values = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Valores nuevos'
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='Dirección IP'
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name='User Agent'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Log de Auditoría'
        verbose_name_plural = 'Logs de Auditoría'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.get_action_display()} - {self.model_name}"
