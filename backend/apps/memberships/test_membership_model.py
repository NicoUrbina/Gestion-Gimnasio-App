"""
Unit tests for Membership model business logic.
CRITICAL: These tests verify membership expiration and access control logic.
"""
import pytest
from datetime import timedelta
from django.utils import timezone
from apps.memberships.models import Membership


@pytest.mark.unit
@pytest.mark.django_db
class TestMembershipDaysRemaining:
    """Test Membership.days_remaining property."""
    
    def test_days_remaining_active_membership(self, member, membership_plan):
        """Days remaining calculated correctly for active membership."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=15),
            status='active'
        )
        
        assert membership.days_remaining == 15
    
    def test_days_remaining_zero_when_expired(self, member, membership_plan):
        """Days remaining is 0 when membership has expired."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=60),
            end_date=timezone.now().date() - timedelta(days=1),
            status='active'
        )
        
        assert membership.days_remaining == 0
    
    def test_days_remaining_zero_when_inactive(self, member, membership_plan):
        """Days remaining is 0 for non-active memberships."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=15),
            status='frozen'
        )
        
        assert membership.days_remaining == 0
    
    def test_days_remaining_expires_today(self, member, membership_plan):
        """Days remaining is 0 when membership expires today."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=30),
            end_date=timezone.now().date(),
            status='active'
        )
        
        assert membership.days_remaining == 0


@pytest.mark.unit
@pytest.mark.django_db
class TestMembershipIsExpiringSoon:
    """Test Membership.is_expiring_soon property."""
    
    def test_is_expiring_soon_with_7_days(self, member, membership_plan):
        """Membership expiring in 7 days is expiring soon."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=7),
            status='active'
        )
        
        assert membership.is_expiring_soon is True
    
    def test_is_expiring_soon_with_3_days(self, member, membership_plan):
        """Membership expiring in 3 days is expiring soon."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=3),
            status='active'
        )
        
        assert membership.is_expiring_soon is True
    
    def test_not_expiring_soon_with_8_days(self, member, membership_plan):
        """Membership expiring in 8 days is not expiring soon."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=8),
            status='active'
        )
        
        assert membership.is_expiring_soon is False
    
    def test_not_expiring_soon_when_expired(self, member, membership_plan):
        """Expired membership is not expiring soon."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=60),
            end_date=timezone.now().date() - timedelta(days=1),
            status='active'
        )
        
        assert membership.is_expiring_soon is False


@pytest.mark.unit
@pytest.mark.django_db
class TestMembershipFreeze:
    """Test Membership.freeze() method."""
    
    def test_freeze_active_membership(self, member, membership_plan):
        """Can freeze an active membership with freeze permissions."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='active'
        )
        
        result = membership.freeze()
        
        assert result is True
        assert membership.status == 'frozen'
        assert membership.frozen_at is not None
    
    def test_cannot_freeze_when_plan_not_allowed(self, member):
        """Cannot freeze when plan doesn't allow freezing."""
        from apps.memberships.models import MembershipPlan
        
        no_freeze_plan = MembershipPlan.objects.create(
            name='Plan Sin Congelación',
            price=Decimal('40.00'),
            duration_days=30,
            can_freeze=False
        )
        
        membership = Membership.objects.create(
            member=member,
            plan=no_freeze_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='active'
        )
        
        result = membership.freeze()
        
        assert result is False
        assert membership.status == 'active'
    
    def test_cannot_freeze_when_limit_exceeded(self, member, membership_plan):
        """Cannot freeze when frozen days limit is exceeded."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='active',
            frozen_days_used=15  # Already used max days
        )
        
        # membership_plan has max_freeze_days=15 by default
        result = membership.freeze()
        
        assert result is False
        assert membership.status == 'active'


@pytest.mark.unit
@pytest.mark.django_db
class TestMembershipUnfreeze:
    """Test Membership.unfreeze() method."""
    
    def test_unfreeze_frozen_membership(self, member, membership_plan):
        """Unfreeze extends end_date by days frozen."""
        original_end_date = timezone.now().date() + timedelta(days=20)
        frozen_date = timezone.now().date() - timedelta(days=5)
        
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=10),
            end_date=original_end_date,
            status='frozen',
            frozen_at=frozen_date,
            frozen_days_used=0
        )
        
        result = membership.unfreeze()
        
        assert result is True
        assert membership.status == 'active'
        assert membership.frozen_at is None
        # End date should be extended by 5 days
        assert membership.end_date == original_end_date + timedelta(days=5)
        assert membership.frozen_days_used == 5
    
    def test_cannot_unfreeze_active_membership(self, member, membership_plan):
        """Cannot unfreeze an active membership."""
        membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='active'
        )
        
        result = membership.unfreeze()
        
        assert result is False
        assert membership.status == 'active'


# Import Decimal for the test
from decimal import Decimal
