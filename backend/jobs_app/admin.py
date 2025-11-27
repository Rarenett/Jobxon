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
        'id', 'title', 'company', 'category', 'job_type', 'work_mode', 'salary_range', 'city', 'country', 'created_at'
    ]
    search_fields = ['title', 'description', 'city', 'country', 'company__name', 'requirements', 'responsibilities']
    list_filter = ['created_at', 'category', 'job_type', 'work_mode', 'country', 'company']
    readonly_fields = ['created_at', 'updated_at', 'slug']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'category', 'job_type', 'company', 'work_mode', 'salary_range')
        }),
        ('Job Details', {
            'fields': ('experience', 'qualification', 'gender', 'description')
        }),
        ('Requirements & Responsibilities', {
            'fields': ('requirements', 'responsibilities', 'skills_required')
        }),
        ('Location', {
            'fields': ('country', 'city', 'location', 'complete_address', 'latitude', 'longitude')
        }),
        ('Contact & Company Info', {
            'fields': ('email', 'website', 'est_since')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'created_at', 'updated_at')
        }),
        ('Meta', {
            'fields': ('posted_by', 'slug')
        }),
    )
