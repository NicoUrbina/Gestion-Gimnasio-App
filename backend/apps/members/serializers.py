"""
Serializers para Miembros
"""
from rest_framework import serializers
from .models import Member
from apps.users.serializers import UserSerializer


class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    subscription_status_display = serializers.CharField(
        source='get_subscription_status_display', read_only=True
    )
    is_active = serializers.BooleanField(read_only=True)
    days_inactive = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Member
        fields = [
            'id', 'user', 'user_id', 'date_of_birth', 'gender', 'phone',
            'address', 'emergency_contact_name', 'emergency_contact_phone',
            'medical_notes', 'subscription_status', 'subscription_status_display',
            'joined_date', 'last_access', 'is_active', 'days_inactive',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['joined_date', 'created_at', 'updated_at']


class MemberListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    subscription_status_display = serializers.CharField(
        source='get_subscription_status_display', read_only=True
    )
    
    class Meta:
        model = Member
        fields = [
            'id', 'full_name', 'email', 'phone', 'subscription_status',
            'subscription_status_display', 'joined_date', 'last_access'
        ]


class MemberCreateSerializer(serializers.ModelSerializer):
    # Datos del usuario
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Member
        fields = [
            'email', 'password', 'first_name', 'last_name',
            'date_of_birth', 'gender', 'phone', 'address',
            'emergency_contact_name', 'emergency_contact_phone', 'medical_notes'
        ]
    
    def validate_email(self, value):
        """Validar que el email no exista"""
        from apps.users.models import User
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe un usuario con este email.')
        return value
    
    def create(self, validated_data):
        from apps.users.models import User, Role
        from django.db import transaction
        
        # Extraer datos del usuario
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        
        with transaction.atomic():
            # Obtener o crear rol de miembro
            member_role, _ = Role.objects.get_or_create(
                name='member',
                defaults={'description': 'Miembro del gimnasio'}
            )
            
            # Crear usuario
            user = User.objects.create_user(
                email=email,
                username=email, # SimpleJWT y Django admin a veces requieren username
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=member_role
            )
            
            # Crear miembro
            member = Member.objects.create(user=user, **validated_data)
            return member
