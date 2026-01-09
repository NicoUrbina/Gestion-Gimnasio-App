"""
Admin para Modelos de Pagos
"""

from django.contrib import admin
from .models import Payment, Invoice


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'member', 'amount', 'payment_method', 'status', 'payment_date']
    list_filter = ['status', 'payment_method', 'payment_date']
    search_fields = ['member__user__email', 'reference_number']
    date_hierarchy = 'payment_date'
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'payment', 'total', 'issued_date']
    list_filter = ['issued_date']
    search_fields = ['invoice_number']
    readonly_fields = ['invoice_number', 'created_at']
