"""
Unit tests for GymClass and Reservation model business logic.
Tests verify reservation management, capacity, and waitlist functionality
"""
import pytest
from datetime import timedelta
from django.utils import timezone
from apps.classes.models import GymClass, Reservation


@pytest.mark.unit
@pytest.mark.django_db
class TestGymClassAvailableSpots:
    """Test GymClass.available_spots property."""
    
    def test_available_spots_with_no_reservations(self, gym_class):
        """All spots available when no reservations."""
        assert gym_class.available_spots == gym_class.capacity
    
    def test_available_spots_with_confirmed_reservations(self, gym_class, member):
        """Available spots reduced by confirmed reservations."""
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        # Create 2 confirmed reservations (capacity is 5)
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
        
        assert gym_class.available_spots == 3  # 5 - 2 = 3
    
    def test_available_spots_excludes_cancelled(self, gym_class):
        """Cancelled reservations don't reduce available spots."""
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        user = User.objects.create_user(
            email='cancelled@test.com',
            password='testpass',
            first_name='Cancelled',
            last_name='Test',
            role='member'
        )
        member = Member.objects.create(user=user)
        Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='cancelled'
        )
        
        assert gym_class.available_spots == gym_class.capacity


@pytest.mark.unit
@pytest.mark.django_db
class TestGymClassIsFull:
    """Test GymClass.is_full property."""
    
    def test_is_full_when_capacity_reached(self, gym_class):
        """Class is full when confirmed reservations equal capacity."""
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        # Fill all spots (capacity is 5)
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
        
        assert gym_class.is_full is True
    
    def test_not_full_when_spots_available(self, gym_class, member):
        """Class is not full when spots remain."""
        Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='confirmed'
        )
        
        assert gym_class.is_full is False


@pytest.mark.unit
@pytest.mark.django_db
class TestGymClassWaitlistCount:
    """Test GymClass.waitlist_count property."""
    
    def test_waitlist_count_with_waitlist_reservations(self, gym_class):
        """Counts reservations with waitlist status."""
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        # Create 2 waitlist reservations
        for i in range(2):
            user = User.objects.create_user(
                email=f'waitlist{i}@test.com',
                password='testpass',
                first_name=f'Waitlist{i}',
                last_name='Test',
                role='member'
            )
            member = Member.objects.create(user=user)
            Reservation.objects.create(
                gym_class=gym_class,
                member=member,
                status='waitlist',
                waitlist_position=i + 1
            )
        
        assert gym_class.waitlist_count == 2


@pytest.mark.unit
@pytest.mark.django_db
class TestReservationCancel:
    """Test Reservation.cancel() method."""
    
    def test_cancel_confirmed_reservation(self, gym_class, member):
        """Cancel changes status to cancelled and sets cancelled_at."""
        reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='confirmed'
        )
        
        result = reservation.cancel()
        
        assert result is True
        assert reservation.status == 'cancelled'
        assert reservation.cancelled_at is not None
    
    def test_cancel_promotes_waitlist(self, gym_class):
        """Cancelling reservation promotes next in waitlist."""
        from django.contrib.auth import get_user_model
        from apps.members.models import Member
        User = get_user_model()
        
        # Create confirmed reservation
        user1 = User.objects.create_user(
            email='confirmed@test.com',
            password='testpass',
            first_name='Confirmed',
            last_name='Test',
            role='member'
        )
        member1 = Member.objects.create(user=user1)
        confirmed_reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member1,
            status='confirmed'
        )
        
        # Create waitlist reservation
        user2 = User.objects.create_user(
            email='waitlist@test.com',
            password='testpass',
            first_name='Waitlist',
            last_name='Test',
            role='member'
        )
        member2 = Member.objects.create(user=user2)
        waitlist_reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member2,
            status='waitlist',
            waitlist_position=1
        )
        
        # Cancel confirmed reservation
        confirmed_reservation.cancel()
        
        # Waitlist should be promoted
        waitlist_reservation.refresh_from_db()
        assert waitlist_reservation.status == 'confirmed'
        assert waitlist_reservation.waitlist_position is None
    
    def test_cannot_cancel_non_confirmed(self, gym_class, member):
        """Cannot cancel non-confirmed reservations."""
        reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='attended'
        )
        
        result = reservation.cancel()
        
        assert result is False
        assert reservation.status == 'attended'


@pytest.mark.unit
@pytest.mark.django_db
class TestReservationMarkAttended:
    """Test Reservation.mark_attended() method."""
    
    def test_mark_confirmed_as_attended(self, gym_class, member):
        """Mark confirmed reservation as attended."""
        reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='confirmed'
        )
        
        result = reservation.mark_attended()
        
        assert result is True
        assert reservation.status == 'attended'
        assert reservation.attended_at is not None
    
    def test_cannot_mark_cancelled_as_attended(self, gym_class, member):
        """Cannot mark cancelled reservation as attended."""
        reservation = Reservation.objects.create(
            gym_class=gym_class,
            member=member,
            status='cancelled'
        )
        
        result = reservation.mark_attended()
        
        assert result is False
        assert reservation.status == 'cancelled'
