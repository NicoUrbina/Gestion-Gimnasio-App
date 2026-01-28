"""
Management command to create missing profiles for existing users.

This command scans all existing users and creates the appropriate
profile (Member, Staff) if it's missing based on their role.

Usage:
    python manage.py fix_user_profiles
"""

from django.core.management.base import BaseCommand
from apps.users.models import User, Role
from apps.members.models import Member
from apps.staff.models import Staff
from django.utils import timezone


class Command(BaseCommand):
    help = 'Crea perfiles faltantes (Member/Staff) para usuarios existentes según su rol'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Revisando usuarios para crear perfiles faltantes...'))
        
        members_created = 0
        staff_created = 0
        skipped = 0
        
        # Obtener todos los usuarios
        users = User.objects.all()
        total_users = users.count()
        
        self.stdout.write(f'Total de usuarios a revisar: {total_users}')
        self.stdout.write('')
        
        for user in users:
            # Saltar usuarios sin rol
            if not user.role:
                skipped += 1
                continue
            
            role_name = user.role.name
            
            # VERIFICAR Y CREAR MEMBER
            if role_name == Role.MEMBER:
                if not hasattr(user, 'member_profile'):
                    Member.objects.create(
                        user=user,
                        subscription_status='inactive',
                    )
                    members_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Perfil Member creado para: {user.email}')
                    )
            
            # VERIFICAR Y CREAR STAFF
            elif role_name == Role.STAFF:
                if not hasattr(user, 'staff_profile'):
                    Staff.objects.create(
                        user=user,
                        hire_date=timezone.now().date(),
                        staff_type='admin',
                    )
                    staff_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Perfil Staff creado para: {user.email}')
                    )
            
            # TRAINER usa Staff profile también
            elif role_name == Role.TRAINER:
                if not hasattr(user, 'staff_profile'):
                    Staff.objects.create(
                        user=user,
                        hire_date=timezone.now().date(),
                        staff_type='trainer',  # Tipo específico para trainers
                    )
                    staff_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Perfil Staff (trainer) creado para: {user.email}')
                    )
        
        # Resumen
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Resumen:'))
        self.stdout.write(f'  Usuarios revisados: {total_users}')
        self.stdout.write(f'  Perfiles Member creados: {members_created}')
        self.stdout.write(f'  Perfiles Staff creados: {staff_created}')
        self.stdout.write(f'  Usuarios sin rol (omitidos): {skipped}')
        self.stdout.write('')
        
        if members_created + staff_created > 0:
            self.stdout.write(self.style.SUCCESS('✓ Perfiles faltantes creados exitosamente'))
        else:
            self.stdout.write(self.style.WARNING('○ No se encontraron perfiles faltantes'))
