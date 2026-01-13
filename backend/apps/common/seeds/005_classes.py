"""
Seeder para Clases Programadas
"""
from datetime import datetime, timedelta
from apps.classes.models import ClassType, GymClass
from apps.staff.models import Staff


def seed():
    """Crear clases programadas para las proximas 2 semanas"""
    
    # Obtener tipos de clase
    yoga = ClassType.objects.filter(name='Yoga').first()
    spinning = ClassType.objects.filter(name='Spinning').first()
    crossfit = ClassType.objects.filter(name='CrossFit').first()
    pilates = ClassType.objects.filter(name='Pilates').first()
    zumba = ClassType.objects.filter(name='Zumba').first()
    funcional = ClassType.objects.filter(name='Funcional').first()
    boxing = ClassType.objects.filter(name='Boxing').first()
    stretching = ClassType.objects.filter(name='Stretching').first()
    
    if not all([yoga, spinning, crossfit, pilates, zumba, funcional, boxing, stretching]):
        print("  [!] Error: No se encontraron todos los tipos de clase. Ejecuta 004_class_types primero.")
        return 0
    
    # Obtener instructores (staff)
    instructors = list(Staff.objects.all()[:3])
    if not instructors:
        print("  [!] Advertencia: No hay instructores. Las clases se crearan sin instructor.")
        instructors = [None, None, None]
    
    # Fecha base: hoy
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Horarios del dia (hora de inicio)
    morning_slots = [6, 7, 8, 9, 10]
    afternoon_slots = [14, 15, 16, 17, 18]
    evening_slots = [19, 20, 21]
    
    # Programa de clases semanal (que clases van en que horarios)
    # Formato: (class_type, horarios_preferidos, dias_semana [0=Lun, 6=Dom])
    weekly_schedule = [
        # Lunes
        (yoga, [7, 19], [0]),
        (spinning, [6, 18, 20], [0]),
        (crossfit, [8, 17], [0]),
        (funcional, [9, 16], [0]),
        
        # Martes
        (pilates, [7, 18], [1]),
        (boxing, [8, 19], [1]),
        (zumba, [17, 20], [1]),
        (stretching, [6, 21], [1]),
        
        # Miercoles
        (yoga, [7, 19], [2]),
        (spinning, [6, 18, 20], [2]),
        (funcional, [9, 17], [2]),
        (crossfit, [8, 16], [2]),
        
        # Jueves
        (pilates, [7, 18], [3]),
        (boxing, [8, 19], [3]),
        (zumba, [17, 20], [3]),
        (funcional, [9], [3]),
        
        # Viernes
        (yoga, [7, 18], [4]),
        (spinning, [6, 19, 20], [4]),
        (crossfit, [8, 17], [4]),
        (stretching, [21], [4]),
        
        # Sabado
        (yoga, [9, 17], [5]),
        (spinning, [8, 18], [5]),
        (zumba, [10, 16], [5]),
        (funcional, [11], [5]),
        (stretching, [19], [5]),
        
        # Domingo
        (yoga, [9, 18], [6]),
        (pilates, [10], [6]),
        (stretching, [17], [6]),
    ]
    
    created_count = 0
    
    # Crear clases para las proximas 2 semanas
    for week_offset in range(2):
        for class_type, time_slots, weekdays in weekly_schedule:
            for weekday in weekdays:
                for hour in time_slots:
                    # Calcular la fecha
                    days_ahead = weekday - today.weekday() + (week_offset * 7)
                    if days_ahead < 0:
                        days_ahead += 7
                    
                    class_date = today + timedelta(days=days_ahead)
                    start_datetime = class_date.replace(hour=hour, minute=0)
                    end_datetime = start_datetime + timedelta(minutes=class_type.default_duration_minutes)
                    
                    # Saltear clases pasadas
                    if start_datetime < datetime.now():
                        continue
                    
                    # Asignar instructor rotativo
                    instructor = instructors[created_count % len(instructors)] if instructors[0] else None
                    
                    # Crear la clase
                    gym_class, created = GymClass.objects.get_or_create(
                        class_type=class_type,
                        start_datetime=start_datetime,
                        defaults={
                            'instructor': instructor,
                            'title': f"{class_type.name} - {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][weekday]}",
                            'description': class_type.description,
                            'end_datetime': end_datetime,
                            'capacity': class_type.default_capacity,
                            'location': 'Sala Principal',
                            'is_recurring': False,
                            'is_cancelled': False,
                        }
                    )
                    
                    if created:
                        created_count += 1
                        day_name = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][start_datetime.weekday()]
                        print(f"  ✓ Clase creada: {class_type.name} - {day_name} {start_datetime.strftime('%d/%m %H:%M')}")
    
    print(f"\n[005_classes] {created_count} clases programadas creadas")
    return created_count
