"""
ViewSets para Progreso
"""
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProgressLog, Achievement
from .serializers import ProgressLogSerializer, AchievementSerializer


class ProgressLogViewSet(viewsets.ModelViewSet):
    queryset = ProgressLog.objects.all()
    serializer_class = ProgressLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = ProgressLog.objects.select_related('member__user')
        
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        member_id = self.request.query_params.get('member_id')
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['get'])
    def chart_data(self, request):
        """Datos para gráficas de progreso"""
        member_id = request.query_params.get('member_id')
        if not member_id:
            return Response({'error': 'member_id requerido'}, status=400)
        
        logs = ProgressLog.objects.filter(member_id=member_id).order_by('date')[:30]
        
        data = {
            'dates': [log.date.isoformat() for log in logs],
            'weight': [float(log.weight) if log.weight else None for log in logs],
            'body_fat': [float(log.body_fat_percentage) if log.body_fat_percentage else None for log in logs],
            'muscle_mass': [float(log.muscle_mass) if log.muscle_mass else None for log in logs],
        }
        
        return Response(data)


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Achievement.objects.select_related('member__user')
        
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        return queryset.order_by('-achieved_date')
