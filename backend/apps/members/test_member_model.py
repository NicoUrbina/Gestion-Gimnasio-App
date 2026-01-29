"""
Unit tests for Member model business logic.
CRITICAL: These tests verify member access control properties.
"""
import pytest
from datetime import timedelta
from django.utils import timezone
from apps.members.models import Member
from apps.memberships.models import Membership


@pytest.mark.unit
@pytest.mark.django_db
class TestMemberActiveMembership:
    """Test Member.active_membership property."""
    
    def test_active_membership_returns_current_membership(self, member, active_membership):
        """Returns active membership when it exists and is valid."""
        result = member.active_membership
        
        assert result is not None
        assert result.id == active_membership.id
        assert result.status == 'active'
    
    def test_active_membership_returns_none_when_expired(self, member, membership_plan):
        """Returns None when membership has expired."""
        Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=60),
            end_date=timezone.now().date() - timedelta(days=1),
            status='active'
        )
        
        result = member.active_membership
        
        assert result is None
    
    def test_active_membership_returns_none_when_frozen(self, member, membership_plan):
        """Returns None when membership is frozen."""
        Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='frozen'
        )
        
        result = member.active_membership
        
        assert result is None
    
    def test_active_membership_returns_none_when_no_membership(self, member_user):
        """Returns None when member has no memberships."""
        new_member = Member.objects.create(
            user=member_user,
            phone='9999999999'
        )
        
        result = new_member.active_membership
        
        assert result is None


@pytest.mark.unit
@pytest.mark.django_db
class TestMemberIsActive:
    """Test Member.is_active property - CRITICAL for gym access control."""
    
    def test_is_active_true_with_valid_membership(self, member, active_membership):
        """Member is active when they have a valid active membership."""
        assert member.is_active is True
    
    def test_is_active_false_when_no_membership(self, member_user):
        """Member is not active without any membership."""
        new_member = Member.objects.create(
            user=member_user,
            phone='9999999999'
        )
        
        assert new_member.is_active is False
    
    def test_is_active_false_when_membership_expired(self, member, membership_plan):
        """Member is not active when membership has expired."""
        Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=60),
            end_date=timezone.now().date() - timedelta(days=1),
            status='active'
        )
        
        assert member.is_active is False
    
    def test_is_active_false_when_expires_today(self, member, membership_plan):
        """Member is not active on the day membership expires."""
        Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=30),
            end_date=timezone.now().date(),
            status='active'
        )
        
        # This is critical - expires TODAY means not active
        assert member.is_active is False
    
    def test_is_active_false_when_frozen(self, member, membership_plan):
        """Member is not active when membership is frozen."""
        Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='frozen'
        )
        
        assert member.is_active is False


@pytest.mark.unit
@pytest.mark.django_db
class TestMemberDaysInactive:
    """Test Member.days_inactive property."""
    
    def test_days_inactive_calculation(self, member):
        """Correctly calculates days since last access."""
        member.last_access = timezone.now() - timedelta(days=10)
        member.save()
        
        assert member.days_inactive == 10
    
    def test_days_inactive_returns_none_when_never_accessed(self, member):
        """Returns None when member has never accessed."""
        member.last_access = None
        member.save()
        
        assert member.days_inactive is None
    
    def test_days_inactive_zero_when_accessed_today(self, member):
        """Returns 0 when member accessed today."""
        member.last_access = timezone.now()
        member.save()
        
        assert member.days_inactive == 0
