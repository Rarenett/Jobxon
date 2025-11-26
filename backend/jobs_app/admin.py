from django.contrib import admin
from .models import Job, JobCategory, JobType

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    list_filter = ['created_at']
    readonly_fields = ['created_at']

@admin.register(JobType)
class JobTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "created_at")
    search_fields = ("name",)
    readonly_fields = ['created_at']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'title', 'company', 'category', 'job_type', 'offered_salary', 'city', 'country', 'created_at'
    ]
    search_fields = ['title', 'description', 'city', 'country', 'company__name']
    list_filter = ['created_at', 'category', 'job_type', 'country', 'company']
    readonly_fields = ['created_at', 'updated_at', 'slug']
