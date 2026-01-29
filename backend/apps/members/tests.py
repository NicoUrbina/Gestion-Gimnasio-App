"""
Integration tests for Members API endpoints.
Tests verify member CRUD operations and permissions.
"""
import pytest
from rest_framework import status
from apps.members.models import Member


@pytest.mark.integration
@pytest.mark.django_db
class TestMemberAPICreate:
    """Test POST /api/members/ endpoint."""
    
    def test_create_member_successful(self, admin_client):
        """Admin can create a new member."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = User.objects.create_user(
            email='newmember@test.com',
            password='testpass123',
            first_name='New',
            last_name='Member',
            role='member'
        )
        
        url = '/api/members/'
        data = {
            'user': user.id,
            'phone': '1234567890',
            'gender': 'M',
            'subscription_status': 'inactive'
        }
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['phone'] == '1234567890'
        assert response.data['gender'] == 'M'
    
    def test_member_creation_requires_user(self, admin_client):
        """Member creation requires a user."""
        url = '/api/members/'
        data = {
            'phone': '1234567890',
            'gender': 'M'
        }
        
        response = admin_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.integration
@pytest.mark.django_db
class TestMemberAPIRead:
    """Test GET /api/members/ endpoints."""
    
    def test_list_members(self, admin_client, member):
        """Admin can list all members."""
        url = '/api/members/'
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) >= 1
    
    def test_retrieve_member_detail(self, admin_client, member):
        """Admin can retrieve member details."""
        url = f'/api/members/{member.id}/'
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == member.id
        assert 'user' in response.data
        assert 'phone' in response.data


@pytest.mark.integration
@pytest.mark.django_db
class TestMemberAPIUpdate:
    """Test PUT/PATCH /api/members/{id}/ endpoints."""
    
    def test_update_member(self, admin_client, member):
        """Admin can update member information."""
        url = f'/api/members/{member.id}/'
        data = {
            'phone': '9999999999',
            'address': 'New Address 123'
        }
        
        response = admin_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['phone'] == '9999999999'
        assert response.data['address'] == 'New Address 123'
        
        member.refresh_from_db()
        assert member.phone == '9999999999'


@pytest.mark.integration
@pytest.mark.django_db
class TestMemberAPIDelete:
    """Test DELETE /api/members/{id}/ endpoint."""
    
    def test_delete_member(self, admin_client, member_user):
        """Admin can delete a member."""
        # Create a separate member to delete
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = User.objects.create_user(
            email='todelete@test.com',
            password='testpass',
            first_name='To',
            last_name='Delete',
            role='member'
        )
        member_to_delete = Member.objects.create(user=user)
        
        url = f'/api/members/{member_to_delete.id}/'
        response = admin_client.delete(url)
        
        assert response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]
        assert not Member.objects.filter(id=member_to_delete.id).exists()


@pytest.mark.integration
@pytest.mark.django_db
class TestMemberAPIPermissions:
    """Test member API permissions."""
    
    def test_member_can_view_own_profile(self, authenticated_client, member):
        """Members can view their own profile."""
        url = f'/api/members/{member.id}/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == member.id
    
    def test_member_cannot_view_other_profiles(self, authenticated_client):
        """Members cannot view other member profiles."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        other_user = User.objects.create_user(
            email='other@test.com',
            password='testpass',
            first_name='Other',
            last_name='Member',
            role='member'
        )
        other_member = Member.objects.create(user=other_user)
        
        url = f'/api/members/{other_member.id}/'
        response = authenticated_client.get(url)
        
        # Should be forbidden or not found
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
    
    def test_member_cannot_create_member(self, authenticated_client):
        """Regular members cannot create new members."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = User.objects.create_user(
            email='attempt@test.com',
            password='testpass',
            first_name='Attempt',
            last_name='Create',
            role='member'
        )
        
        url = '/api/members/'
        data = {
            'user': user.id,
            'phone': '1234567890'
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
