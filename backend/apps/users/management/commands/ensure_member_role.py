"""
Management command para crear el rol 'member' si no existe
"""
from django.core.management.base import BaseCommand
from apps.users.models import Role


class Command(BaseCommand):
    help = 'Crea el rol member si no existe'

    def handle(self, *args, **options):
        self.stdout.write('Verificando rol member...')

        role, created = Role.objects.get_or_create(
            name='member',
            defaults={
                'description': 'Miembro del gimnasio',
                'permissions': {
                    'classes': ['read'],
                    'workouts': ['read'],
                    'progress': ['create', 'read', 'update'],
                }
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS('✓ Rol member creado exitosamente'))
        else:
            self.stdout.write(self.style.SUCCESS('✓ Rol member ya existe'))
        
        self.stdout.write(f'  ID: {role.id}')
        self.stdout.write(f'  Nombre: {role.name}')
        self.stdout.write(f'  Descripción: {role.description}')
