"""
Admin para Modelos de Membresías
"""

from django.contrib import admin
from .models import MembershipPlan, Membership, MembershipFreeze


@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration_days', 'is_active']
    list_filter = ['is_active', 'includes_trainer']
    search_fields = ['name']


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['member', 'plan', 'start_date', 'end_date', 'status', 'days_remaining']
    list_filter = ['status', 'plan', 'start_date']
    search_fields = ['member__user__email', 'member__user__first_name']
    date_hierarchy = 'start_date'
    
    def days_remaining(self, obj):
        return obj.days_remaining
    days_remaining.short_description = 'Días restantes'


@admin.register(MembershipFreeze)
class MembershipFreezeAdmin(admin.ModelAdmin):
    list_display = ['membership', 'start_date', 'end_date', 'reason']
    list_filter = ['start_date']
