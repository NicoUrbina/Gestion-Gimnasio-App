"""
ViewSets para Analytics del Atleta
"""
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Min, Max, Count
from django.utils import timezone
from datetime import timedelta
from .models import (
    MetricType, AthleteMetric, MetricSnapshot,
    PerformanceGoal, TrainingLog, GymSettings, AuditLog
)
from .serializers import (
    MetricTypeSerializer, AthleteMetricSerializer, MetricSnapshotSerializer,
    PerformanceGoalSerializer, TrainingLogSerializer, GymSettingsSerializer,
    AuditLogSerializer
)


class MetricTypeViewSet(viewsets.ModelViewSet):
    queryset = MetricType.objects.filter(is_active=True)
    serializer_class = MetricTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class AthleteMetricViewSet(viewsets.ModelViewSet):
    queryset = AthleteMetric.objects.all()
    serializer_class = AthleteMetricSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = AthleteMetric.objects.select_related('member__user', 'metric_type')
        
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        member_id = self.request.query_params.get('member_id')
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        metric_type = self.request.query_params.get('metric_type')
        if metric_type:
            queryset = queryset.filter(metric_type_id=metric_type)
        
        return queryset.order_by('-recorded_date')
    
    @action(detail=False, methods=['get'])
    def evolution(self, request):
        """Obtener evolución de una métrica para gráficas"""
        member_id = request.query_params.get('member_id')
        metric_type_id = request.query_params.get('metric_type')
        days = int(request.query_params.get('days', 90))
        
        if not member_id or not metric_type_id:
            return Response({'error': 'member_id y metric_type requeridos'}, status=400)
        
        date_from = timezone.now().date() - timedelta(days=days)
        
        metrics = AthleteMetric.objects.filter(
            member_id=member_id,
            metric_type_id=metric_type_id,
            recorded_date__gte=date_from
        ).order_by('recorded_date')
        
        data = {
            'dates': [m.recorded_date.isoformat() for m in metrics],
            'values': [float(m.value) for m in metrics],
            'stats': metrics.aggregate(
                avg=Avg('value'),
                min=Min('value'),
                max=Max('value'),
                count=Count('id')
            )
        }
        
        return Response(data)


class MetricSnapshotViewSet(viewsets.ModelViewSet):
    queryset = MetricSnapshot.objects.all()
    serializer_class = MetricSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]


class PerformanceGoalViewSet(viewsets.ModelViewSet):
    queryset = PerformanceGoal.objects.all()
    serializer_class = PerformanceGoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = PerformanceGoal.objects.select_related('member__user', 'metric_type')
        
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset


class TrainingLogViewSet(viewsets.ModelViewSet):
    queryset = TrainingLog.objects.all()
    serializer_class = TrainingLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = TrainingLog.objects.select_related('member__user')
        
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['get'])
    def weekly_summary(self, request):
        """Resumen semanal de entrenamientos"""
        member_id = request.query_params.get('member_id')
        if not member_id:
            return Response({'error': 'member_id requerido'}, status=400)
        
        week_ago = timezone.now().date() - timedelta(days=7)
        
        logs = TrainingLog.objects.filter(
            member_id=member_id,
            date__gte=week_ago
        )
        
        return Response({
            'total_sessions': logs.count(),
            'total_minutes': sum(log.duration_minutes for log in logs),
            'total_calories': sum(log.calories_burned or 0 for log in logs),
            'training_types': list(logs.values('training_type').annotate(count=Count('id')))
        })


class GymSettingsViewSet(viewsets.ModelViewSet):
    queryset = GymSettings.objects.all()
    serializer_class = GymSettingsSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_object(self):
        return GymSettings.get_settings()
    
    def list(self, request):
        settings = GymSettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        return AuditLog.objects.select_related('user').order_by('-created_at')[:100]
