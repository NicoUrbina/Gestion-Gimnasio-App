"""
Management Command: Enviar Recordatorios de Renovación
Sistema de Gestión de Gimnasio

Ejecutar diariamente via cron:
python manage.py send_renewal_reminders
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.memberships.models import Membership
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = 'Envía recordatorios de renovación y actualiza membresías vencidas'

    def handle(self, *args, **options):
        now = timezone.now()
        
        # 1. Membresías que vencen en 7 días
        seven_days_ahead = now + timedelta(days=7)
        expiring_in_7 = Membership.objects.filter(
            end_date__date=seven_days_ahead.date(),
            status='active'
        )
        
        self.stdout.write(f'Encontradas {expiring_in_7.count()} membresías que vencen en 7 días')
        
        for membership in expiring_in_7:
            # Crear notificación si no existe ya
            existing = Notification.objects.filter(
                user=membership.member.user,
                type='membership_expiring',
                created_at__date=now.date()
            ).exists()
            
            if not existing:
                Notification.objects.create(
                    user=membership.member.user,
                    type='membership_expiring',
                    title='Tu membresía está por vencer',
                    message=f'Tu membresía vence el {membership.end_date.strftime("%d/%m/%Y")}. Renuévala para seguir disfrutando del gimnasio.',
                    priority='medium',
                    action_url='/memberships/renew'
                )
                self.stdout.write(self.style.SUCCESS(f'  ✓ Notificación enviada a {membership.member.user.get_full_name()}'))
        
        # 2. Membresías que vencen en 3 días (URGENTE)
        three_days_ahead = now + timedelta(days=3)
        expiring_in_3 = Membership.objects.filter(
            end_date__date=three_days_ahead.date(),
            status='active'
        )
        
        self.stdout.write(f'Encontradas {expiring_in_3.count()} membresías que vencen en 3 días')
        
        for membership in expiring_in_3:
            existing = Notification.objects.filter(
                user=membership.member.user,
                type='membership_expiring_urgent',
                created_at__date=now.date()
            ).exists()
            
            if not existing:
                Notification.objects.create(
                    user=membership.member.user,
                    type='membership_expiring_urgent',
                    title='¡URGENTE! Tu membresía vence pronto',
                    message=f'Solo quedan 3 días para que venza tu membresía. Renueva ahora para no perder el acceso.',
                    priority='high',
                    action_url='/memberships/renew'
                )
                self.stdout.write(self.style.WARNING(f'  ⚠ Notificación URGENTE enviada a {membership.member.user.get_full_name()}'))
        
        # 3. Actualizar membresías vencidas
        expired = Membership.objects.filter(
            end_date__lt=now,
            status='active'
        )
        
        count_expired = expired.count()
        expired.update(status='expired')
        
        if count_expired > 0:
            self.stdout.write(self.style.ERROR(f'✖ {count_expired} membresías marcadas como vencidas'))
        
        # 4. Notificar membresías recién vencidas
        just_expired = Membership.objects.filter(
            end_date__date=(now - timedelta(days=1)).date(),
            status='expired'
        )
        
        for membership in just_expired:
            existing = Notification.objects.filter(
                user=membership.member.user,
                type='membership_expired',
                created_at__date=now.date()
            ).exists()
            
            if not existing:
                Notification.objects.create(
                    user=membership.member.user,
                    type='membership_expired',
                    title='Tu membresía ha vencido',
                    message='Tu membresía ha expirado. Renuévala para volver a entrenar.',
                    priority='high',
                    action_url='/memberships/renew'
                )
        
        self.stdout.write(self.style.SUCCESS('\n✓ Proceso de renovación completado'))
