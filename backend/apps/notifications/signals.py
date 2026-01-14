"""Signals para auto-generación de notificaciones"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.payments.models import Payment
from apps.classes.models import Reservation
from .models import Notification


@receiver(post_save, sender=Payment)
def notify_payment_status(sender, instance, created, **kwargs):
    """
    Notificar cuando un pago cambia a completed o cancelled
    """
    if not created and instance.status in ['completed', 'cancelled']:
        # Solo notificar si el estado cambió ahora
        if instance.status == 'completed':
            Notification.objects.create(
                user=instance.member.user,
                title='✅ Pago Aprobado',
                message=f'Tu pago de ${instance.amount} ha sido aprobado exitosamente.',
                notification_type='success',
                link=f'/payments/{instance.id}'
            )
        elif instance.status == 'cancelled' and instance.rejection_reason:
            Notification.objects.create(
                user=instance.member.user,
                title='❌ Pago Rechazado',
                message=f'Tu pago de ${instance.amount} fue rechazado. Motivo: {instance.rejection_reason}',
                notification_type='error',
                link=f'/payments/{instance.id}'
            )


@receiver(post_save, sender=Reservation)
def notify_class_reservation(sender, instance, created, **kwargs):
    """
    Notificar cuando se reserva una clase
    """
    if created and instance.status == 'confirmed':
        from django.utils.dateformat import format as date_format
        
        class_date = date_format(instance.gym_class.date, 'd/m/Y')
        class_time = instance.gym_class.start_time.strftime('%H:%M')
        
        Notification.objects.create(
            user=instance.member.user,
            title='📅 Clase Reservada',
            message=f'Reservaste {instance.gym_class.class_type.name} para el {class_date} a las {class_time}.',
            notification_type='success',
            link='/classes/my-reservations'
        )
