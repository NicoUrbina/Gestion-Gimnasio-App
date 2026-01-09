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
            height_m = self.height / 100
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
