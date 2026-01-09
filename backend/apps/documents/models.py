"""
Modelos de Documentos y Contratos
Sistema de Gestión de Gimnasio
"""

from django.db import models
from django.utils import timezone


class Contract(models.Model):
    """Contratos firmados por miembros"""
    
    STATUS_CHOICES = [
        ('active', 'Activo'),
        ('expired', 'Vencido'),
        ('cancelled', 'Cancelado'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='contracts',
        verbose_name='Miembro'
    )
    contract_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Número de contrato'
    )
    signed_date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha de firma'
    )
    start_date = models.DateField(
        verbose_name='Fecha de inicio'
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de fin'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Estado'
    )
    terms = models.TextField(
        blank=True,
        verbose_name='Términos y condiciones'
    )
    pdf_file = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Archivo PDF'
    )
    signed_by_member = models.BooleanField(
        default=False,
        verbose_name='Firmado por miembro'
    )
    signed_by_gym = models.BooleanField(
        default=False,
        verbose_name='Firmado por gimnasio'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'
        ordering = ['-signed_date']
    
    def __str__(self):
        return f"Contrato {self.contract_number} - {self.member}"


class Document(models.Model):
    """Documentos subidos por/para miembros"""
    
    DOCUMENT_TYPES = [
        ('id', 'Identificación'),
        ('medical', 'Certificado médico'),
        ('photo', 'Foto'),
        ('waiver', 'Exoneración'),
        ('other', 'Otro'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Miembro'
    )
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPES,
        default='other',
        verbose_name='Tipo de documento'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    file_path = models.CharField(
        max_length=255,
        verbose_name='Ruta del archivo'
    )
    file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Tamaño (bytes)'
    )
    mime_type = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Tipo MIME'
    )
    expiry_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de vencimiento'
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Verificado'
    )
    verified_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_documents',
        verbose_name='Verificado por'
    )
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Verificado el'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.name} - {self.member}"
    
    @property
    def is_expired(self):
        if self.expiry_date:
            return self.expiry_date < timezone.now().date()
        return False


class Waiver(models.Model):
    """Exoneraciones de responsabilidad"""
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='waivers',
        verbose_name='Miembro'
    )
    waiver_type = models.CharField(
        max_length=100,
        verbose_name='Tipo de exoneración'
    )
    content = models.TextField(
        verbose_name='Contenido'
    )
    signed_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='Fecha de firma'
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='Dirección IP'
    )
    signature_data = models.TextField(
        blank=True,
        verbose_name='Datos de firma',
        help_text='Firma digital base64'
    )
    is_accepted = models.BooleanField(
        default=True,
        verbose_name='Aceptado'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Exoneración'
        verbose_name_plural = 'Exoneraciones'
        ordering = ['-signed_date']
    
    def __str__(self):
        return f"{self.waiver_type} - {self.member}"


class Feedback(models.Model):
    """Feedback y encuestas de satisfacción"""
    
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]  # 1-5
    
    FEEDBACK_TYPES = [
        ('general', 'General'),
        ('class', 'Clase'),
        ('trainer', 'Entrenador'),
        ('facility', 'Instalaciones'),
        ('equipment', 'Equipamiento'),
        ('service', 'Servicio al cliente'),
    ]
    
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='feedbacks',
        verbose_name='Miembro'
    )
    feedback_type = models.CharField(
        max_length=20,
        choices=FEEDBACK_TYPES,
        default='general',
        verbose_name='Tipo de feedback'
    )
    related_class = models.ForeignKey(
        'classes.GymClass',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedbacks',
        verbose_name='Clase relacionada'
    )
    related_staff = models.ForeignKey(
        'staff.Staff',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedbacks',
        verbose_name='Personal relacionado'
    )
    rating = models.PositiveIntegerField(
        choices=RATING_CHOICES,
        verbose_name='Calificación'
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Título'
    )
    comment = models.TextField(
        blank=True,
        verbose_name='Comentario'
    )
    is_anonymous = models.BooleanField(
        default=False,
        verbose_name='Anónimo'
    )
    is_resolved = models.BooleanField(
        default=False,
        verbose_name='Resuelto'
    )
    response = models.TextField(
        blank=True,
        verbose_name='Respuesta del gimnasio'
    )
    responded_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Respondido por'
    )
    responded_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Respondido el'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedbacks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback: {self.get_feedback_type_display()} - {self.rating}/5"
