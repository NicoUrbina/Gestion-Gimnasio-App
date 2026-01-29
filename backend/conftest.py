"""
Pytest configuration and fixtures for gym management system tests.
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from apps.members.models import Member
from apps.memberships.models import MembershipPlan, Membership
from apps.staff.models import Staff
from apps.classes.models import ClassType, GymClass
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()


@pytest.fixture
def api_client():
    """Provide an unauthenticated API client."""
    return APIClient()


@pytest.fixture
def admin_user(db):
    """Create an admin user."""
    user = User.objects.create_user(
        email='admin@test.com',
        password='testpass123',
        first_name='Admin',
        last_name='User',
        role='admin',
        is_staff=True,
        is_superuser=True
    )
    return user


@pytest.fixture
def staff_user(db):
    """Create a staff user."""
    user = User.objects.create_user(
        email='staff@test.com',
        password='testpass123',
        first_name='Staff',
        last_name='User',
        role='staff',
        is_staff=True
    )
    return user


@pytest.fixture
def member_user(db):
    """Create a member user."""
    user = User.objects.create_user(
        email='member@test.com',
        password='testpass123',
        first_name='Member',
        last_name='User',
        role='member'
    )
    return user


@pytest.fixture
def member(member_user):
    """Create a member profile."""
    return Member.objects.create(
        user=member_user,
        phone='1234567890',
        gender='M',
        subscription_status='active'
    )


@pytest.fixture
def membership_plan(db):
    """Create a basic membership plan."""
    return MembershipPlan.objects.create(
        name='Plan Mensual',
        description='Plan mensual básico',
        price=50.00,
        duration_days=30,
        max_classes_per_month=20,
        includes_trainer=False,
        can_freeze=True,
        max_freeze_days=15
    )


@pytest.fixture
def active_membership(member, membership_plan):
    """Create an active membership."""
    return Membership.objects.create(
        member=member,
        plan=membership_plan,
        start_date=timezone.now().date(),
        end_date=timezone.now().date() + timedelta(days=30),
        status='active'
    )


@pytest.fixture
def authenticated_client(api_client, member_user):
    """Provide an authenticated API client with member user."""
    refresh = RefreshToken.for_user(member_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Provide an authenticated API client with admin user."""
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def staff_client(api_client, staff_user):
    """Provide an authenticated API client with staff user."""
    refresh = RefreshToken.for_user(staff_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def class_type(db):
    """Create a class type."""
    return ClassType.objects.create(
        name='Yoga',
        description='Clase de yoga',
        default_duration_minutes=60,
        default_capacity=20,
        color='#3B82F6'
    )


@pytest.fixture
def trainer(staff_user):
    """Create a trainer/staff profile."""
    return Staff.objects.create(
        user=staff_user,
        role='trainer',
        phone='9876543210',
        specialization='Yoga'
    )


@pytest.fixture
def gym_class(class_type, trainer):
    """Create a gym class."""
    return GymClass.objects.create(
        class_type=class_type,
        instructor=trainer,
        title='Yoga Matinal',
        description='Clase de yoga para principiantes',
        start_datetime=timezone.now() + timedelta(days=1),
        end_datetime=timezone.now() + timedelta(days=1, hours=1),
        capacity=5,
        location='Sala 1'
    )
