from django.contrib import admin
from .models import JobApplication

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'position', 'status', 'created_at')
    list_filter = ('status', 'position', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'position')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
