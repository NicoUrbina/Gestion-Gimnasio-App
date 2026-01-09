"""
Modelos de Clases y Reservas
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class ClassType(models.Model):
    """Tipos de clases disponibles (Yoga, Spinning, CrossFit, etc.)"""
    
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    default_duration_minutes = models.PositiveIntegerField(
        default=60,
        verbose_name='Duración por defecto (minutos)'
    )
    default_capacity = models.PositiveIntegerField(
        default=20,
        verbose_name='Capacidad por defecto'
    )
    color = models.CharField(
        max_length=7, 
        default='#3B82F6',
        verbose_name='Color',
        help_text='Color hexadecimal para el calendario'
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
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Tipo de Clase'
        verbose_name_plural = 'Tipos de Clase'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class GymClass(models.Model):
    """Clase programada en el gimnasio"""
    
    class_type = models.ForeignKey(
        ClassType, 
        on_delete=models.PROTECT,
        related_name='classes',
        verbose_name='Tipo de clase'
    )
    instructor = models.ForeignKey(
        'staff.Staff', 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='classes',
        verbose_name='Instructor'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    start_datetime = models.DateTimeField(
        verbose_name='Fecha y hora de inicio'
    )
    end_datetime = models.DateTimeField(
        verbose_name='Fecha y hora de fin'
    )
    capacity = models.PositiveIntegerField(
        verbose_name='Capacidad máxima'
    )
    location = models.CharField(
        max_length=100, 
        blank=True,
        verbose_name='Ubicación',
        help_text='Ej: Sala 1, Área de pesas, Piscina'
    )
    is_recurring = models.BooleanField(
        default=False,
        verbose_name='Es recurrente'
    )
    is_cancelled = models.BooleanField(
        default=False,
        verbose_name='Cancelada'
    )
    cancellation_reason = models.TextField(
        blank=True,
        verbose_name='Motivo de cancelación'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Clase'
        verbose_name_plural = 'Clases'
        ordering = ['start_datetime']
    
    def __str__(self):
        return f"{self.title} - {self.start_datetime.strftime('%d/%m/%Y %H:%M')}"
    
    @property
    def confirmed_reservations_count(self):
        return self.reservations.filter(status='confirmed').count()
    
    @property
    def available_spots(self):
        return self.capacity - self.confirmed_reservations_count
    
    @property
    def is_full(self):
        return self.available_spots <= 0
    
    @property
    def waitlist_count(self):
        return self.reservations.filter(status='waitlist').count()


class Reservation(models.Model):
    """Reserva/Inscripción de un miembro a una clase"""
    
    STATUS_CHOICES = [
        ('confirmed', 'Confirmada'),
        ('waitlist', 'Lista de espera'),
        ('cancelled', 'Cancelada'),
        ('attended', 'Asistió'),
        ('no_show', 'No asistió'),
    ]
    
    gym_class = models.ForeignKey(
        GymClass, 
        on_delete=models.CASCADE, 
        related_name='reservations',
        verbose_name='Clase'
    )
    member = models.ForeignKey(
        'members.Member', 
        on_delete=models.CASCADE, 
        related_name='reservations',
        verbose_name='Miembro'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='confirmed',
        verbose_name='Estado'
    )
    waitlist_position = models.PositiveIntegerField(
        null=True, 
        blank=True,
        verbose_name='Posición en lista de espera'
    )
    reserved_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de reserva'
    )
    cancelled_at = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name='Fecha de cancelación'
    )
    attended_at = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name='Fecha de asistencia'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        unique_together = ['gym_class', 'member']
        ordering = ['-reserved_at']
    
    def __str__(self):
        return f"{self.member} - {self.gym_class.title} ({self.get_status_display()})"
    
    def cancel(self):
        """Cancela la reserva y promueve al siguiente en lista de espera"""
        if self.status == 'confirmed':
            self.status = 'cancelled'
            self.cancelled_at = timezone.now()
            self.save()
            
            # Promover al siguiente en lista de espera
            next_in_line = Reservation.objects.filter(
                gym_class=self.gym_class,
                status='waitlist'
            ).order_by('waitlist_position').first()
            
            if next_in_line:
                next_in_line.status = 'confirmed'
                next_in_line.waitlist_position = None
                next_in_line.save()
            
            return True
        return False
    
    def mark_attended(self):
        """Marca la reserva como asistida"""
        if self.status == 'confirmed':
            self.status = 'attended'
            self.attended_at = timezone.now()
            self.save()
            return True
        return False


class Routine(models.Model):
    """Rutinas creadas por entrenadores"""
    
    trainer = models.ForeignKey(
        'staff.Staff',
        on_delete=models.CASCADE,
        related_name='routines',
        verbose_name='Entrenador'
    )
    name = models.CharField(
        max_length=150,
        verbose_name='Nombre de la rutina'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción de ejercicios'
    )
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Principiante'),
            ('intermediate', 'Intermedio'),
            ('advanced', 'Avanzado'),
        ],
        default='intermediate',
        verbose_name='Nivel de dificultad'
    )
    duration_minutes = models.PositiveIntegerField(
        default=60,
        verbose_name='Duración (minutos)'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Rutina'
        verbose_name_plural = 'Rutinas'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.trainer}"


class RoutineAssignment(models.Model):
    """Asignación de rutinas a miembros"""
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='routine_assignments',
        verbose_name='Miembro'
    )
    routine = models.ForeignKey(
        Routine,
        on_delete=models.CASCADE,
        related_name='assignments',
        verbose_name='Rutina'
    )
    assigned_by = models.ForeignKey(
        'staff.Staff',
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Asignada por'
    )
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de asignación'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    
    class Meta:
        verbose_name = 'Asignación de Rutina'
        verbose_name_plural = 'Asignaciones de Rutinas'
        ordering = ['-assigned_at']
    
    def __str__(self):
        return f"{self.member} - {self.routine}"
