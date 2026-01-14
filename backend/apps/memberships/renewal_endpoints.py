"""
Endpoints adicionales para Renovación y Retención
Agregar estos métodos a la clase MembershipViewSet en views.py
"""

from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from apps.classes.models import Reservation
from apps.payments.models import Payment
from apps.notifications.models import Notification


# AGREGAR ESTOS MÉTODOS A MembershipViewSet:

@action(detail=True, methods=['post'])
def renew(self, request, pk=None):
    """
    Renovar membresía
    POST /memberships/{id}/renew/
    Body: { duration_months: 1, payment_method: 'efectivo' }
    """
    membership = self.get_object()
    months = int(request.data.get('duration_months', 1))
    payment_method = request.data.get('payment_method', 'efectivo')
    
    if months < 1 or months > 24:
        return Response(
            {'error': 'Duración debe ser entre 1 y 24 meses'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calcular nueva fecha de fin
    if membership.end_date > timezone.now():
        # Si aún está activa, extender desde end_date actual
        new_end_date = membership.end_date + timedelta(days=30 * months)
    else:
        # Si ya venció, extender desde hoy
        new_end_date = timezone.now() + timedelta(days=30 * months)
    
    # Actualizar membresía
    old_end_date = membership.end_date
    membership.end_date = new_end_date
    membership.status = 'active'
    membership.save()
    
    # Crear registro de pago
    amount = membership.plan.price * months
    
    Payment.objects.create(
        member=membership.member,
        amount=amount,
        payment_method=payment_method,
        concept=f'Renovación membresía {months} mes(es)',
        status='completed'
    )
    
    # Crear notificación
    Notification.objects.create(
        user=membership.member.user,
        type='membership_renewed',
        title='Membresía renovada exitosamente',
        message=f'Tu membresía ha sido renovada hasta el {new_end_date.strftime("%d/%m/%Y")}. ¡Gracias por tu confianza!'
    )
    
    return Response({
        'message': 'Membresía renovada exitosamente',
        'old_end_date': old_end_date,
        'new_end_date': new_end_date,
        'payment_created': True,
        'amount_paid': amount
    })


@action(detail=False, methods=['get'])
def expiring_soon(self, request):
    """
    Membresías que están por vencer
    GET /memberships/expiring_soon/?days=30
    """
    days = int(request.query_params.get('days', 30))
    now = timezone.now()
    future_date = now + timedelta(days=days)
    
    expiring = Membership.objects.filter(
        end_date__gte=now,
        end_date__lte=future_date,
        status='active'
    ).select_related('member__user', 'plan').order_by('end_date')
    
    serializer = self.get_serializer(expiring, many=True)
    return Response({
        'count': expiring.count(),
        'results': serializer.data
    })


@action(detail=False, methods=['get'])
def at_risk(self, request):
    """
    Miembros en riesgo de abandono
    GET /memberships/at_risk/
    """
    now = timezone.now()
    two_weeks_ago = now - timedelta(days=14)
    
    active_memberships = Membership.objects.filter(
        status='active'
    ).select_related('member__user', 'plan')
    
    at_risk_list = []
    
    for membership in active_memberships:
        # Contar asistencias últimas 2 semanas
        recent_attendance = Reservation.objects.filter(
            member=membership.member,
            scheduled_class__date__gte=two_weeks_ago,
            status='attended'
        ).count()
        
        # Contar reservas futuras
        future_reservations = Reservation.objects.filter(
            member=membership.member,
            scheduled_class__date__gte=now,
            status__in=['confirmed', 'pending']
        ).count()
        
        # Evaluar riesgo
        risk_factors = []
        if recent_attendance < 2:
            risk_factors.append('BajaAsistencia')
        if future_reservations == 0:
            risk_factors.append('SinReservas')
        
        if risk_factors:
            at_risk_list.append({
                'membership': MembershipSerializer(membership).data,
                'risk_factors': risk_factors,
                'recent_attendance': recent_attendance,
                'future_reservations': future_reservations
            })
    
    return Response({
        'count': len(at_risk_list),
        'results': at_risk_list
    })


@action(detail=False, methods=['get'])
def renewal_stats(self, request):
    """
    Estadísticas de renovación
    GET /memberships/renewal_stats/
    """
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    # Membresías que vencieron el último mes
    expired_last_month = Membership.objects.filter(
        end_date__gte=last_month,
        end_date__lt=now
    ).count()
    
    # Membresías renovadas
    renewals = Payment.objects.filter(
        created_at__gte=last_month,
        concept__icontains='renovación'
    ).count()
    
    # Tasa de renovación
    renewal_rate = (renewals / expired_last_month * 100) if expired_last_month > 0 else 0
    
    # Membresías activas
    active_count = Membership.objects.filter(status='active').count()
    
    # Ingresos proyectados
    expiring_soon = Membership.objects.filter(
        end_date__gte=now,
        end_date__lte=now + timedelta(days=30),
        status='active'
    ).select_related('plan')
    
    projected_revenue = sum(m.plan.price for m in expiring_soon)
    
    return Response({
        'renewal_rate': round(renewal_rate, 2),
        'renewals_last_month': renewals,
        'expired_last_month': expired_last_month,
        'active_memberships': active_count,
        'expiring_next_30_days': expiring_soon.count(),
        'projected_revenue': projected_revenue
    })
