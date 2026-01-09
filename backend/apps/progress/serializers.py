"""
Serializers para Progreso
"""
from rest_framework import serializers
from .models import ProgressLog, Achievement


class ProgressLogSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    bmi = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProgressLog
        fields = [
            'id', 'member', 'member_name', 'date', 'weight', 'height',
            'body_fat_percentage', 'muscle_mass', 'chest', 'waist', 'hips',
            'notes', 'bmi', 'registered_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AchievementSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    achievement_type_display = serializers.CharField(source='get_achievement_type_display', read_only=True)
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'member', 'member_name', 'achievement_type', 'achievement_type_display',
            'title', 'description', 'achieved_date', 'icon', 'created_at'
        ]
        read_only_fields = ['created_at']
