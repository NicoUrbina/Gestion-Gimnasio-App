"""
Integration tests for Membership API endpoints.
Tests verify membership creation, freeze/unfreeze, and validation logic.
"""
import pytest
from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from apps.memberships.models import Membership, MembershipPlan
from apps.members.models import Member


@pytest.mark.integration
@pytest.mark.django_db
class TestMembershipAPICreate:
    """Test POST /api/memberships/ endpoint."""
    
    def test_create_membership_successful(self, admin_client, member, membership_plan):
        """Successfully create a new membership."""
        url = '/api/memberships/'
        data = {
            'member': member.id,
            'plan': membership_plan.id,
            'start_date': timezone.now().date().isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=30)).isoformat()
        }
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['member'] == member.id
        assert response.data['plan'] == membership_plan.id
        assert response.data['status'] == 'active'
        assert 'id' in response.data
    
    def test_cannot_create_duplicate_active_membership(self, admin_client, member, active_membership, membership_plan):
        """Cannot create second active membership for same member."""
        url = '/api/memberships/'
        data = {
            'member': member.id,
            'plan': membership_plan.id,
            'start_date': timezone.now().date().isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=30)).isoformat()
        }
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'activa' in response.data['detail'].lower()
    
    def test_membership_requires_member(self, admin_client, membership_plan):
        """Membership creation requires member."""
        url = '/api/memberships/'
        data = {
            'plan': membership_plan.id,
            'start_date': timezone.now().date().isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=30)).isoformat()
        }
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.integration
@pytest.mark.django_db
class TestMembershipAPIFreeze:
    """Test POST /api/memberships/{id}/freeze/ endpoint."""
    
    def test_freeze_active_membership(self, admin_client, active_membership):
        """Can freeze an active membership."""
        original_end_date = active_membership.end_date
        
        url = f'/api/memberships/{active_membership.id}/freeze/'
        data = {
            'reason': 'Vacaciones',
            'days': 7
        }
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'congelada' in response.data['message'].lower()
        
        active_membership.refresh_from_db()
        assert active_membership.status == 'frozen'
        # End date should be extended
        assert active_membership.end_date > original_end_date
    
    def test_cannot_freeze_non_active_membership(self, admin_client, member, membership_plan):
        """Cannot freeze a membership that is not active."""
        frozen_membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=30),
            end_date=timezone.now().date() + timedelta(days=30),
            status='expired'
        )
        
        url = f'/api/memberships/{frozen_membership.id}/freeze/'
        data = {'days': 7}
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.integration
@pytest.mark.django_db
class TestMembershipAPIUnfreeze:
    """Test POST /api/memberships/{id}/unfreeze/ endpoint."""
    
    def test_unfreeze_frozen_membership(self, admin_client, member, membership_plan):
        """Can unfreeze a frozen membership."""
        frozen_membership = Membership.objects.create(
            member=member,
            plan=membership_plan,
            start_date=timezone.now().date() - timedelta(days=10),
            end_date=timezone.now().date() + timedelta(days=20),
            status='frozen',
            frozen_at=timezone.now().date() - timedelta(days=5)
        )
        
        url = f'/api/memberships/{frozen_membership.id}/unfreeze/'
        response = admin_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'descongelada' in response.data['message'].lower()
        
        frozen_membership.refresh_from_db()
        assert frozen_membership.status == 'active'
        assert frozen_membership.frozen_at is None
    
    def test_cannot_unfreeze_active_membership(self, admin_client, active_membership):
        """Cannot unfreeze a membership that is not frozen."""
        url = f'/api/memberships/{active_membership.id}/unfreeze/'
        response = admin_client.post(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.integration
@pytest.mark.django_db
class TestMembershipPlanAPI:
    """Test GET /api/memberships/plans/ endpoint."""
    
    def test_list_active_plans_for_members(self, authenticated_client):
        """Members only see active plans."""
        MembershipPlan.objects.create(
            name='Plan Activo',
            price=50.00,
            duration_days=30,
            is_active=True
        )
        MembershipPlan.objects.create(
            name='Plan Inactivo',
            price=60.00,
            duration_days=30,
            is_active=False
        )
        
        url = '/api/memberships/plans/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Only active plan should be returned
        plan_names = [plan['name'] for plan in response.data['results']]
        assert 'Plan Activo' in plan_names
        assert 'Plan Inactivo' not in plan_names
    
    def test_staff_sees_all_plans(self, admin_client):
        """Staff can see all plans including inactive ones."""
        MembershipPlan.objects.create(
            name='Plan Activo',
            price=50.00,
            duration_days=30,
            is_active=True
        )
        MembershipPlan.objects.create(
            name='Plan Inactivo',
            price=60.00,
            duration_days=30,
            is_active=False
        )
        
        url = '/api/memberships/plans/'
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) >= 2


@pytest.mark.integration
@pytest.mark.django_db
class TestMembershipAPIPermissions:
    """Test membership API permissions."""
    
    def test_members_only_see_own_memberships(self, authenticated_client, member, active_membership):
        """Members can only see their own memberships."""
        # Create another member with membership
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
        
        # Use the existing membership_plan from active_membership
        Membership.objects.create(
            member=other_member,
            plan=active_membership.plan,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            status='active'
        )
        
        url = '/api/memberships/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Should only see own membership
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['member'] == member.id
