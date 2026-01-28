"""
Seeder de Usuarios - Sistema de Gestión de Gimnasio
Crea usuarios de prueba para todos los roles del sistema
"""

from django.contrib.auth import get_user_model
from apps.users.models import Role

User = get_user_model()


def seed():
    """
    Crea usuarios de prueba para todos los roles:
    - 1 Admin (superusuario)
    - 5 Staff (empleados)
    - 10 Trainers (entrenadores)
    - 30 Members (miembros/clientes)
    """
    
    print("\n=== CREANDO USUARIOS DEL SISTEMA ===\n")
    
    # Obtener roles
    try:
        admin_role = Role.objects.get(name='admin')
        staff_role = Role.objects.get(name='staff')
        trainer_role = Role.objects.get(name='trainer')
        member_role = Role.objects.get(name='member')
    except Role.DoesNotExist as e:
        print(f"  [ERROR] Rol no encontrado: {e}")
        print("  [INFO] Ejecuta primero el seeder de roles (001_roles.py)")
        return
    
    # ========================================
    # 1. ADMINISTRADOR
    # ========================================
    print("📋 ADMINISTRADOR:")
    admin_data = {
        'username': 'admin',
        'email': 'admin@gimnasio.com',
        'password': 'admin123',
        'first_name': 'Carlos',
        'last_name': 'Administrador',
        'phone': '+56912345678',
        'role': admin_role
    }
    
    if not User.objects.filter(email=admin_data['email']).exists():
        User.objects.create_superuser(**admin_data)
        print(f"  ✓ Admin creado: {admin_data['email']}")
    else:
        print(f"  → Admin ya existe: {admin_data['email']}")
    
    # ========================================
    # 2. STAFF (5 empleados)
    # ========================================
    print("\n👔 STAFF (Empleados):")
    staff_users = [
        {
            'username': 'staff1',
            'email': 'maria.recepcion@gimnasio.com',
            'password': 'staff123',
            'first_name': 'María',
            'last_name': 'González',
            'phone': '+56923456789',
            'role': staff_role
        },
        {
            'username': 'staff2',
            'email': 'pedro.ventas@gimnasio.com',
            'password': 'staff123',
            'first_name': 'Pedro',
            'last_name': 'Martínez',
            'phone': '+56934567890',
            'role': staff_role
        },
        {
            'username': 'staff3',
            'email': 'laura.mantencion@gimnasio.com',
            'password': 'staff123',
            'first_name': 'Laura',
            'last_name': 'Rodríguez',
            'phone': '+56945678901',
            'role': staff_role
        },
        {
            'username': 'staff4',
            'email': 'jorge.limpieza@gimnasio.com',
            'password': 'staff123',
            'first_name': 'Jorge',
            'last_name': 'Fernández',
            'phone': '+56956789012',
            'role': staff_role
        },
        {
            'username': 'staff5',
            'email': 'ana.nutricion@gimnasio.com',
            'password': 'staff123',
            'first_name': 'Ana',
            'last_name': 'López',
            'phone': '+56967890123',
            'role': staff_role
        }
    ]
    
    _create_users(staff_users)
    
    # ========================================
    # 3. TRAINERS (10 entrenadores)
    # ========================================
    print("\n💪 TRAINERS (Entrenadores):")
    trainer_users = [
        {
            'username': 'trainer1',
            'email': 'roberto.fitness@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Roberto',
            'last_name': 'Sánchez',
            'phone': '+56978901234',
            'role': trainer_role
        },
        {
            'username': 'trainer2',
            'email': 'daniela.yoga@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Daniela',
            'last_name': 'Muñoz',
            'phone': '+56989012345',
            'role': trainer_role
        },
        {
            'username': 'trainer3',
            'email': 'miguel.crossfit@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Miguel',
            'last_name': 'Torres',
            'phone': '+56990123456',
            'role': trainer_role
        },
        {
            'username': 'trainer4',
            'email': 'carolina.pilates@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Carolina',
            'last_name': 'Ramírez',
            'phone': '+56901234567',
            'role': trainer_role
        },
        {
            'username': 'trainer5',
            'email': 'sebastian.cardio@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Sebastián',
            'last_name': 'Castro',
            'phone': '+56912345670',
            'role': trainer_role
        },
        {
            'username': 'trainer6',
            'email': 'valentina.spinning@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Valentina',
            'last_name': 'Morales',
            'phone': '+56923456781',
            'role': trainer_role
        },
        {
            'username': 'trainer7',
            'email': 'diego.funcional@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Diego',
            'last_name': 'Herrera',
            'phone': '+56934567892',
            'role': trainer_role
        },
        {
            'username': 'trainer8',
            'email': 'camila.zumba@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Camila',
            'last_name': 'Silva',
            'phone': '+56945678903',
            'role': trainer_role
        },
        {
            'username': 'trainer9',
            'email': 'francisco.boxeo@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Francisco',
            'last_name': 'Vargas',
            'phone': '+56956789014',
            'role': trainer_role
        },
        {
            'username': 'trainer10',
            'email': 'sofia.natacion@gimnasio.com',
            'password': 'trainer123',
            'first_name': 'Sofía',
            'last_name': 'Rojas',
            'phone': '+56967890125',
            'role': trainer_role
        }
    ]
    
    _create_users(trainer_users)
    
    # ========================================
    # 4. MEMBERS (30 miembros/clientes)
    # ========================================
    print("\n🏃 MEMBERS (Miembros/Clientes):")
    
    # Nombres comunes para generar variedad
    first_names = [
        'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'José',
        'Isabel', 'Antonio', 'Rosa', 'Manuel', 'Patricia', 'David',
        'Elena', 'Javier', 'Lucía', 'Fernando', 'Marta', 'Ricardo',
        'Paula', 'Alberto', 'Cristina', 'Andrés', 'Silvia', 'Raúl',
        'Beatriz', 'Sergio', 'Mónica', 'Pablo', 'Andrea'
    ]
    
    last_names = [
        'García', 'Rodríguez', 'Martínez', 'López', 'González',
        'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
        'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Reyes',
        'Morales', 'Jiménez', 'Hernández', 'Ruiz', 'Mendoza',
        'Álvarez', 'Castillo', 'Romero', 'Vargas', 'Silva',
        'Ortiz', 'Medina', 'Castro', 'Ramos', 'Vega'
    ]
    
    member_users = []
    for i in range(30):
        member_users.append({
            'username': f'member{i+1}',
            'email': f'miembro{i+1}@gimnasio.com',
            'password': 'member123',
            'first_name': first_names[i],
            'last_name': last_names[i],
            'phone': f'+5691{str(i+1).zfill(7)}',
            'role': member_role
        })
    
    _create_users(member_users)
    
    # ========================================
    # RESUMEN
    # ========================================
    print("\n" + "="*50)
    print("✅ PROCESO DE CREACIÓN DE USUARIOS COMPLETADO")
    print("="*50)
    print(f"📊 Total de usuarios en el sistema: {User.objects.count()}")
    print(f"   • Admins: {User.objects.filter(role=admin_role).count()}")
    print(f"   • Staff: {User.objects.filter(role=staff_role).count()}")
    print(f"   • Trainers: {User.objects.filter(role=trainer_role).count()}")
    print(f"   • Members: {User.objects.filter(role=member_role).count()}")
    print("="*50 + "\n")


def _create_users(users_list):
    """
    Función auxiliar para crear usuarios en lote
    
    Args:
        users_list (list): Lista de diccionarios con datos de usuarios
    """
    created_count = 0
    existing_count = 0
    
    for user_data in users_list:
        email = user_data['email']
        
        if not User.objects.filter(email=email).exists():
            User.objects.create_user(**user_data)
            print(f"  ✓ Usuario creado: {email}")
            created_count += 1
        else:
            print(f"  → Usuario ya existe: {email}")
            existing_count += 1
    
    print(f"\n  📊 Creados: {created_count} | Existentes: {existing_count}")


# Alias para compatibilidad con diferentes ejecutores de seeders
def run():
    """Alias de la función seed() para compatibilidad"""
    seed()
