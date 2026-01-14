"""
Modelos de Rutinas y Ejercicios
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class MuscleGroup(models.Model):
    """Grupos musculares para clasificar ejercicios"""
    
    name = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    class Meta:
        verbose_name = 'Grupo Muscular'
        verbose_name_plural = 'Grupos Musculares'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Exercise(models.Model):
    """Biblioteca de ejercicios"""
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Principiante'),
        ('intermediate', 'Intermedio'),
        ('advanced', 'Avanzado'),
    ]
    
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    description = models.TextField(
        verbose_name='Descripción'
    )
    muscle_group = models.ForeignKey(
        MuscleGroup,
        on_delete=models.CASCADE,
        related_name='exercises',
        verbose_name='Grupo muscular'
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='intermediate',
        verbose_name='Dificultad'
    )
    equipment_needed = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Equipo necesario',
        help_text='Ej: Mancuernas, barra, máquina'
    )
    video_url = models.URLField(
        blank=True,
        verbose_name='URL de video',
        help_text='YouTube, Vimeo, etc.'
    )
    image_url = models.URLField(
        blank=True,
        verbose_name='URL de imagen'
    )
    instructions = models.TextField(
        verbose_name='Instrucciones',
        help_text='Paso a paso de ejecución'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_by = models.ForeignKey(
        'staff.Staff',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='exercises_created',
        verbose_name='Creado por'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Ejercicio'
        verbose_name_plural = 'Ejercicios'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.get_difficulty_display()})"


class WorkoutRoutine(models.Model):
    """Rutina de entrenamiento personalizada"""
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='workout_routines',
        verbose_name='Miembro'
    )
    trainer = models.ForeignKey(
        'staff.Staff',
        on_delete=models.SET_NULL,
        null=True,
        related_name='routines_created',
        verbose_name='Entrenador'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre de la rutina'
    )
    description = models.TextField(
        verbose_name='Descripción'
    )
    goal = models.TextField(
        verbose_name='Objetivo',
        help_text='Lo que se busca lograr con esta rutina'
    )
    duration_weeks = models.PositiveIntegerField(
        verbose_name='Duración (semanas)',
        help_text='Por cuántas semanas es esta rutina'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa',
        help_text='Solo puede haber una rutina activa por miembro'
    )
    notified_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Notificado el',
        help_text='Fecha en que se notificó al cliente'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Rutina de Entrenamiento'
        verbose_name_plural = 'Rutinas de Entrenamiento'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.member}"
    
    def save(self, *args, **kwargs):
        # Si esta rutina se marca como activa, desactivar otras del mismo miembro
        if self.is_active:
            WorkoutRoutine.objects.filter(
                member=self.member,
                is_active=True
            ).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)


class RoutineExercise(models.Model):
    """Ejercicio dentro de una rutina (many-to-many con metadata)"""
    
    WEEKDAY_CHOICES = [
        (1, 'Lunes'),
        (2, 'Martes'),
        (3, 'Miércoles'),
        (4, 'Jueves'),
        (5, 'Viernes'),
        (6, 'Sábado'),
        (7, 'Domingo'),
    ]
    
    routine = models.ForeignKey(
        WorkoutRoutine,
        on_delete=models.CASCADE,
        related_name='exercises',
        verbose_name='Rutina'
    )
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        verbose_name='Ejercicio'
    )
    day_of_week = models.IntegerField(
        choices=WEEKDAY_CHOICES,
        verbose_name='Día de la semana'
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Orden',
        help_text='Orden de ejecución dentro del día'
    )
    sets = models.PositiveIntegerField(
        verbose_name='Series'
    )
    reps = models.PositiveIntegerField(
        verbose_name='Repeticiones',
        help_text='Repeticiones por serie'
    )
    rest_seconds = models.PositiveIntegerField(
        verbose_name='Descanso (seg)',
        help_text='Segundos de descanso entre series'
    )
    weight_kg = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Peso (kg)',
        help_text='Peso sugerido si aplica'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas',
        help_text='Instrucciones específicas para este ejercicio'
    )
    
    class Meta:
        verbose_name = 'Ejercicio en Rutina'
        verbose_name_plural = 'Ejercicios en Rutina'
        ordering = ['day_of_week', 'order']
        unique_together = [['routine', 'exercise', 'day_of_week', 'order']]
    
    def __str__(self):
        return f"{self.get_day_of_week_display()}: {self.exercise.name} ({self.sets}x{self.reps})"
