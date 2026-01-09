"""
ViewSets para Acceso
"""
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import AccessLog, AbandonmentAlert
from .serializers import (
    AccessLogSerializer, AccessLogCreateSerializer, AbandonmentAlertSerializer
)


class AccessLogViewSet(viewsets.ModelViewSet):
    queryset = AccessLog.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AccessLogCreateSerializer
        return AccessLogSerializer
    
    def get_queryset(self):
        queryset = AccessLog.objects.select_related('member__user')
        
        member_id = self.request.query_params.get('member_id')
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        # Filtrar por fecha
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(timestamp__date=date)
        
        return queryset.order_by('-timestamp')
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Accesos de hoy"""
        today = timezone.now().date()
        logs = AccessLog.objects.filter(
            timestamp__date=today,
            access_type='entry'
        ).select_related('member__user')
        
        serializer = AccessLogSerializer(logs, many=True)
        return Response({
            'count': logs.count(),
            'logs': serializer.data
        })


class AbandonmentAlertViewSet(viewsets.ModelViewSet):
    queryset = AbandonmentAlert.objects.all()
    serializer_class = AbandonmentAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AbandonmentAlert.objects.select_related('member__user')
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        else:
            # Por defecto solo pendientes
            queryset = queryset.filter(status='pending')
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolver una alerta"""
        alert = self.get_object()
        notes = request.data.get('notes', '')
        
        alert.resolve(request.user, notes)
        return Response({'message': 'Alerta resuelta'})
