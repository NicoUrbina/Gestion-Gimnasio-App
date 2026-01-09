"""
Modelos de Planes y Membresías
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone
from datetime import timedelta


class MembershipPlan(models.Model):
    """Planes de membresía disponibles (Mensual, Trimestral, Anual, etc.)"""
    
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre del plan'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name='Precio'
    )
    duration_days = models.PositiveIntegerField(
        verbose_name='Duración (días)',
        help_text='30 = mensual, 90 = trimestral, 365 = anual'
    )
    max_classes_per_month = models.PositiveIntegerField(
        null=True, 
        blank=True,
        verbose_name='Clases máximas por mes',
        help_text='Dejar vacío para ilimitadas'
    )
    includes_trainer = models.BooleanField(
        default=False,
        verbose_name='Incluye entrenador personal'
    )
    can_freeze = models.BooleanField(
        default=True,
        verbose_name='Puede congelarse'
    )
    max_freeze_days = models.PositiveIntegerField(
        default=15,
        verbose_name='Días máximos de congelación'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Plan de Membresía'
        verbose_name_plural = 'Planes de Membresía'
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} - ${self.price} ({self.duration_days} días)"


class Membership(models.Model):
    """Membresía activa de un miembro"""
    
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('frozen', 'Congelada'),
        ('expired', 'Vencida'),
        ('cancelled', 'Cancelada'),
    ]
    
    member = models.ForeignKey(
        'members.Member', 
        on_delete=models.CASCADE, 
        related_name='memberships',
        verbose_name='Miembro'
    )
    plan = models.ForeignKey(
        MembershipPlan, 
        on_delete=models.PROTECT,
        related_name='memberships',
        verbose_name='Plan'
    )
    start_date = models.DateField(
        verbose_name='Fecha de inicio'
    )
    end_date = models.DateField(
        verbose_name='Fecha de vencimiento'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='active',
        verbose_name='Estado'
    )
    frozen_at = models.DateField(
        null=True, 
        blank=True,
        verbose_name='Congelada desde'
    )
    frozen_days_used = models.PositiveIntegerField(
        default=0,
        verbose_name='Días de congelación usados'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Membresía'
        verbose_name_plural = 'Membresías'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.member} - {self.plan.name} ({self.get_status_display()})"
    
    @property
    def days_remaining(self):
        """Días restantes de la membresía"""
        if self.status == 'active':
            delta = self.end_date - timezone.now().date()
            return max(0, delta.days)
        return 0
    
    @property
    def is_expiring_soon(self):
        """Verifica si vence en los próximos 7 días (para recordatorios)"""
        return 0 < self.days_remaining <= 7
    
    def freeze(self):
        """Congela la membresía"""
        if self.plan.can_freeze and self.frozen_days_used < self.plan.max_freeze_days:
            self.status = 'frozen'
            self.frozen_at = timezone.now().date()
            self.save()
            return True
        return False
    
    def unfreeze(self):
        """Descongela la membresía y extiende la fecha de vencimiento"""
        if self.status == 'frozen' and self.frozen_at:
            days_frozen = (timezone.now().date() - self.frozen_at).days
            self.frozen_days_used += days_frozen
            self.end_date += timedelta(days=days_frozen)
            self.status = 'active'
            self.frozen_at = None
            self.save()
            return True
        return False


class MembershipFreeze(models.Model):
    """Historial de congelaciones de membresía"""
    
    membership = models.ForeignKey(
        Membership, 
        on_delete=models.CASCADE, 
        related_name='freezes',
        verbose_name='Membresía'
    )
    start_date = models.DateField(
        verbose_name='Fecha de inicio'
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de fin'
    )
    reason = models.TextField(
        blank=True,
        verbose_name='Motivo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Congelación de Membresía'
        verbose_name_plural = 'Congelaciones de Membresía'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"Congelación: {self.membership} ({self.start_date})"
