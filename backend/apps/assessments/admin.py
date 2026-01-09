"""Admin para Evaluaciones"""
from django.contrib import admin
from .models import FitnessAssessment, Goal, NutritionPlan

@admin.register(FitnessAssessment)
class FitnessAssessmentAdmin(admin.ModelAdmin):
    list_display = ['member', 'assessment_date', 'weight', 'body_fat_percentage', 'assessed_by']
    list_filter = ['assessment_date', 'assessed_by']
    search_fields = ['member__user__email']
    date_hierarchy = 'assessment_date'

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['member', 'title', 'goal_type', 'status', 'target_date']
    list_filter = ['goal_type', 'status']

@admin.register(NutritionPlan)
class NutritionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'member', 'daily_calories', 'is_active', 'start_date']
    list_filter = ['is_active']
