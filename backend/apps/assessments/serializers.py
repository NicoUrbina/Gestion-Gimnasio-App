"""
Serializers para Evaluaciones Físicas
Sistema de Gestión de Gimnasio
"""

from rest_framework import serializers
from .models import FitnessAssessment, Goal, NutritionPlan


class FitnessAssessmentSerializer(serializers.ModelSerializer):
    """Serializer completo para evaluaciones físicas"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    trainer_name = serializers.CharField(source='assessed_by.user.get_full_name', read_only=True)
    bmi = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    
    class Meta:
        model = FitnessAssessment
        fields = '__all__'
        read_only_fields = ['requested_at', 'completed_at', 'created_at', 'updated_at']


class AssessmentRequestSerializer(serializers.ModelSerializer):
    """Serializer para que el cliente solicite evaluación"""
    
    class Meta:
        model = FitnessAssessment
        fields = ['personal_goals', 'medical_notes']


class AssessmentScheduleSerializer(serializers.Serializer):
    """Serializer para agendar evaluación"""
    
    scheduled_for = serializers.DateTimeField(required=True)
    trainer_id = serializers.IntegerField(required=True)


class GoalSerializer(serializers.ModelSerializer):
    """Serializer para metas del cliente"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    progress_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class NutritionPlanSerializer(serializers.ModelSerializer):
    """Serializer para planes nutricionales"""
    
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.user.get_full_name', read_only=True)
    
    class Meta:
        model = NutritionPlan
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
