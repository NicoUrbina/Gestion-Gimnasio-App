"""
ViewSets para Pagos
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import Payment, Invoice
from .serializers import PaymentSerializer, PaymentCreateSerializer, InvoiceSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Payment.objects.select_related('member__user', 'membership')
        
        if hasattr(user, 'member_profile') and not user.is_staff:
            queryset = queryset.filter(member__user=user)
        
        # Filtrar por estado
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de pagos"""
        today = timezone.now().date()
        month_start = today.replace(day=1)
        
        # Pagos del mes
        month_payments = Payment.objects.filter(
            payment_date__date__gte=month_start,
            status='completed'
        )
        
        total_month = month_payments.aggregate(total=Sum('amount'))['total'] or 0
        count_month = month_payments.count()
        
        # Pagos de hoy
        today_payments = Payment.objects.filter(
            payment_date__date=today,
            status='completed'
        )
        total_today = today_payments.aggregate(total=Sum('amount'))['total'] or 0
        
        return Response({
            'month': {
                'total': total_month,
                'count': count_month
            },
            'today': {
                'total': total_today,
                'count': today_payments.count()
            }
        })


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
