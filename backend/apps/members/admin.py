"""
Admin para Modelos de Miembros
"""

from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'subscription_status', 'joined_date', 'last_access']
    list_filter = ['subscription_status', 'gender', 'joined_date']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'phone']
    readonly_fields = ['joined_date', 'created_at', 'updated_at']
    date_hierarchy = 'joined_date'
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Información Personal', {
            'fields': ('date_of_birth', 'gender', 'phone', 'address')
        }),
        ('Contacto de Emergencia', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone'),
            'classes': ('collapse',)
        }),
        ('Información Médica', {
            'fields': ('medical_notes',),
            'classes': ('collapse',)
        }),
        ('Estado', {
            'fields': ('subscription_status', 'last_access')
        }),
        ('Fechas', {
            'fields': ('joined_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
