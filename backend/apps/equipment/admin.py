"""Admin para Equipamiento"""
from django.contrib import admin
from .models import EquipmentCategory, Equipment, MaintenanceRecord, EquipmentReservation

@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'status', 'location', 'is_reservable']
    list_filter = ['category', 'status', 'is_reservable']
    search_fields = ['name', 'serial_number']

@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'maintenance_type', 'scheduled_date', 'status', 'cost']
    list_filter = ['maintenance_type', 'status']

@admin.register(EquipmentReservation)
class EquipmentReservationAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'member', 'start_time', 'end_time', 'status']
    list_filter = ['status']
