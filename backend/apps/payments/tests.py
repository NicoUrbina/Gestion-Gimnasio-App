"""
Integration tests for Payment API endpoints.
These tests verify that the API returns the correct data structure and HTTP status codes expected by React frontend.
"""
import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from apps.payments.models import Payment
from apps.members.models import Member
from apps.memberships.models import Membership


@pytest.mark.integration
@pytest.mark.django_db
class TestPaymentAPICreate:
    """Test POST /api/payments/ endpoint."""
    
    def test_staff_can_create_payment_completed(self, staff_client, member, active_membership):
        """Staff users create payments that are automatically completed."""
        url = '/api/payments/'
        data = {
            'member': member.id,
            'membership': active_membership.id,
            'amount': '50.00',
            'payment_method': 'cash',
            'description': 'Pago de membresía mensual'
        }
        
        response = staff_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['status'] == 'completed'
        assert response.data['amount'] == '50.00'
        assert response.data['payment_method'] == 'cash'
        assert 'id' in response.data
        assert 'created_at' in response.data
    
    def test_member_creates_pending_payment(self, authenticated_client, member, active_membership):
        """Members create payments that are pending approval."""
        url = '/api/payments/'
        data = {
            'member': member.id,
            'membership': active_membership.id,
            'amount': '50.00',
            'payment_method': 'transfer',
            'reference_number': 'REF123456'
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['status'] == 'pending'
        assert response.data['reference_number'] == 'REF123456'
    
    def test_payment_requires_member(self, staff_client):
        """Payment creation fails without member."""
        url = '/api/payments/'
        data = {
            'amount': '50.00',
            'payment_method': 'cash'
        }
        
        response = staff_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'member' in response.data
    
    def test_payment_requires_amount(self, staff_client, member):
        """Payment creation fails without amount."""
        url = '/api/payments/'
        data = {
            'member': member.id,
            'payment_method': 'cash'
        }
        
        response = staff_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'amount' in response.data
    
    def test_payment_requires_payment_method(self, staff_client, member):
        """Payment creation fails without payment method."""
        url = '/api/payments/'
        data = {
            'member': member.id,
            'amount': '50.00'
        }
        
        response = staff_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'payment_method' in response.data


@pytest.mark.integration
@pytest.mark.django_db
class TestPaymentAPIApproval:
    """Test POST /api/payments/{id}/approve/ endpoint."""
    
    def test_staff_can_approve_pending_payment(self, staff_client, staff_user, member, active_membership):
        """Staff can approve pending payments."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='pending',
            reference_number='REF123'
        )
        
        url = f'/api/payments/{payment.id}/approve/'
        response = staff_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Pago aprobado exitosamente'
        assert response.data['payment']['status'] == 'completed'
        
        payment.refresh_from_db()
        assert payment.status == 'completed'
        assert payment.approved_by == staff_user
        assert payment.approved_at is not None
    
    def test_member_cannot_approve_payment(self, authenticated_client, member, active_membership):
        """Members cannot approve payments."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='pending'
        )
        
        url = f'/api/payments/{payment.id}/approve/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_cannot_approve_already_completed_payment(self, staff_client, member, active_membership):
        """Cannot approve already completed payments."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        url = f'/api/payments/{payment.id}/approve/'
        response = staff_client.post(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'no está pendiente' in response.data['detail'].lower()


@pytest.mark.integration
@pytest.mark.django_db
class TestPaymentAPIRejection:
    """Test POST /api/payments/{id}/reject/ endpoint."""
    
    def test_staff_can_reject_pending_payment(self, staff_client, staff_user, member, active_membership):
        """Staff can reject pending payments with reason."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='pending',
            reference_number='REF123'
        )
        
        url = f'/api/payments/{payment.id}/reject/'
        data = {'reason': 'Número de referencia no válido'}
        response = staff_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Pago rechazado'
        assert response.data['payment']['status'] == 'cancelled'
        
        payment.refresh_from_db()
        assert payment.status == 'cancelled'
        assert payment.rejection_reason == 'Número de referencia no válido'
        assert payment.approved_by == staff_user  # Stores who rejected it
    
    def test_reject_requires_reason(self, staff_client, member, active_membership):
        """Rejection requires a reason."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='pending'
        )
        
        url = f'/api/payments/{payment.id}/reject/'
        response = staff_client.post(url, {}, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'motivo' in response.data['detail'].lower()


@pytest.mark.integration
@pytest.mark.django_db
class TestPaymentAPIStats:
    """Test GET /api/payments/stats/ endpoint."""
    
    def test_stats_returns_month_and_today_totals(self, staff_client, member, active_membership):
        """Stats endpoint returns monthly and daily aggregates."""
        from django.utils import timezone
        
        # Create payments for today
        Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed',
            payment_date=timezone.now()
        )
        Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('30.00'),
            payment_method='card',
            status='completed',
            payment_date=timezone.now()
        )
        
        url = '/api/payments/stats/'
        response = staff_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'month' in response.data
        assert 'today' in response.data
        assert response.data['today']['total'] == 80.0
        assert response.data['today']['count'] == 2
    
    def test_stats_excludes_pending_payments(self, staff_client, member, active_membership):
        """Stats only count completed payments."""
        from django.utils import timezone
        
        Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='pending',
            payment_date=timezone.now()
        )
        
        url = '/api/payments/stats/'
        response = staff_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['today']['total'] == 0
        assert response.data['today']['count'] == 0


@pytest.mark.integration
@pytest.mark.django_db
class TestPaymentAPIPermissions:
    """Test payment API permissions."""
    
    def test_members_only_see_own_payments(self, authenticated_client, member, member_user, active_membership):
        """Members can only see their own payments."""
        # Create payment for this member
        Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        # Create another member and payment
        from django.contrib.auth import get_user_model
        User = get_user_model()
        other_user = User.objects.create_user(
            email='other@test.com',
            password='testpass',
            first_name='Other',
            last_name='User',
            role='member'
        )
        other_member = Member.objects.create(user=other_user)
        Payment.objects.create(
            member=other_member,
            amount=Decimal('30.00'),
            payment_method='cash',
            status='completed'
        )
        
        url = '/api/payments/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['member'] == member.id
    
    def test_staff_sees_all_payments(self, staff_client, member, active_membership):
        """Staff can see all payments."""
        Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        other_user = User.objects.create_user(
            email='other@test.com',
            password='testpass',
            first_name='Other',
            last_name='User',
            role='member'
        )
        other_member = Member.objects.create(user=other_user)
        Payment.objects.create(
            member=other_member,
            amount=Decimal('30.00'),
            payment_method='cash',
            status='completed'
        )
        
        url = '/api/payments/'
        response = staff_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) >= 2
