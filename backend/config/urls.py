"""
URL configuration for config project.
Sistema de Gestión de Gimnasio - API Routes
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/', include('apps.users.urls')),
    path('api/members/', include('apps.members.urls')),
    path('api/memberships/', include('apps.memberships.urls')),
    path('api/staff/', include('apps.staff.urls')),
    path('api/classes/', include('apps.classes.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/progress/', include('apps.progress.urls')),
    path('api/access/', include('apps.access.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/', include('apps.assessments.urls')),  # Evaluaciones y metas
    path('api/', include('apps.workouts.urls')),  # Rutinas y ejercicios
]
