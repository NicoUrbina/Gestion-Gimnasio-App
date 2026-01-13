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
    
    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Pagos del usuario actual (si es miembro)"""
        if not hasattr(request.user, 'member_profile'):
            return Response({'detail': 'No eres un miembro'}, status=400)
        
        payments = Payment.objects.filter(
            member=request.user.member_profile
        ).select_related('member__user', 'membership')
        
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Aprobar un pago pendiente"""
        payment = self.get_object()
        
        if not request.user.is_staff:
            return Response({'detail': 'No tienes permisos'}, status=403)
        
        if payment.approve(request.user):
            return Response({
                'detail': 'Pago aprobado exitosamente',
                'payment': PaymentSerializer(payment).data
            })
        else:
            return Response({'detail': 'El pago no está pendiente'}, status=400)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rechazar un pago pendiente"""
        payment = self.get_object()
        
        if not request.user.is_staff:
            return Response({'detail': 'No tienes permisos'}, status=403)
        
        reason = request.data.get('reason', '')
        if not reason:
            return Response({'detail': 'Debes proporcionar un motivo'}, status=400)
        
        if payment.reject(reason, request.user):
            return Response({
                'detail': 'Pago rechazado',
                'payment': PaymentSerializer(payment).data
            })
        else:
            return Response({'detail': 'El pago no está pendiente'}, status=400)
    
    @action(detail=False, methods=['get'])
    def pending_count(self, request):
        """Contador de pagos pendientes"""
        if not request.user.is_staff:
            return Response({'count': 0})
        
        count = Payment.objects.filter(status='pending').count()
        return Response({'count': count})


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
