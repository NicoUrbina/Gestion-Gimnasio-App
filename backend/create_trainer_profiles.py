"""
Script para crear perfiles Staff para todos los usuarios trainer
Ejecutar con: python manage.py shell < create_trainer_profiles.py
"""

from apps.users.models import User, Role
from apps.staff.models import Staff
from django.utils import timezone

# Obtener todos los usuarios con rol trainer que no tengan perfil staff
trainers_without_profile = User.objects.filter(
    role__name=Role.TRAINER
).exclude(
    staff_profile__isnull=False
)

print(f"Encontrados {trainers_without_profile.count()} entrenadores sin perfil Staff")

# Crear perfiles para cada uno
created_count = 0
for user in trainers_without_profile:
    try:
        Staff.objects.create(
            user=user,
            hire_date=timezone.now().date(),
            staff_type='trainer',
        )
        print(f"✓ Perfil Staff creado para: {user.email}")
        created_count += 1
    except Exception as e:
        print(f"✗ Error creando perfil para {user.email}: {e}")

print(f"\n✓ Proceso completado: {created_count} perfiles creados")
