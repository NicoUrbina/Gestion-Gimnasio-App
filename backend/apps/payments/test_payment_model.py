"""
Unit tests for Payment model business logic.
Tests verify payment approval, rejection, and state transitions.
"""
import pytest
from decimal import Decimal
from django.utils import timezone
from apps.payments.models import Payment, Invoice


@pytest.mark.unit
@pytest.mark.django_db
class TestPaymentApprovalMethod:
    """Test Payment.approve() method."""
    
    def test_approve_pending_payment(self, member, active_membership, staff_user):
        """Approve method changes pending payment to completed."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='pending',
            reference_number='REF123'
        )
        
        result = payment.approve(staff_user)
        
        assert result is True
        assert payment.status == 'completed'
        assert payment.approved_by == staff_user
        assert payment.approved_at is not None
    
    def test_cannot_approve_completed_payment(self, member, active_membership, staff_user):
        """Cannot approve already completed payment."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        result = payment.approve(staff_user)
        
        assert result is False
        assert payment.status == 'completed'
    
    def test_cannot_approve_cancelled_payment(self, member, active_membership, staff_user):
        """Cannot approve cancelled payment."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='cancelled'
        )
        
        result = payment.approve(staff_user)
        
        assert result is False
        assert payment.status == 'cancelled'


@pytest.mark.unit
@pytest.mark.django_db
class TestPaymentRejectionMethod:
    """Test Payment.reject() method."""
    
    def test_reject_pending_payment(self, member, active_membership, staff_user):
        """Reject method changes pending payment to cancelled with reason."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='transfer',
            status='pending',
            reference_number='REF123'
        )
        
        result = payment.reject('Número de referencia inválido', staff_user)
        
        assert result is True
        assert payment.status == 'cancelled'
        assert payment.rejection_reason == 'Número de referencia inválido'
        assert payment.approved_by == staff_user  # Stores who rejected it
        assert payment.approved_at is not None
    
    def test_cannot_reject_completed_payment(self, member, active_membership, staff_user):
        """Cannot reject already completed payment."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        result = payment.reject('Some reason', staff_user)
        
        assert result is False
        assert payment.status == 'completed'


@pytest.mark.unit
@pytest.mark.django_db
class TestPaymentCompleteMethod:
    """Test Payment.complete() method."""
    
    def test_complete_pending_payment(self, member, active_membership):
        """Complete method changes pending payment to completed."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='pending'
        )
        
        result = payment.complete()
        
        assert result is True
        assert payment.status == 'completed'
    
    def test_cannot_complete_already_completed_payment(self, member, active_membership):
        """Cannot complete already completed payment."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        result = payment.complete()
        
        assert result is False


@pytest.mark.unit
@pytest.mark.django_db
class TestInvoiceGeneration:
    """Test Invoice auto-generation."""
    
    def test_invoice_number_auto_generated(self, member, active_membership):
        """Invoice number is automatically generated on save."""
        payment = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        invoice = Invoice.objects.create(
            payment=payment,
            subtotal=Decimal('50.00'),
            tax=Decimal('0.00'),
            total=Decimal('50.00')
        )
        
        assert invoice.invoice_number is not None
        assert invoice.invoice_number.startswith('FAC-')
        assert len(invoice.invoice_number) > 10
    
    def test_invoice_number_unique(self, member, active_membership):
        """Each invoice gets a unique number."""
        payment1 = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('50.00'),
            payment_method='cash',
            status='completed'
        )
        
        payment2 = Payment.objects.create(
            member=member,
            membership=active_membership,
            amount=Decimal('30.00'),
            payment_method='card',
            status='completed'
        )
        
        invoice1 = Invoice.objects.create(
            payment=payment1,
            subtotal=Decimal('50.00'),
            tax=Decimal('0.00'),
            total=Decimal('50.00')
        )
        
        invoice2 = Invoice.objects.create(
            payment=payment2,
            subtotal=Decimal('30.00'),
            tax=Decimal('0.00'),
            total=Decimal('30.00')
        )
        
        assert invoice1.invoice_number != invoice2.invoice_number
