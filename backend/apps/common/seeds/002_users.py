from django.contrib.auth import get_user_model
from apps.users.models import Role, User as CustomUser

def run():
    User = get_user_model()
    
    # 1. Super Admin
    if not User.objects.filter(email='admin@gym.com').exists():
        admin_role = Role.objects.get(name='admin')
        User.objects.create_superuser(
            username='admin',
            email='admin@gym.com',
            password='adminpassword123',
            first_name='Admin',
            last_name='User',
            role=admin_role
        )
        print("  + Superusuario creado: admin@gym.com")
    else:
        print("  . Superusuario ya existe")

    # 2. Entrenador
    if not User.objects.filter(email='trainer@gym.com').exists():
        trainer_role = Role.objects.get(name='trainer')
        User.objects.create_user(
            username='trainer',
            email='trainer@gym.com',
            password='trainerpassword123',
            first_name='Juan',
            last_name='Entrenador',
            role=trainer_role
        )
        print("  + Entrenador creado: trainer@gym.com")
    else:
        print("  . Entrenador ya existe")
