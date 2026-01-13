"""
Seeder para Tipos de Clase
"""
from apps.classes.models import ClassType


def seed():
    """Crear tipos de clase"""
    
    class_types_data = [
        {
            'name': 'Yoga',
            'description': 'Practica de posturas, respiracion y meditacion para fortalecer cuerpo y mente',
            'default_duration_minutes': 60,
            'default_capacity': 15,
            'color': '#10B981',  # Green
            'icon': 'lotus',
            'is_active': True,
        },
        {
            'name': 'Spinning',
            'description': 'Entrenamiento cardiovascular intenso sobre bicicleta estatica',
            'default_duration_minutes': 45,
            'default_capacity': 20,
            'color': '#F59E0B',  # Amber
            'icon': 'bike',
            'is_active': True,
        },
        {
            'name': 'CrossFit',
            'description': 'Entrenamiento funcional de alta intensidad',
            'default_duration_minutes': 60,
            'default_capacity': 12,
            'color': '#EF4444',  # Red
            'icon': 'dumbbell',
            'is_active': True,
        },
        {
            'name': 'Pilates',
            'description': 'Ejercicios de control muscular, flexibilidad y resistencia',
            'default_duration_minutes': 55,
            'default_capacity': 12,
            'color': '#8B5CF6',  # Purple
            'icon': 'activity',
            'is_active': True,
        },
        {
            'name': 'Zumba',
            'description': 'Baile fitness con ritmos latinos',
            'default_duration_minutes': 50,
            'default_capacity': 25,
            'color': '#EC4899',  # Pink
            'icon': 'music',
            'is_active': True,
        },
        {
            'name': 'Funcional',
            'description': 'Entrenamiento con movimientos naturales del cuerpo',
            'default_duration_minutes': 50,
            'default_capacity': 15,
            'color': '#06B6D4',  # Cyan
            'icon': 'target',
            'is_active': True,
        },
        {
            'name': 'Boxing',
            'description': 'Entrenamiento de boxeo y acondicionamiento',
            'default_duration_minutes': 45,
            'default_capacity': 15,
            'color': '#DC2626',  # Dark Red
            'icon': 'hand',
            'is_active': True,
        },
        {
            'name': 'Stretching',
            'description': 'Estiramientos y flexibilidad',
            'default_duration_minutes': 30,
            'default_capacity': 20,
            'color': '#14B8A6',  # Teal
            'icon': 'move',
            'is_active': True,
        },
    ]
    
    created_count = 0
    for class_type_data in class_types_data:
        class_type, created = ClassType.objects.get_or_create(
            name=class_type_data['name'],
            defaults=class_type_data
        )
        if created:
            created_count += 1
            print(f"  ✓ Tipo de clase creado: {class_type.name}")
        else:
            print(f"  - Tipo de clase ya existe: {class_type.name}")
    
    print(f"\n[004_class_types] {created_count} tipos de clase creados")
    return created_count
