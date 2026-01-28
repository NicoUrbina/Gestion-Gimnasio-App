"""
Sistema de Permisos y Decoradores
Sistema de Gestión de Gimnasio
"""

from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied


def role_required(allowed_roles):
    """
    Decorador para requerir roles específicos en las vistas.
    
    Uso:
        @role_required(['admin', 'staff'])
        def my_view(request):
            ...
    
    Args:
        allowed_roles (list): Lista de roles permitidos ['admin', 'staff', 'trainer', 'member']
    
    Raises:
        PermissionDenied: Si el usuario no tiene un rol permitido
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            user = request.user
            
            # Verificar que el usuario esté autenticado
            if not user.is_authenticated:
                return Response(
                    {'detail': 'Autenticación requerida'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Superusuarios tienen acceso a todo
            if user.is_superuser:
                return view_func(request, *args, **kwargs)
            
            # Verificar rol del usuario
            user_role = user.role.name if user.role else None
            
            if user_role not in allowed_roles:
                return Response(
                    {
                        'detail': f'No tiene permisos para esta acción. Roles permitidos: {", ".join(allowed_roles)}',
                        'required_roles': allowed_roles,
                        'current_role': user_role
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return view_func(request, *args, **kwargs)
        
        return wrapper
    return decorator


def is_admin(user):
    """
    Verifica si el usuario es administrador
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si es admin o superuser
    """
    if user.is_superuser:
        return True
    return user.role and user.role.name == 'admin'


def is_staff_member(user):
    """
    Verifica si el usuario es staff (empleado)
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si es staff
    """
    return user.role and user.role.name == 'staff'


def is_trainer(user):
    """
    Verifica si el usuario es entrenador
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si es trainer
    """
    return user.role and user.role.name == 'trainer'


def is_member(user):
    """
    Verifica si el usuario es miembro/cliente
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si es member
    """
    return user.role and user.role.name == 'member'


def can_manage_members(user):
    """
    Verifica si el usuario puede gestionar miembros
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si puede gestionar (admin o staff)
    """
    return is_admin(user) or is_staff_member(user)


def can_manage_payments(user):
    """
    Verifica si el usuario puede gestionar pagos
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si puede gestionar (admin o staff)
    """
    return is_admin(user) or is_staff_member(user)


def can_view_all_data(user):
    """
    Verifica si el usuario puede ver todos los datos del sistema
    
    Args:
        user: Usuario de Django
    
    Returns:
        bool: True si puede ver todo (solo admin)
    """
    return is_admin(user)


class RolePermissionMixin:
    """
    Mixin para ViewSets que agrega verificación de permisos por rol
    
    Uso en un ViewSet:
        class MyViewSet(RolePermissionMixin, viewsets.ModelViewSet):
            role_permissions = {
                'list': ['admin', 'staff'],
                'create': ['admin'],
                'update': ['admin', 'staff'],
                'destroy': ['admin'],
            }
    """
    
    role_permissions = {}
    
    def check_role_permissions(self):
        """Verifica permisos basados en el action"""
        user = self.request.user
        action = self.action
        
        # Si no hay permisos definidos para esta acción, permitir
        if action not in self.role_permissions:
            return True
        
        allowed_roles = self.role_permissions[action]
        
        # Superusuarios siempre tienen acceso
        if user.is_superuser:
            return True
        
        # Verificar rol
        user_role = user.role.name if user.role else None
        
        if user_role not in allowed_roles:
            raise PermissionDenied(
                f'No tiene permisos para esta acción. Roles permitidos: {", ".join(allowed_roles)}'
            )
        
        return True
    
    def dispatch(self, request, *args, **kwargs):
        """Override dispatch para verificar permisos antes de ejecutar"""
        self.check_role_permissions()
        return super().dispatch(request, *args, **kwargs)
