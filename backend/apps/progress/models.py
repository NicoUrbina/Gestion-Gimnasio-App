"""
Modelos de Progreso Físico
Sistema de Gestión de Gimnasio
"""

from django.db import models


class ProgressLog(models.Model):
    """Tracking de evolución física del miembro"""
    
    member = models.ForeignKey(
        'members.Member', 
        on_delete=models.CASCADE, 
        related_name='progress_logs',
        verbose_name='Miembro'
    )
    date = models.DateField(
        verbose_name='Fecha'
    )
    weight = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Peso (kg)'
    )
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Altura (cm)'
    )
    body_fat_percentage = models.DecimalField(
        max_digits=4, 
        decimal_places=1, 
        null=True,
        blank=True,
        verbose_name='Porcentaje de grasa corporal'
    )
    muscle_mass = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True,
        blank=True,
        verbose_name='Masa muscular (kg)'
    )
    chest = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Pecho (cm)'
    )
    waist = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Cintura (cm)'
    )
    hips = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Cadera (cm)'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    registered_by = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name='Registrado por'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Registro de Progreso'
        verbose_name_plural = 'Registros de Progreso'
        ordering = ['-date']
        unique_together = ['member', 'date']
    
    def __str__(self):
        return f"{self.member} - {self.date}"
    
    @property
    def bmi(self):
        """Calcula el Índice de Masa Corporal"""
        if self.weight and self.height:
            height_m = float(self.height) / 100
            return round(float(self.weight) / (height_m ** 2), 2)
        return None


class Achievement(models.Model):
    """Logros del miembro"""
    
    ACHIEVEMENT_TYPES = [
        ('weight_loss', 'Pérdida de peso'),
        ('weight_gain', 'Aumento de peso'),
        ('attendance', 'Asistencia'),
        ('class_completed', 'Clase completada'),
        ('milestone', 'Hito'),
        ('challenge', 'Reto'),
        ('custom', 'Personalizado'),
    ]
    
    member = models.ForeignKey(
        'members.Member', 
        on_delete=models.CASCADE, 
        related_name='achievements',
        verbose_name='Miembro'
    )
    achievement_type = models.CharField(
        max_length=20,
        choices=ACHIEVEMENT_TYPES,
        default='custom',
        verbose_name='Tipo de logro'
    )
    title = models.CharField(
        max_length=100,
        verbose_name='Título'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    achieved_date = models.DateField(
        verbose_name='Fecha del logro'
    )
    icon = models.CharField(
        max_length=50, 
        default='trophy',
        verbose_name='Ícono'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Logro'
        verbose_name_plural = 'Logros'
        ordering = ['-achieved_date']
    
    def __str__(self):
        return f"{self.member} - {self.title}"


class WorkoutSession(models.Model):
    """Sesión de entrenamiento registrada por el atleta"""
    
    WEEKDAY_CHOICES = [
        (1, 'Lunes'),
        (2, 'Martes'),
        (3, 'Miércoles'),
        (4, 'Jueves'),
        (5, 'Viernes'),
        (6, 'Sábado'),
        (7, 'Domingo'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='workout_sessions',
        verbose_name='Miembro'
    )
    routine = models.ForeignKey(
        'workouts.WorkoutRoutine',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sessions',
        verbose_name='Rutina'
    )
    date = models.DateTimeField(
        verbose_name='Fecha'
    )
    day_of_week = models.IntegerField(
        choices=WEEKDAY_CHOICES,
        null=True,
        blank=True,
        verbose_name='Día de la semana',
        help_text='Día que corresponde al plan de la rutina'
    )
    completed = models.BooleanField(
        default=False,
        verbose_name='Completada'
    )
    duration_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Duración (minutos)'
    )
    
    # Notas y feedback
    notes = models.TextField(
        blank=True,
        verbose_name='Notas del atleta',
        help_text='Cómo se sintió, dificultades, etc.'
    )
    trainer_feedback = models.TextField(
        blank=True,
        verbose_name='Feedback del entrenador'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Sesión de Entrenamiento'
        verbose_name_plural = 'Sesiones de Entrenamiento'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.member} - {self.date.strftime('%Y-%m-%d')}"


class ExerciseLog(models.Model):
    """Log detallado de ejercicio dentro de una sesión"""
    
    session = models.ForeignKey(
        WorkoutSession,
        on_delete=models.CASCADE,
        related_name='exercise_logs',
        verbose_name='Sesión'
    )
    exercise = models.ForeignKey(
        'workouts.Exercise',
        on_delete=models.CASCADE,
        verbose_name='Ejercicio'
    )
    routine_exercise = models.ForeignKey(
        'workouts.RoutineExercise',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Ejercicio de rutina'
    )
    
    # Plan vs Realidad
    planned_sets = models.PositiveIntegerField(
        verbose_name='Series planeadas'
    )
    planned_reps = models.PositiveIntegerField(
        verbose_name='Repeticiones planeadas'
    )
    
    actual_sets = models.PositiveIntegerField(
        verbose_name='Series realizadas'
    )
    actual_reps = models.PositiveIntegerField(
        verbose_name='Repeticiones realizadas'
    )
    weight_used = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name='Peso usado (kg)'
    )
    
    # Evaluación del atleta
    difficulty_rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        verbose_name='Dificultad (1-10)',
        help_text='Qué tan difícil fue el ejercicio'
    )
    completed = models.BooleanField(
        default=True,
        verbose_name='Completado'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    completed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Completado el',
        help_text='Fecha y hora de registro'
    )
    
    class Meta:
        verbose_name = 'Log de Ejercicio'
        verbose_name_plural = 'Logs de Ejercicios'
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.exercise.name} - {self.actual_sets}x{self.actual_reps} @ {self.weight_used}kg"

