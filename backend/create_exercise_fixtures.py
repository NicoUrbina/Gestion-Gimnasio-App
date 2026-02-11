"""
Script para crear fixtures de ejercicios iniciales
Ejecutar con: python manage.py shell < create_exercise_fixtures.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import MuscleGroup, Exercise

# Crear grupos musculares
muscle_groups = {
    'Pecho': 'Músculos pectorales mayor y menor',
    'Espalda': 'Dorsal ancho, trapecio, romboides',
    'Piernas': 'Cuádriceps, isquiotibiales, glúteos',
    'Hombros': 'Deltoides anterior, medio y posterior',
    'Brazos': 'Bíceps, tríceps, antebrazos',
    'Core': 'Abdominales y oblicuos',
    'Cardio': 'Ejercicios cardiovasculares',
}

print("Creando grupos musculares...")
for name, desc in muscle_groups.items():
    group, created = MuscleGroup.objects.get_or_create(name=name, defaults={'description': desc})
    print(f"  {'✓' if created else '→'} {name}")

# Ejercicios por grupo
exercises = [
    # PECHO
    {'name': 'Press de banca plano', 'muscle_group': 'Pecho', 'difficulty': 'intermediate', 
     'equipment_needed': 'Barra, banco plano', 'instructions': 'Acostado en banco plano, bajar barra al pecho y empujar hacia arriba.'},
    {'name': 'Press inclinado con mancuernas', 'muscle_group': 'Pecho', 'difficulty': 'intermediate',
     'equipment_needed': 'Mancuernas, banco inclinado', 'instructions': 'En banco inclinado a 30-45°, empujar mancuernas hacia arriba.'},
    {'name': 'Aperturas con mancuernas', 'muscle_group': 'Pecho', 'difficulty': 'beginner',
     'equipment_needed': 'Mancuernas, banco', 'instructions': 'Abrir brazos manteniendo ligera flexión de codos.'},
    
    # ESPALDA
    {'name': 'Dominadas', 'muscle_group': 'Espalda', 'difficulty': 'advanced',
     'equipment_needed': 'Barra de dominadas', 'instructions': 'Colgar de la barra y levantar cuerpo hasta que barbilla supere barra.'},
    {'name': 'Remo con barra', 'muscle_group': 'Espalda', 'difficulty': 'intermediate',
     'equipment_needed': 'Barra', 'instructions': 'Inclinado 45°, tirar barra hacia abdomen.'},
    {'name': 'Jalón al pecho', 'muscle_group': 'Espalda', 'difficulty': 'beginner',
     'equipment_needed': 'Máquina de poleas', 'instructions': 'Tirar barra hacia el pecho manteniendo espalda recta.'},
    
    # PIERNAS
    {'name': 'Sentadilla con barra', 'muscle_group': 'Piernas', 'difficulty': 'intermediate',
     'equipment_needed': 'Barra, rack', 'instructions': 'Bajar hasta que muslos estén paralelos al suelo.'},
    {'name': 'Prensa de piernas', 'muscle_group': 'Piernas', 'difficulty': 'beginner',
     'equipment_needed': 'Máquina de prensa', 'instructions': 'Empujar plataforma con ambas piernas.'},
    {'name': 'Peso muerto', 'muscle_group': 'Piernas', 'difficulty': 'advanced',
     'equipment_needed': 'Barra', 'instructions': 'Levantar barra desde el suelo manteniendo espalda recta.'},
    {'name': 'Zancadas', 'muscle_group': 'Piernas', 'difficulty': 'beginner',
     'equipment_needed': 'Mancuernas (opcional)', 'instructions': 'Dar paso largo adelante y bajar cadera.'},
    
    # HOMBROS
    {'name': 'Press militar con barra', 'muscle_group': 'Hombros', 'difficulty': 'intermediate',
     'equipment_needed': 'Barra', 'instructions': 'De pie o sentado, empujar barra por encima de la cabeza.'},
    {'name': 'Elevaciones laterales', 'muscle_group': 'Hombros', 'difficulty': 'beginner',
     'equipment_needed': 'Mancuernas', 'instructions': 'Elevar mancuernas lateralmente hasta altura de hombros.'},
    {'name': 'Remo al mentón', 'muscle_group': 'Hombros', 'difficulty': 'intermediate',
     'equipment_needed': 'Barra', 'instructions': 'Tirar barra hacia barbilla con codos altos.'},
    
    # BRAZOS
    {'name': 'Curl de bíceps con barra', 'muscle_group': 'Brazos', 'difficulty': 'beginner',
     'equipment_needed': 'Barra', 'instructions': 'Flexionar codos manteniendo espalda recta.'},
    {'name': 'Extensiones de tríceps en polea', 'muscle_group': 'Brazos', 'difficulty': 'beginner',
     'equipment_needed': 'Polea', 'instructions': 'Empujar cuerda o barra hacia abajo extendiendo codos.'},
    {'name': 'Fondos en paralelas', 'muscle_group': 'Brazos', 'difficulty': 'intermediate',
     'equipment_needed': 'Barras paralelas', 'instructions': 'Bajar cuerpo flexionando codos a 90°.'},
    
    # CORE
    {'name': 'Plancha abdominal', 'muscle_group': 'Core', 'difficulty': 'beginner',
     'equipment_needed': 'Ninguno', 'instructions': 'Mantener cuerpo en línea recta apoyado en antebrazos.'},
    {'name': 'Abdominales crunch', 'muscle_group': 'Core', 'difficulty': 'beginner',
     'equipment_needed': 'Ninguno', 'instructions': 'Elevar torso superior hacia rodillas.'},
    {'name': 'Russian twist', 'muscle_group': 'Core', 'difficulty': 'intermediate',
     'equipment_needed': 'Disco o mancuerna', 'instructions': 'Sentado, rotar torso de lado a lado.'},
    
    # CARDIO
    {'name': 'Caminadora', 'muscle_group': 'Cardio', 'difficulty': 'beginner',
     'equipment_needed': 'Caminadora', 'instructions': 'Caminar o correr a ritmo constante.'},
    {'name': 'Bicicleta estática', 'muscle_group': 'Cardio', 'difficulty': 'beginner',
     'equipment_needed': 'Bicicleta estática', 'instructions': 'Pedalear manteniendo ritmo cardíaco objetivo.'},
]

print("\nCreando ejercicios...")
created_count = 0
for ex_data in exercises:
    group_name = ex_data.pop('muscle_group')
    muscle_group = MuscleGroup.objects.get(name=group_name)
    
    exercise, created = Exercise.objects.get_or_create(
        name=ex_data['name'],
        defaults={
            'muscle_group': muscle_group,
            'difficulty': ex_data['difficulty'],
            'equipment_needed': ex_data.get('equipment_needed', ''),
            'instructions': ex_data.get('instructions', ''),
            'description': ex_data.get('instructions', ''),
            'is_active': True
        }
    )
    
    if created:
        created_count += 1
        print(f"  ✓ {exercise.name} ({group_name})")

print(f"\n✅ Creados {created_count} ejercicios nuevos")
print(f"📊 Total de ejercicios en sistema: {Exercise.objects.count()}")
