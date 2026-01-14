"""Views para Notificaciones"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para notificaciones in-app
    Solo lectura - las notificaciones se crean via signals
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Solo notificaciones del usuario actual"""
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Contador de notificaciones no leídas"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Últimas 5 notificaciones (para dropdown)"""
        notifications = self.get_queryset()[:5]
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marcar una notificación como leída"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response(self.get_serializer(notification).data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Marcar todas las notificaciones como leídas"""
        from django.utils import timezone
        updated = self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({
            'updated': updated,
            'message': f'{updated} notificaciones marcadas como leídas'
        })


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """ViewSet para preferencias de notificación del usuario"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch']  # Solo lectura y actualización
    
    def get_queryset(self):
        """Solo preferencias del usuario actual"""
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def get_object(self):
        """Obtener o crear preferencias del usuario"""
        obj, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return obj
    
    def list(self, request, *args, **kwargs):
        """Retornar preferencias del usuario"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
