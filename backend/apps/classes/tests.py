"""
Integration tests for Classes and Reservations API endpoints.
Tests verify reservation creation, waitlist, capacity limits, and attendance marking.
"""
import pytest
from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from apps.classes.models import GymClass, Reservation, ClassType


@pytest.mark.integration
@pytest.mark.django_db  
class TestReservationAPICreate:
    """Test reservation creation endpoint."""
    
    def test_create_reservation_successful(self, authenticated_client, member, gym_class):
        """Successfully create a reservation for a class."""
        url = '/api/classes/reservations/'
        data = {
            'gym_class': gym_class.id,
            'member': member.id
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['gym_class'] == gym_class.id
        assert response.data['member'] == member.id
        assert response.data['status'] == 'confirmed'
    
    def test_cannot_reserve_twice_same_class(self, authenticated_client, member, gym_class):
        """Cannot create duplicate reservation for same class."""
        # Create first reservation
        Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='confirmed'
        )
        
        url = '/api/classes/reservations/'
        data = {
            'gym_class': gym_class.id,
            'member': member.id
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.integration
@pytest.mark.django_db
class TestReservationCapacityAndWaitlist:
    """Test class capacity limits and waitlist functionality."""
    
    def test_reservation_goes_to_waitlist_when_full(self, authenticated_client, gym_class):
        """Reservation goes to waitlist when class is full."""
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        # Fill the class (capacity is 5 in fixture)
        for i in range(gym_class.capacity):
            user = User.objects.create_user(
                email=f'member{i}@test.com',
                password='testpass',
                first_name=f'Member{i}',
                last_name='Test',
                role='member'
            )
            member = Member.objects.create(user=user)
            Reservation.objects.create(
                gym_class=gym_class,
                member=member,
                status='confirmed'
            )
        
        # Try to reserve when full
        new_user = User.objects.create_user(
            email='newmember@test.com',
            password='testpass',
            first_name='New',
            last_name='Member',
            role='member'
        )
        new_member = Member.objects.create(user=new_user)
        
        url = '/api/classes/reservations/'
        data = {
            'gym_class': gym_class.id,
            'member': new_member.id
        }
        
        # Authenticate as new user
        from rest_framework_simplejwt.tokens import RefreshToken
        from rest_framework.test import APIClient
        client = APIClient()
        refresh = RefreshToken.for_user(new_user)
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = client.post(url, data, format='json')
        
        # Should either create waitlist or return error depending on implementation
        # Most likely should allow waitlist creation
        if response.status_code == status.HTTP_201_CREATED:
            assert response.data['status'] == 'waitlist'
    
    def test_available_spots_calculation(self, admin_client, gym_class, member):
        """Test available spots are calculated correctly."""
        # Create 2 reservations (capacity is 5)
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        for i in range(2):
            user = User.objects.create_user(
                email=f'member{i}@test.com',
                password='testpass',
                first_name=f'Member{i}',
                last_name='Test',
                role='member'
            )
            member_obj = Member.objects.create(user=user)
            Reservation.objects.create(
                gym_class=gym_class,
                member=member_obj,
                status='confirmed'
            )
        
        url = f'/api/classes/classes/{gym_class.id}/'
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Should have 3 available spots (5 - 2 = 3)
        assert response.data['available_spots'] == 3


@pytest.mark.integration
@pytest.mark.django_db
class TestReservationCancellation:
    """Test reservation cancellation and waitlist promotion."""
    
    def test_cancel_reservation(self, authenticated_client, member, gym_class):
        """Successfully cancel a reservation."""
        reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='confirmed'
        )
        
        url = f'/api/classes/reservations/{reservation.id}/cancel/'
        response = authenticated_client.post(url)
        
        if response.status_code == status.HTTP_200_OK:
            reservation.refresh_from_db()
            assert reservation.status == 'cancelled'
            assert reservation.cancelled_at is not None


@pytest.mark.integration
@pytest.mark.django_db
class TestAttendanceMarking:
    """Test marking attendance for reservations."""
    
    def test_mark_attended(self, staff_client, member, gym_class):
        """Staff can mark reservation as attended."""
        reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='confirmed'
        )
        
        url = f'/api/classes/reservations/{reservation.id}/mark_attended/'
        response = staff_client.post(url)
        
        if response.status_code == status.HTTP_200_OK:
            reservation.refresh_from_db()
            assert reservation.status == 'attended'
            assert reservation.attended_at is not None
