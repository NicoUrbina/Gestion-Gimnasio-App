"""
Modelos de Evaluaciones Físicas y Nutrición
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class FitnessAssessment(models.Model):
    """Evaluaciones físicas completas del atleta"""
    
    # Estados del proceso
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('scheduled', 'Agendada'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='fitness_assessments',
        verbose_name='Miembro'
    )
    assessed_by = models.ForeignKey(
        'staff.Staff',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assessments_performed',
        verbose_name='Evaluado por'
    )
    
    # Workflow fields
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    requested_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de solicitud'
    )
    scheduled_for = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Programada para'
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Completada el'
    )
    
    # Información del cliente
    personal_goals = models.TextField(
        blank=True,
        verbose_name='Objetivos personales',
        help_text='Lo que el cliente quiere lograr'
    )
    medical_notes = models.TextField(
        blank=True,
        verbose_name='Notas médicas',
        help_text='Condiciones médicas, lesiones, restricciones'
    )
    
    # Campo existente renombrado para consistencia
    assessment_date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha de evaluación'
    )
    
    # Medidas corporales
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Peso (kg)')
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Altura (cm)')
    body_fat_percentage = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name='% Grasa corporal')
    muscle_mass = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Masa muscular (kg)')
    
    # Medidas de circunferencia
    chest = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Pecho (cm)')
    waist = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Cintura (cm)')
    hips = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Cadera (cm)')
    biceps = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Bíceps (cm)')
    thigh = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Muslo (cm)')
    
    # Evaluaciones de rendimiento
    resting_heart_rate = models.PositiveIntegerField(null=True, blank=True, verbose_name='FC en reposo (bpm)')
    blood_pressure_systolic = models.PositiveIntegerField(null=True, blank=True, verbose_name='Presión sistólica')
    blood_pressure_diastolic = models.PositiveIntegerField(null=True, blank=True, verbose_name='Presión diastólica')
    
    # Tests de fuerza
    bench_press_max = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Press banca máx (kg)')
    squat_max = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Sentadilla máx (kg)')
    deadlift_max = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Peso muerto máx (kg)')
    
    # Tests de resistencia
    pushups_count = models.PositiveIntegerField(null=True, blank=True, verbose_name='Flexiones (cantidad)')
    situps_count = models.PositiveIntegerField(null=True, blank=True, verbose_name='Abdominales (cantidad)')
    plank_duration_seconds = models.PositiveIntegerField(null=True, blank=True, verbose_name='Plancha (segundos)')
    
    # Tests de cardio
    vo2_max = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='VO2 máx')
    run_time_1km = models.DurationField(null=True, blank=True, verbose_name='Tiempo 1km')
    
    # Flexibilidad
    sit_and_reach = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Sit and reach (cm)')
    
    # Nivel de fitness general
    fitness_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Principiante'),
            ('intermediate', 'Intermedio'),
            ('advanced', 'Avanzado'),
            ('athlete', 'Atleta'),
        ],
        null=True,
        blank=True,
        verbose_name='Nivel de fitness'
    )
    
    # Evaluaciones por capacidad (1-10)
    cardio_level = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        verbose_name='Nivel cardiovascular',
        help_text='Escala 1-10'
    )
    strength_level = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        verbose_name='Nivel de fuerza',
        help_text='Escala 1-10'
    )
    flexibility_level = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        verbose_name='Nivel de flexibilidad',
        help_text='Escala 1-10'
    )
    
    observations = models.TextField(blank=True, verbose_name='Observaciones')
    recommendations = models.TextField(blank=True, verbose_name='Recomendaciones')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Evaluación Física'
        verbose_name_plural = 'Evaluaciones Físicas'
        ordering = ['-assessment_date']
    
    def __str__(self):
        return f"Evaluación: {self.member} - {self.assessment_date}"
    
    @property
    def bmi(self):
        if self.weight and self.height:
            height_m = float(self.height) / 100
            return round(float(self.weight) / (height_m ** 2), 2)
        return None


class Goal(models.Model):
    """Metas del miembro"""
    
    GOAL_TYPES = [
        ('weight_loss', 'Pérdida de peso'),
        ('weight_gain', 'Aumento de peso'),
        ('muscle_gain', 'Ganancia muscular'),
        ('endurance', 'Resistencia'),
        ('strength', 'Fuerza'),
        ('flexibility', 'Flexibilidad'),
        ('health', 'Salud general'),
        ('custom', 'Personalizado'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('achieved', 'Lograda'),
        ('abandoned', 'Abandonada'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='goals',
        verbose_name='Miembro'
    )
    goal_type = models.CharField(
        max_length=20,
        choices=GOAL_TYPES,
        default='health',
        verbose_name='Tipo de meta'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    target_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Valor objetivo',
        help_text='Ej: peso objetivo, tiempo, repeticiones'
    )
    current_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Valor actual'
    )
    unit = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Unidad',
        help_text='Ej: kg, min, rep'
    )
    start_date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha de inicio'
    )
    target_date = models.DateField(
        null=True,
        blank=True,
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
        verbose_name='Fecha lograda'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Meta'
        verbose_name_plural = 'Metas'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.member} - {self.title}"
    
    @property
    def progress_percentage(self):
        """Calcula el porcentaje de progreso hacia la meta"""
        if self.target_value and self.current_value:
            if self.goal_type == 'weight_loss':
                # Para pérdida de peso, el progreso es inverso
                initial = self.current_value  # Asumiendo que se guarda el inicial
                return min(100, max(0, 100 - ((float(self.current_value) - float(self.target_value)) / float(self.target_value) * 100)))
            return min(100, (float(self.current_value) / float(self.target_value)) * 100)
        return 0


class NutritionPlan(models.Model):
    """Planes nutricionales"""
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='nutrition_plans',
        verbose_name='Miembro'
    )
    created_by = models.ForeignKey(
        'staff.Staff',
        on_delete=models.SET_NULL,
        null=True,
        related_name='nutrition_plans_created',
        verbose_name='Creado por'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre del plan'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    daily_calories = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Calorías diarias'
    )
    protein_grams = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Proteínas (g)'
    )
    carbs_grams = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Carbohidratos (g)'
    )
    fat_grams = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Grasas (g)'
    )
    meals_per_day = models.PositiveIntegerField(
        default=3,
        verbose_name='Comidas por día'
    )
    meal_details = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Detalle de comidas',
        help_text='JSON con el detalle de cada comida'
    )
    restrictions = models.TextField(
        blank=True,
        verbose_name='Restricciones alimentarias'
    )
    start_date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha de inicio'
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de fin'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Plan Nutricional'
        verbose_name_plural = 'Planes Nutricionales'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.member}"
