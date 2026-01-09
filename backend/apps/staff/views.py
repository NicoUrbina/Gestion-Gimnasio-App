"""
ViewSets para Staff
"""
from rest_framework import viewsets, permissions, filters
from .models import Staff, Schedule
from .serializers import StaffSerializer, StaffListSerializer, ScheduleSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'specializations']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StaffListSerializer
        return StaffSerializer
    
    def get_queryset(self):
        queryset = Staff.objects.select_related('user').prefetch_related('schedules')
        
        # Filtrar por tipo de staff
        staff_type = self.request.query_params.get('staff_type')
        if staff_type:
            queryset = queryset.filter(staff_type=staff_type)
        
        # Filtrar solo instructores
        is_instructor = self.request.query_params.get('is_instructor')
        if is_instructor:
            queryset = queryset.filter(is_instructor=True)
        
        # Solo activos por defecto
        if self.action == 'list':
            queryset = queryset.filter(is_active=True)
        
        return queryset


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Schedule.objects.select_related('staff__user')
        
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)
        
        return queryset
