"""
Admin para Modelos de Progreso
"""

from django.contrib import admin
from .models import ProgressLog, Achievement


@admin.register(ProgressLog)
class ProgressLogAdmin(admin.ModelAdmin):
    list_display = ['member', 'date', 'weight', 'body_fat_percentage', 'bmi']
    list_filter = ['date']
    search_fields = ['member__user__email', 'member__user__first_name']
    date_hierarchy = 'date'
    
    def bmi(self, obj):
        return obj.bmi
    bmi.short_description = 'IMC'


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['member', 'title', 'achievement_type', 'achieved_date']
    list_filter = ['achievement_type', 'achieved_date']
    search_fields = ['member__user__email', 'title']
