"""Admin para Notificaciones"""
from django.contrib import admin
from .models import NotificationTemplate, Notification, EmailLog, WhatsAppLog, NotificationPreference

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'template_type', 'is_email', 'is_whatsapp', 'is_active']
    list_filter = ['template_type', 'is_active']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['recipient_email', 'subject', 'status', 'sent_at']
    list_filter = ['status', 'created_at']

@admin.register(WhatsAppLog)
class WhatsAppLogAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'status', 'sent_at']
    list_filter = ['status']

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'email_enabled', 'whatsapp_enabled']
