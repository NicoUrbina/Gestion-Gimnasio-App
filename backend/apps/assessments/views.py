"""
Views para Evaluaciones Físicas
Sistema de Gestión de Gimnasio
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import FitnessAssessment, Goal, NutritionPlan
from .serializers import (
    FitnessAssessmentSerializer,
    AssessmentRequestSerializer,
    AssessmentScheduleSerializer,
    GoalSerializer,
    NutritionPlanSerializer
)
from apps.staff.models import Staff


class FitnessAssessmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para evaluaciones físicas
    
    Endpoints:
    - GET /assessments/ - Lista de evaluaciones
    - POST /assessments/request_evaluation/ - Cliente solicita evaluación
    - POST /assessments/{id}/schedule/ - Trainer agenda evaluación
    - POST /assessments/{id}/complete/ - Trainer completa evaluación  
    - POST /assessments/{id}/cancel/ - Cancelar evaluación
    """
    
    serializer_class = FitnessAssessmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar según rol del usuario"""
        user = self.request.user
        
        if user.role.name == 'Miembro':
            # Clientes solo ven sus evaluaciones
            return FitnessAssessment.objects.filter(member__user=user)
        elif user.role.name in ['Entrenador', 'Administrador']:
            # Staff ve todas
            return FitnessAssessment.objects.all().select_related('member__user', 'assessed_by__user')
        
        return FitnessAssessment.objects.none()
    
    @action(detail=False, methods=['post'])
    def request_evaluation(self, request):
        """
        Cliente solicita nueva evaluación
        POST /assessments/request_evaluation/
        Body: { personal_goals, medical_notes }
        """
        try:
            member = request.user.member
        except:
            return Response(
                {'error': 'Usuario no es un miembro'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = AssessmentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        assessment = FitnessAssessment.objects.create(
            member=member,
            personal_goals=serializer.validated_data.get('personal_goals', ''),
            medical_notes=serializer.validated_data.get('medical_notes', ''),
            status='pending'
        )
        
        # TODO: Integrar con sistema de notificaciones
        
        return Response(
            FitnessAssessmentSerializer(assessment).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        """
        Trainer agenda evaluación
        POST /assessments/{id}/schedule/
        Body: { scheduled_for, trainer_id }
        """
        assessment = self.get_object()
        
        if assessment.status not in ['pending', 'scheduled']:
            return Response(
                {'error': 'Esta evaluación no puede ser agendada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AssessmentScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        trainer = get_object_or_404(Staff, id=serializer.validated_data['trainer_id'])
        
        assessment.scheduled_for = serializer.validated_data['scheduled_for']
        assessment.assessed_by = trainer
        assessment.status = 'scheduled'
        assessment.save()
        
        # TODO: Integrar con sistema de notificaciones
        
        return Response(FitnessAssessmentSerializer(assessment).data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Trainer completa evaluación con mediciones
        POST /assessments/{id}/complete/
        Body: { weight, height, ... todos los campos de medición }
        """
        assessment = self.get_object()
        
        if assessment.status != 'scheduled':
            return Response(
                {'error': 'Solo se pueden completar evaluaciones agendadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = FitnessAssessmentSerializer(
            assessment,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            status='completed',
            completed_at=timezone.now()
        )
        
        # TODO: Integrar con sistema de notificaciones
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancelar evaluación
        POST /assessments/{id}/cancel/
        """
        assessment = self.get_object()
        
        if assessment.status == 'completed':
            return Response(
                {'error': 'No se puede cancelar una evaluación completada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assessment.status = 'cancelled'
        assessment.save()
        
        return Response(FitnessAssessmentSerializer(assessment).data)


class GoalViewSet(viewsets.ModelViewSet):
    """ViewSet para metas del cliente"""
    
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return Goal.objects.filter(member__user=user)
        elif user.role.name in ['Entrenador', 'Administrador']:
            return Goal.objects.all().select_related('member__user')
        
        return Goal.objects.none()
    
    def perform_create(self, serializer):
        """Auto-asignar member si es cliente"""
        if self.request.user.role.name == 'Miembro':
            serializer.save(member=self.request.user.member)
        else:
            serializer.save()


class NutritionPlanViewSet(viewsets.ModelViewSet):
    """ViewSet para planes nutricionales"""
    
    serializer_class = NutritionPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role.name == 'Miembro':
            return NutritionPlan.objects.filter(member__user=user)
        elif user.role.name in ['Entrenador', 'Administrador']:
            return NutritionPlan.objects.all().select_related('member__user', 'created_by__user')
        
        return NutritionPlan.objects.none()
    
    def perform_create(self, serializer):
        """Auto-asignar created_by"""
        if hasattr(self.request.user, 'staff'):
            serializer.save(created_by=self.request.user.staff)
        else:
            serializer.save()
