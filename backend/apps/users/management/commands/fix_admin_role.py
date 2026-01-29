"""
Comando para asignar rol admin al usuario administrador
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import Role

User = get_user_model()


class Command(BaseCommand):
    help = 'Asigna el rol de administrador al usuario admin@gimnasio.com'

    def handle(self, *args, **options):
        try:
            # Obtener el rol admin
            admin_role = Role.objects.get(name='admin')
            
            # Obtener el usuario admin
            admin_user = User.objects.get(email='admin@gimnasio.com')
            
            # Asignar el rol
            admin_user.role = admin_role
            admin_user.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Rol "admin" asignado correctamente a {admin_user.email}'
                )
            )
            
        except Role.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('❌ Rol "admin" no encontrado en la base de datos')
            )
            self.stdout.write(
                self.style.WARNING('   Ejecuta primero: python manage.py seed 001_roles')
            )
            
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('❌ Usuario admin@gimnasio.com no encontrado')
            )
