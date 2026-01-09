"""
Serializers para Acceso
"""
from rest_framework import serializers
from .models import AccessLog, AbandonmentAlert


class AccessLogSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    access_type_display = serializers.CharField(source='get_access_type_display', read_only=True)
    
    class Meta:
        model = AccessLog
        fields = [
            'id', 'member', 'member_name', 'access_type', 'access_type_display',
            'timestamp', 'registered_by', 'notes'
        ]
        read_only_fields = ['timestamp']


class AccessLogCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessLog
        fields = ['member', 'access_type', 'notes']
    
    def create(self, validated_data):
        validated_data['registered_by'] = self.context['request'].user
        return super().create(validated_data)


class AbandonmentAlertSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    member_email = serializers.EmailField(source='member.user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AbandonmentAlert
        fields = [
            'id', 'member', 'member_name', 'member_email', 'days_inactive',
            'status', 'status_display', 'created_at', 'resolved_at',
            'resolved_by', 'notes'
        ]
        read_only_fields = ['created_at', 'resolved_at']
