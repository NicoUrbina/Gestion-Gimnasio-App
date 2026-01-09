"""
URLs para la aplicación Payments
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, InvoiceViewSet

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
]
