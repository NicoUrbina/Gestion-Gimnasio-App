"""
Serializers para Clases
"""
from rest_framework import serializers
from .models import ClassType, GymClass, Reservation, Routine, RoutineAssignment


class ClassTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassType
        fields = [
            'id', 'name', 'description', 'default_duration_minutes',
            'default_capacity', 'color', 'icon', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class GymClassSerializer(serializers.ModelSerializer):
    class_type_name = serializers.CharField(source='class_type.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.user.get_full_name', read_only=True)
    available_spots = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    confirmed_reservations_count = serializers.IntegerField(read_only=True)
    waitlist_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = GymClass
        fields = [
            'id', 'class_type', 'class_type_name', 'instructor', 'instructor_name',
            'title', 'description', 'start_datetime', 'end_datetime',
            'capacity', 'location', 'is_recurring', 'is_cancelled',
            'cancellation_reason', 'available_spots', 'is_full',
            'confirmed_reservations_count', 'waitlist_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class GymClassListSerializer(serializers.ModelSerializer):
    class_type_name = serializers.CharField(source='class_type.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.user.get_full_name', read_only=True)
    available_spots = serializers.IntegerField(read_only=True)
    color = serializers.CharField(source='class_type.color', read_only=True)
    
    class Meta:
        model = GymClass
        fields = [
            'id', 'title', 'class_type_name', 'instructor_name',
            'start_datetime', 'end_datetime', 'capacity', 'available_spots',
            'location', 'is_cancelled', 'color'
        ]


class ReservationCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para crear reservas (member es opcional)"""
    
    class Meta:
        model = Reservation
        fields = ['gym_class']  # Solo gym_class es requerido
    
    def create(self, validated_data):
        gym_class = validated_data['gym_class']
        
        # Verificar si la clase está llena
        if gym_class.is_full:
            # Agregar a lista de espera
            waitlist_count = gym_class.reservations.filter(status='waitlist').count()
            validated_data['status'] = 'waitlist'
            validated_data['waitlist_position'] = waitlist_count + 1
        else:
            validated_data['status'] = 'confirmed'
        
        return super().create(validated_data)


class ReservationSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    class_title = serializers.CharField(source='gym_class.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'gym_class', 'class_title', 'member', 'member_name',
            'status', 'status_display', 'waitlist_position',
            'reserved_at', 'cancelled_at', 'attended_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reserved_at', 'cancelled_at', 'attended_at', 'waitlist_position', 'created_at', 'updated_at']
        extra_kwargs = {
            'member': {'required': False, 'allow_null': True}
        }
    
    def validate(self, attrs):
        gym_class = attrs.get('gym_class')
        member = attrs.get('member')
        
        # Solo validar duplicados si member está presente
        # (cuando no está presente, se asigna en perform_create)
        if gym_class and member:
            existing_reservation = Reservation.objects.filter(
                gym_class=gym_class,
                member=member,
                status__in=['confirmed', 'waitlist']
            ).first()
            
            if existing_reservation:
                if existing_reservation.status == 'confirmed':
                    raise serializers.ValidationError({
                        'detail': 'Ya tienes una reserva confirmada para esta clase'
                    })
                elif existing_reservation.status == 'waitlist':
                    raise serializers.ValidationError({
                        'detail': 'Ya estás en la lista de espera para esta clase'
                    })
        
        return attrs
    
    def create(self, validated_data):
        gym_class = validated_data['gym_class']
        
        # Verificar si la clase está llena
        if gym_class.is_full:
            # Agregar a lista de espera
            waitlist_count = gym_class.reservations.filter(status='waitlist').count()
            validated_data['status'] = 'waitlist'
            validated_data['waitlist_position'] = waitlist_count + 1
        else:
            validated_data['status'] = 'confirmed'
        
        return super().create(validated_data)


class RoutineSerializer(serializers.ModelSerializer):
    trainer_name = serializers.CharField(source='trainer.user.get_full_name', read_only=True)
    difficulty_level_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)
    
    class Meta:
        model = Routine
        fields = [
            'id', 'trainer', 'trainer_name', 'name', 'description',
            'difficulty_level', 'difficulty_level_display',
            'duration_minutes', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class RoutineAssignmentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    routine_name = serializers.CharField(source='routine.name', read_only=True)
    
    class Meta:
        model = RoutineAssignment
        fields = [
            'id', 'member', 'member_name', 'routine', 'routine_name',
            'assigned_by', 'assigned_at', 'notes'
        ]
        read_only_fields = ['assigned_at']
