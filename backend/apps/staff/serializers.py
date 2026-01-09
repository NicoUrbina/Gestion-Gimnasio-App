"""
Serializers para Staff
"""
from rest_framework import serializers
from .models import Staff, Schedule
from apps.users.serializers import UserSerializer


class ScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = Schedule
        fields = [
            'id', 'staff', 'day_of_week', 'day_of_week_display',
            'start_time', 'end_time', 'is_available'
        ]


class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    staff_type_display = serializers.CharField(source='get_staff_type_display', read_only=True)
    schedules = ScheduleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Staff
        fields = [
            'id', 'user', 'user_id', 'staff_type', 'staff_type_display',
            'specializations', 'bio', 'certifications', 'hire_date',
            'hourly_rate', 'is_instructor', 'is_active', 'schedules',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class StaffListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    staff_type_display = serializers.CharField(source='get_staff_type_display', read_only=True)
    
    class Meta:
        model = Staff
        fields = ['id', 'full_name', 'staff_type', 'staff_type_display', 'specializations', 'is_instructor', 'is_active']
