from django.db import models

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'Nuevo'),
        ('REVIEWED', 'Revisado'),
        ('CONTACTED', 'Contactado'),
        ('REJECTED', 'Rechazado'),
        ('HIRED', 'Contratado'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    position = models.CharField(max_length=100)
    experience_summary = models.TextField()
    portfolio_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.position}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Solicitud de Empleo"
        verbose_name_plural = "Solicitudes de Empleo"
