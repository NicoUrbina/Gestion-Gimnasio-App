"""
Management command to seed the database with default roles and permissions.

Usage:
    python manage.py seed_roles
"""

from django.core.management.base import BaseCommand
from apps.users.models import Role


class Command(BaseCommand):
    help = 'Crea los roles por defecto del sistema con sus permisos'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Iniciando seed de roles...'))
        
        # Definición de roles con sus descripciones y permisos
        roles_data = [
            {
                'name': Role.ADMIN,
                'description': 'Administrador del Sistema - Acceso total a todas las funcionalidades',
                'permissions': {
                    'users': ['view', 'create', 'edit', 'delete', 'reset_password'],
                    'roles': ['view', 'create', 'edit', 'delete'],
                    'members': ['view', 'create', 'edit', 'delete'],
                    'memberships': ['view', 'create', 'edit', 'delete', 'cancel'],
                    'payments': ['view', 'create', 'edit', 'delete', 'refund'],
                    'classes': ['view', 'create', 'edit', 'delete', 'cancel'],
                    'trainers': ['view', 'create', 'edit', 'delete'],
                    'workouts': ['view', 'create', 'edit', 'delete'],
                    'evaluations': ['view', 'create', 'edit', 'delete'],
                    'reports': ['view', 'generate', 'export'],
                    'settings': ['view', 'edit'],
                    'notifications': ['view', 'send'],
                }
            },
            {
                'name': Role.STAFF,
                'description': 'Personal del Gimnasio - Gestión de miembros, pagos y operaciones diarias',
                'permissions': {
                    'members': ['view', 'create', 'edit'],
                    'memberships': ['view', 'create'],
                    'payments': ['view', 'create'],
                    'classes': ['view', 'reserve'],
                    'reports': ['view'],
                    'notifications': ['view'],
                }
            },
            {
                'name': Role.TRAINER,
                'description': 'Entrenador - Gestión de rutinas, evaluaciones y clases',
                'permissions': {
                    'members': ['view'],
                    'classes': ['view', 'edit', 'attendance'],
                    'workouts': ['view', 'create', 'edit', 'assign'],
                    'evaluations': ['view', 'create', 'edit'],
                    'progress': ['view', 'track'],
                    'notifications': ['view'],
                }
            },
            {
                'name': Role.MEMBER,
                'description': 'Miembro/Cliente - Acceso a su información personal y servicios',
                'permissions': {
                    'profile': ['view', 'edit'],
                    'classes': ['view', 'reserve', 'cancel'],
                    'payments': ['view'],
                    'workouts': ['view'],
                    'evaluations': ['view'],
                    'progress': ['view'],
                    'memberships': ['view'],
                }
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for role_data in roles_data:
            role, created = Role.objects.get_or_create(
                name=role_data['name'],
                defaults={
                    'description': role_data['description'],
                    'permissions': role_data['permissions']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Rol creado: {role.get_name_display()}')
                )
            else:
                # Actualizar descripción y permisos si el rol ya existe
                role.description = role_data['description']
                role.permissions = role_data['permissions']
                role.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'○ Rol actualizado: {role.get_name_display()}')
                )
        
        # Resumen
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Resumen:'))
        self.stdout.write(f'  Roles creados: {created_count}')
        self.stdout.write(f'  Roles actualizados: {updated_count}')
        self.stdout.write(f'  Total de roles: {Role.objects.count()}')
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('✓ Seed de roles completado exitosamente'))
        
        # Mostrar los roles existentes
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Roles en el sistema:'))
        for role in Role.objects.all():
            self.stdout.write(f'  • {role.get_name_display()} ({role.name})')
            self.stdout.write(f'    {role.description}')
