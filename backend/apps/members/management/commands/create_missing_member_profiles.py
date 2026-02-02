"""
Comando para crear perfiles de miembro para usuarios que no los tengan
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.users.models import User
from apps.members.models import Member


class Command(BaseCommand):
    help = 'Crea perfiles de miembro para usuarios con rol "member" que no tengan perfil'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Mostrar qué se haría sin hacer cambios reales',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        # Buscar usuarios con rol 'member' que no tengan perfil de miembro
        users_without_profile = User.objects.filter(
            role__name='member'
        ).exclude(
            id__in=Member.objects.values_list('user_id', flat=True)
        )
        
        count = users_without_profile.count()
        
        if count == 0:
            self.stdout.write(
                self.style.SUCCESS('✓ Todos los usuarios con rol "member" ya tienen perfil de miembro')
            )
            return
        
        self.stdout.write(f'Encontrados {count} usuarios sin perfil de miembro:')
        
        for user in users_without_profile:
            self.stdout.write(f'  - {user.email} (ID: {user.id})')
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN: No se realizaron cambios. Usa sin --dry-run para aplicar.')
            )
            return
        
        # Crear perfiles de miembro
        created_count = 0
        with transaction.atomic():
            for user in users_without_profile:
                try:
                    Member.objects.create(user=user)
                    created_count += 1
                    self.stdout.write(f'✓ Creado perfil para {user.email}')
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'✗ Error creando perfil para {user.email}: {e}')
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'✓ Creados {created_count} perfiles de miembro')
        )