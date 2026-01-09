"""Admin para Documentos"""
from django.contrib import admin
from .models import Contract, Document, Waiver, Feedback

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'member', 'status', 'signed_date', 'end_date']
    list_filter = ['status']
    search_fields = ['contract_number', 'member__user__email']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['name', 'member', 'document_type', 'is_verified', 'uploaded_at']
    list_filter = ['document_type', 'is_verified']

@admin.register(Waiver)
class WaiverAdmin(admin.ModelAdmin):
    list_display = ['waiver_type', 'member', 'signed_date', 'is_accepted']
    list_filter = ['waiver_type']

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['feedback_type', 'member', 'rating', 'is_resolved', 'created_at']
    list_filter = ['feedback_type', 'rating', 'is_resolved']
