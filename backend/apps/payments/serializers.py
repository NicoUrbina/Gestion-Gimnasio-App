"""
Serializers para Pagos
"""
from rest_framework import serializers
from .models import Payment, Invoice


class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'member', 'member_name', 'membership', 'amount',
            'payment_method', 'payment_method_display', 'status', 'status_display',
            'reference_number', 'description', 'notes', 'payment_date',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'member', 'membership', 'amount', 'payment_method',
            'reference_number', 'description', 'notes'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['status'] = 'completed'
        return super().create(validated_data)


class InvoiceSerializer(serializers.ModelSerializer):
    payment_info = PaymentSerializer(source='payment', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'payment', 'payment_info', 'invoice_number',
            'issued_date', 'subtotal', 'tax', 'total', 'pdf_file', 'created_at'
        ]
        read_only_fields = ['invoice_number', 'created_at']
