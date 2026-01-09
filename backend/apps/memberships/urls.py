"""
URLs para la aplicación Memberships
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembershipPlanViewSet, MembershipViewSet, MembershipFreezeViewSet

router = DefaultRouter()
router.register(r'plans', MembershipPlanViewSet, basename='membership-plan')
router.register(r'freezes', MembershipFreezeViewSet, basename='membership-freeze')
router.register(r'', MembershipViewSet, basename='membership')

urlpatterns = [
    path('', include(router.urls)),
]
