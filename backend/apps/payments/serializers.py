"""
Serializers para Pagos
"""
from rest_framework import serializers
from .models import Payment, Invoice


class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    payment_type_display = serializers.CharField(source='get_payment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'payment_type', 'payment_type_display', 'member', 'member_name', 
            'membership', 'amount', 'payment_method', 'payment_method_display', 
            'status', 'status_display', 'reference_number', 'description', 'notes', 
            'payment_date', 'receipt_image', 'rejection_reason', 'approved_by', 
            'approved_at', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'approved_by', 'approved_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'payment_type', 'member', 'membership', 'amount', 'payment_method',
            'reference_number', 'description', 'notes', 'receipt_image'
        ]
    
    def validate(self, data):
        """Validar que membership sea requerido para pagos de membresía"""
        payment_type = data.get('payment_type', 'membership')
        membership = data.get('membership')
        
        if payment_type == 'membership' and not membership:
            raise serializers.ValidationError({
                'membership': 'Debe seleccionar una membresía para pagos de tipo membresía'
            })
        
        # Limpiar campos opcionales vacíos para evitar errores de validación
        optional_fields = ['reference_number', 'description', 'notes']
        for field in optional_fields:
            if field in data and data[field] == '':
                data[field] = ''  # Asegurar que sea string vacío, no None
        
        return data
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        # Si el usuario es staff, marca como completado automáticamente
        if self.context['request'].user.is_staff:
            validated_data['status'] = 'completed'
        else:
            # Si es miembro, marca como pendiente
            validated_data['status'] = 'pending'
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
