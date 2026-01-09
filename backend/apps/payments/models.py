"""
Modelos de Pagos y Facturación
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone
import uuid


class Payment(models.Model):
    """Registro de pagos"""
    
    PAYMENT_METHODS = [
        ('cash', 'Efectivo'),
        ('card', 'Tarjeta'),
        ('transfer', 'Transferencia'),
        ('mobile', 'Pago Móvil'),
        ('other', 'Otro'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
    ]
    
    member = models.ForeignKey(
        'members.Member', 
        on_delete=models.CASCADE, 
        related_name='payments',
        verbose_name='Miembro'
    )
    membership = models.ForeignKey(
        'memberships.Membership', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='payments',
        verbose_name='Membresía'
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name='Monto'
    )
    payment_method = models.CharField(
        max_length=20, 
        choices=PAYMENT_METHODS,
        verbose_name='Método de pago'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name='Estado'
    )
    reference_number = models.CharField(
        max_length=100, 
        blank=True,
        verbose_name='Número de referencia'
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Descripción'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    payment_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='Fecha de pago'
    )
    created_by = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='payments_created',
        verbose_name='Registrado por'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'
        ordering = ['-payment_date']
    
    def __str__(self):
        return f"Pago #{self.id} - {self.member} - ${self.amount}"
    
    def complete(self):
        """Marca el pago como completado"""
        if self.status == 'pending':
            self.status = 'completed'
            self.save()
            return True
        return False


class Invoice(models.Model):
    """Factura/Comprobante"""
    
    payment = models.OneToOneField(
        Payment, 
        on_delete=models.CASCADE, 
        related_name='invoice',
        verbose_name='Pago'
    )
    invoice_number = models.CharField(
        max_length=50, 
        unique=True,
        verbose_name='Número de factura'
    )
    issued_date = models.DateField(
        auto_now_add=True,
        verbose_name='Fecha de emisión'
    )
    subtotal = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name='Subtotal'
    )
    tax = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        verbose_name='Impuesto'
    )
    total = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name='Total'
    )
    pdf_file = models.FileField(
        upload_to='invoices/', 
        blank=True,
        verbose_name='Archivo PDF'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'
        ordering = ['-issued_date']
    
    def __str__(self):
        return f"Factura {self.invoice_number}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generar número de factura único
            self.invoice_number = f"FAC-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)
