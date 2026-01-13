from apps.memberships.models import MembershipPlan

def run():
    plans = [
        {
            'name': 'Mensual Básico',
            'price': 30.00,
            'duration_days': 30,
            'description': 'Acceso a máquinas',
            'includes_trainer': False
        },
        {
            'name': 'Mensual Premium',
            'price': 50.00,
            'duration_days': 30,
            'includes_trainer': True,
            'description': 'Máquinas + Entrenador'
        },
        {
            'name': 'Anual VIP',
            'price': 450.00,
            'duration_days': 365,
            'includes_trainer': True,
            'description': 'Acceso total anual con descuento'
        }
    ]
    
    for plan_data in plans:
        plan, created = MembershipPlan.objects.get_or_create(
            name=plan_data['name'], 
            defaults=plan_data
        )
        if created:
            print(f"  + Plan creado: {plan.name}")
        else:
            print(f"  . Plan existente: {plan.name}")
