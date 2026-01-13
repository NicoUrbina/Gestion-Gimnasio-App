from apps.users.models import Role

def run():
    roles = {
        'admin': 'Administrador del Sistema',
        'staff': 'Personal del Gimnasio',
        'trainer': 'Entrenador',
        'member': 'Miembro regular'
    }
    
    for code, desc in roles.items():
        role, created = Role.objects.get_or_create(
            name=code, 
            defaults={'description': desc}
        )
        if created:
            print(f"  + Rol creado: {code}")
        else:
            print(f"  . Rol existente: {code}")
