"""
Custom permissions for Workout Routines
Sistema de Gestión de Gimnasio
"""

from rest_framework.permissions import BasePermission


class IsTrainerOrAdmin(BasePermission):
    """
    Permission para acciones que solo pueden hacer entrenadores o administradores
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usar nombres exactos del modelo Role
        role_name = getattr(request.user, 'role_name', None) or getattr(request.user.role, 'name', '')
        return role_name in ['trainer', 'admin']


class IsTrainerOrAdminOrReadOnly(BasePermission):
    """
    Permission para permitir lectura a todos, pero escritura solo a trainers/admins
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # SAFE_METHODS = GET, HEAD, OPTIONS
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        role_name = getattr(request.user, 'role_name', None) or getattr(request.user.role, 'name', '')
        return role_name in ['trainer', 'admin']


class CanManageRoutines(BasePermission):
    """
    Permission para gestionar rutinas:
    - Trainers/Admins pueden crear/editar cualquier rutina
    - Miembros solo pueden ver sus propias rutinas
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Para crear/editar rutinas, solo trainers/admins
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            role_name = getattr(request.user, 'role_name', None) or getattr(request.user.role, 'name', '')
            return role_name in ['trainer', 'admin']
        
        return True
    
    def has_object_permission(self, request, view, obj):
        """
        Permission a nivel de objeto individual
        """
        role_name = getattr(request.user, 'role_name', None) or getattr(request.user.role, 'name', '')
        
        # Admins pueden todo
        if role_name == 'admin':
            return True
        
        # Trainers pueden editar cualquier rutina
        if role_name == 'trainer':
            return True
        
        # Miembros solo pueden ver sus propias rutinas
        if role_name == 'member':
            if request.method in ['GET', 'HEAD', 'OPTIONS']:
                return hasattr(request.user, 'member_profile') and obj.member == request.user.member_profile
            return False
        
        return False


class CanLogExercises(BasePermission):
    """
    Permission para registrar ejercicios completados:
    - Miembros pueden crear logs para sus propias sesiones
    - Trainers/Admins pueden ver todos los logs
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return True
    
    def has_object_permission(self, request, view, obj):
        role_name = getattr(request.user, 'role_name', None) or getattr(request.user.role, 'name', '')
        
        # Admins pueden todo
        if role_name == 'admin':
            return True
        
        # Trainers pueden ver todos los logs
        if role_name == 'trainer':
            return request.method in ['GET', 'HEAD', 'OPTIONS']
        
        # Miembros solo pueden ver/crear sus propios logs
        if role_name == 'member':
            return (hasattr(request.user, 'member') and 
                    obj.session.member == request.user.member)
        
        return False
