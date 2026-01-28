"""
Django signals para auto-crear perfiles según el rol del usuario.

Este módulo maneja la creación automática de perfiles extendidos cuando
se crea o actualiza un usuario con un rol específico:

- User con role='member' → Auto-crea Member
- User con role='staff' → Auto-crea Staff
- User con role='trainer' → Solo User (no hay modelo Trainer separado)
- User con role='admin' → Solo User
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Role


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Crea perfiles extendidos automáticamente según el rol del usuario.
    
    Se ejecuta después de guardar un User (crear o actualizar).
    """
    # Solo procesar si el usuario tiene un rol asignado
    if not instance.role:
        return
    
    # Obtener el nombre del rol
    role_name = instance.role.name
    
    # AUTO-CREAR MEMBER PROFILE
    if role_name == Role.MEMBER:
        from apps.members.models import Member
        
        # Verificar si ya existe el perfil
        if not hasattr(instance, 'member_profile'):
            Member.objects.create(
                user=instance,
                subscription_status='inactive',  # Por defecto inactivo hasta asignar membresía
            )
            print(f'✓ Perfil Member creado automáticamente para: {instance.email}')
    
    # AUTO-CREAR STAFF PROFILE
    elif role_name == Role.STAFF:
        from apps.staff.models import Staff
        from django.utils import timezone
        
        # Verificar si ya existe el perfil
        if not hasattr(instance, 'staff_profile'):
            Staff.objects.create(
                user=instance,
                hire_date=timezone.now().date(),  # Fecha de hoy por defecto
                staff_type='admin',  # Por defecto administrativo, se puede cambiar después
            )
            print(f'✓ Perfil Staff creado automáticamente para: {instance.email}')
    
    # TRAINER y ADMIN no requieren perfil separado
    # Solo se usa el User con el rol correspondiente


@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    """
    Actualiza o crea perfiles cuando cambia el rol del usuario.
    
    IMPORTANTE: Si un usuario cambia de rol, este signal maneja la transición.
    """
    # Solo procesar actualizaciones (no creaciones, eso lo maneja create_user_profile)
    if created:
        return
    
    if not instance.role:
        return
    
    role_name = instance.role.name
    
    # Si cambió a MEMBER y no tiene perfil Member, crearlo
    if role_name == Role.MEMBER:
        from apps.members.models import Member
        if not hasattr(instance, 'member_profile'):
            Member.objects.create(
                user=instance,
                subscription_status='inactive',
            )
            print(f'✓ Perfil Member creado por cambio de rol para: {instance.email}')
    
    # Si cambió a STAFF y no tiene perfil Staff, crearlo
    elif role_name == Role.STAFF:
        from apps.staff.models import Staff
        from django.utils import timezone
        if not hasattr(instance, 'staff_profile'):
            Staff.objects.create(
                user=instance,
                hire_date=timezone.now().date(),
                staff_type='admin',
            )
            print(f'✓ Perfil Staff creado por cambio de rol para: {instance.email}')
