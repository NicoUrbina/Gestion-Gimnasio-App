"""
Serializers para Membresías
"""
from rest_framework import serializers
from .models import MembershipPlan, Membership, MembershipFreeze


class MembershipPlanSerializer(serializers.ModelSerializer):
    # Make description optional explicitly
    description = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = MembershipPlan
        fields = [
            'id', 'name', 'description', 'price', 'duration_days',
            'max_classes_per_month', 'includes_trainer', 'can_freeze',
            'max_freeze_days', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']



class MembershipSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_expiring_soon = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Membership
        fields = [
            'id', 'member', 'member_name', 'plan', 'plan_name',
            'start_date', 'end_date', 'status', 'status_display',
            'frozen_at', 'frozen_days_used', 'notes',
            'days_remaining', 'is_expiring_soon',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['frozen_at', 'frozen_days_used', 'created_at', 'updated_at']


class MembershipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ['member', 'plan', 'start_date', 'notes']
    
    def create(self, validated_data):
        from datetime import timedelta
        
        plan = validated_data['plan']
        start_date = validated_data['start_date']
        end_date = start_date + timedelta(days=plan.duration_days)
        
        membership = Membership.objects.create(
            end_date=end_date,
            **validated_data
        )
        
        # Actualizar estado del miembro
        member = membership.member
        member.subscription_status = 'active'
        member.save()
        
        return membership


class MembershipFreezeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipFreeze
        fields = ['id', 'membership', 'start_date', 'end_date', 'reason', 'created_at']
        read_only_fields = ['created_at']
