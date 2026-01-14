"""
Management command para notificar membresías próximas a vencer
Ejecutar diariamente con cron o task scheduler
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.memberships.models import Membership
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = 'Notifica a usuarios con membresías que vencen en 7 días'
    
    def handle(self, *args, **options):
        """
        Buscar membresías activas que vencen exactamente en 7 días
        y crear notificaciones
        """
        seven_days = timezone.now().date() + timedelta(days=7)
        
        expiring_memberships = Membership.objects.filter(
            end_date=seven_days,
            status='active'
        ).select_related('member__user', 'plan')
        
        created_count = 0
        
        for membership in expiring_memberships:
            # Verificar que no se haya notificado ya
            existing = Notification.objects.filter(
                user=membership.member.user,
                notification_type='warning',
                title__contains='Membresía por Vencer',
                created_at__gte=timezone.now() - timedelta(days=1)
            ).exists()
            
            if not existing:
                Notification.objects.create(
                    user=membership.member.user,
                    title='⚠️ Membresía por Vencer',
                    message=f'Tu membresía {membership.plan.name} vence el {membership.end_date.strftime("%d/%m/%Y")}. Renuévala para seguir disfrutando de todos los beneficios.',
                    notification_type='warning',
                    link='/memberships'
                )
                created_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ {created_count} notificaciones de vencimiento creadas'
            )
        )
