"""Serializers para Notificaciones"""
from rest_framework import serializers
from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer para notificaciones in-app"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    time_since = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'user_name',
            'title',
            'message',
            'notification_type',
            'is_read',
            'read_at',
            'link',
            'created_at',
            'time_since',
        ]
        read_only_fields = ['user', 'created_at', 'read_at']
    
    def get_time_since(self, obj):
        """Tiempo relativo desde creación"""
        from django.utils.timesince import timesince
        return timesince(obj.created_at)


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer para preferencias de notificación"""
    
    class Meta:
        model = NotificationPreference
        fields = [
            'email_enabled',
            'whatsapp_enabled',
            'renewal_reminders',
            'class_reminders',
            'promotional',
        ]
