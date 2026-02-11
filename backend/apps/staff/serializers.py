"""
Serializers para Staff y Trainers
"""
from rest_framework import serializers
from .models import Staff, Schedule
from apps.users.serializers import UserSerializer


class ScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = Schedule
        fields = [
            'id', 'staff', 'day_of_week', 'day_of_week_display',
            'start_time', 'end_time', 'is_available'
        ]


class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    staff_type_display = serializers.CharField(source='get_staff_type_display', read_only=True)
    schedules = ScheduleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Staff
        fields = [
            'id', 'user', 'user_id', 'staff_type', 'staff_type_display',
            'specializations', 'bio', 'certifications', 'hire_date',
            'hourly_rate', 'is_instructor', 'is_active', 'schedules',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class StaffListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    staff_type_display = serializers.CharField(source='get_staff_type_display', read_only=True)
    
    class Meta:
        model = Staff
        fields = ['id', 'full_name', 'staff_type', 'staff_type_display', 'specializations', 'is_instructor', 'is_active']


class TrainerListSerializer(serializers.ModelSerializer):
    """Serializer para listado de entrenadores"""
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    
    class Meta:
        model = Staff
        fields = [
            'id', 'full_name', 'first_name', 'last_name', 'email', 'phone',
            'bio', 'certifications', 'hire_date', 'hourly_rate', 'is_active'
        ]


class TrainerSerializer(serializers.ModelSerializer):
    """Serializer completo para entrenadores"""
    # Campos del usuario relacionado
    email = serializers.CharField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    phone = serializers.CharField(source='user.phone', required=False, allow_blank=True)
    
    # Campos específicos de staff
    certifications_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Staff
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'phone',
            'bio', 'certifications', 'certifications_display',
            'hire_date', 'hourly_rate', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_certifications_display(self, obj):
        """Formatear certificaciones para display"""
        if not obj.certifications:
            return []
        return obj.certifications
    
    def create(self, validated_data):
        """Crear entrenador con usuario asociado"""
        from apps.users.models import User, Role
        
        # Extraer datos del usuario (pueden venir anidados o en el nivel raíz)
        if 'user' in validated_data:
            # Formato anidado
            user_data = validated_data.pop('user')
            email = user_data.get('email')
            first_name = user_data.get('first_name')
            last_name = user_data.get('last_name')
            phone = user_data.get('phone', '')
        else:
            # Formato plano (del frontend)
            email = validated_data.pop('email', None)
            first_name = validated_data.pop('first_name', None)
            last_name = validated_data.pop('last_name', None)
            phone = validated_data.pop('phone', '')
        
        if not email or not first_name or not last_name:
            raise serializers.ValidationError({
                'detail': 'email, first_name y last_name son requeridos'
            })
        
        # Obtener rol de trainer
        try:
            trainer_role = Role.objects.get(name='trainer')
        except Role.DoesNotExist:
            raise serializers.ValidationError("Rol 'trainer' no encontrado")
        
        # Crear usuario
        username = email.split('@')[0]  # Auto-generar username del email
        user = User.objects.create_user(
            username=username,
            email=email,
            password='temp123456',  # Contraseña temporal
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role=trainer_role
        )
        
        print(f"=== CREAR TRAINER DEBUG ===")
        print(f"Email: {email}")
        print(f"User.is_active: {user.is_active}")
        print(f"validated_data.keys(): {validated_data.keys()}")
        print(f"is_active en validated_data: {'is_active' in validated_data}")
        if 'is_active' in validated_data:
            print(f"is_active value: {validated_data['is_active']}")
        
        # Crear perfil de staff
        staff = Staff.objects.create(
            user=user,
            staff_type='trainer',
            **validated_data
        )
        
        print(f"Staff.is_active: {staff.is_active}")
        print(f"===========================")
        
        return staff
    
    def update(self, instance, validated_data):
        """Actualizar entrenador y usuario asociado"""
        # Extraer datos del usuario si están presentes
        user_data = validated_data.pop('user', {})
        
        # Actualizar usuario si hay datos
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # CRÍTICO: Sincronizar is_active entre Staff y User
        if 'is_active' in validated_data:
            is_active_value = validated_data['is_active']
            instance.user.is_active = is_active_value
            instance.user.save(update_fields=['is_active'])
        
        # Actualizar staff
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
