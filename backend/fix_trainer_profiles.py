"""
Verificar y crear perfil Staff para el usuario actual
"""
from apps.users.models import User, Role
from apps.staff.models import Staff
from django.utils import timezone

# Mostrar todos los usuarios trainer
trainers = User.objects.filter(role__name=Role.TRAINER)
print(f"\n=== Usuarios con rol TRAINER: {trainers.count()} ===\n")

for user in trainers:
    has_staff = hasattr(user, 'staff')
    print(f"Email: {user.email}")
    print(f"Nombre: {user.get_full_name()}")
    print(f"Tiene perfil Staff: {has_staff}")
    
    if not has_staff:
        print("  -> Creando perfil Staff...")
        Staff.objects.create(
            user=user,
            hire_date=timezone.now().date(),
            staff_type='trainer',
        )
        print("  -> ✓ Perfil Staff creado!")
    else:
        print(f"  -> Staff ID: {user.staff.id}")
    
    print("-" * 60)

print("\n✓ Proceso completado\n")
