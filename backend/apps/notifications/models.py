"""
Modelos de Notificaciones y Comunicación
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class NotificationTemplate(models.Model):
    """Plantillas de mensajes para notificaciones"""
    
    TEMPLATE_TYPES = [
        ('welcome', 'Bienvenida'),
        ('renewal_reminder', 'Recordatorio de renovación'),
        ('class_reminder', 'Recordatorio de clase'),
        ('payment_confirmation', 'Confirmación de pago'),
        ('abandonment', 'Alerta de abandono'),
        ('birthday', 'Cumpleaños'),
        ('promotion', 'Promoción'),
        ('custom', 'Personalizado'),
    ]
    
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    template_type = models.CharField(
        max_length=30,
        choices=TEMPLATE_TYPES,
        default='custom',
        verbose_name='Tipo de plantilla'
    )
    subject = models.CharField(
        max_length=200,
        verbose_name='Asunto'
    )
    body = models.TextField(
        verbose_name='Cuerpo del mensaje',
        help_text='Usa {{variable}} para variables dinámicas: {{nombre}}, {{fecha}}, etc.'
    )
    is_email = models.BooleanField(
        default=True,
        verbose_name='Enviar por email'
    )
    is_whatsapp = models.BooleanField(
        default=False,
        verbose_name='Enviar por WhatsApp'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Plantilla de Notificación'
        verbose_name_plural = 'Plantillas de Notificación'
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"


class Notification(models.Model):
    """Notificaciones in-app para usuarios"""
    
    NOTIFICATION_TYPES = [
        ('info', 'Información'),
        ('success', 'Éxito'),
        ('warning', 'Advertencia'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Usuario'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    message = models.TextField(
        verbose_name='Mensaje'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default='info',
        verbose_name='Tipo'
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name='Leída'
    )
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Leída en'
    )
    link = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Enlace',
        help_text='URL para redirigir al hacer clic'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class EmailLog(models.Model):
    """Historial de emails enviados"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('sent', 'Enviado'),
        ('failed', 'Fallido'),
        ('bounced', 'Rebotado'),
    ]
    
    recipient = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='email_logs',
        verbose_name='Destinatario'
    )
    recipient_email = models.EmailField(
        verbose_name='Email destinatario'
    )
    subject = models.CharField(
        max_length=200,
        verbose_name='Asunto'
    )
    body = models.TextField(
        verbose_name='Cuerpo'
    )
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Plantilla'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Enviado en'
    )
    error_message = models.TextField(
        blank=True,
        verbose_name='Mensaje de error'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Log de Email'
        verbose_name_plural = 'Logs de Email'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Email a {self.recipient_email} - {self.get_status_display()}"


class WhatsAppLog(models.Model):
    """Historial de mensajes WhatsApp enviados"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('sent', 'Enviado'),
        ('delivered', 'Entregado'),
        ('read', 'Leído'),
        ('failed', 'Fallido'),
    ]
    
    recipient = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='whatsapp_logs',
        verbose_name='Destinatario'
    )
    phone_number = models.CharField(
        max_length=20,
        verbose_name='Número de teléfono'
    )
    message = models.TextField(
        verbose_name='Mensaje'
    )
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Plantilla'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Enviado en'
    )
    external_id = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='ID externo',
        help_text='ID del mensaje en la API de WhatsApp'
    )
    error_message = models.TextField(
        blank=True,
        verbose_name='Mensaje de error'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Log de WhatsApp'
        verbose_name_plural = 'Logs de WhatsApp'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"WhatsApp a {self.phone_number} - {self.get_status_display()}"


class NotificationPreference(models.Model):
    """Preferencias de notificación del usuario"""
    
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='notification_preferences',
        verbose_name='Usuario'
    )
    email_enabled = models.BooleanField(
        default=True,
        verbose_name='Emails habilitados'
    )
    whatsapp_enabled = models.BooleanField(
        default=False,
        verbose_name='WhatsApp habilitado'
    )
    renewal_reminders = models.BooleanField(
        default=True,
        verbose_name='Recordatorios de renovación'
    )
    class_reminders = models.BooleanField(
        default=True,
        verbose_name='Recordatorios de clase'
    )
    promotional = models.BooleanField(
        default=True,
        verbose_name='Promociones'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Preferencia de Notificación'
        verbose_name_plural = 'Preferencias de Notificación'
    
    def __str__(self):
        return f"Preferencias de {self.user}"
