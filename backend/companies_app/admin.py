from django.contrib import admin

from django.utils.html import format_html
from .models import TopCompany


@admin.register(TopCompany)
class TopCompanyAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'logo_preview',
        'is_featured',
        'display_order',
        'created_at',
        'website_link'
    ]
    
    list_display_links = ['id', 'name']
    
    list_filter = [
        'is_featured',
        'created_at',
    ]
    
    search_fields = [
        'name',
        'website_url',
    ]
    
    list_editable = [
        'is_featured',
        'display_order',
    ]
    
    ordering = ['display_order', '-created_at']
    
    readonly_fields = [
        'id',
        'created_at',
        'logo_preview_large'
    ]
    
    fieldsets = (
        ('Company Information', {
            'fields': (
                'id',
                'name',
                'website_url',
            )
        }),
        ('Logo', {
            'fields': (
                'logo',
                'logo_preview_large',
            )
        }),
        ('Display Settings', {
            'fields': (
                'is_featured',
                'display_order',
            ),
            'description': 'Control how and where this company appears on the site'
        }),
        ('Metadata', {
            'fields': (
                'created_at',
            ),
            'classes': ('collapse',)
        }),
    )
    
    # Custom method to show logo thumbnail in list view
    def logo_preview(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;" />',
                obj.logo.url
            )
        return format_html('<span style="color: #999;">No logo</span>')
    logo_preview.short_description = 'Logo'
    
    # Custom method to show larger logo preview in detail view
    def logo_preview_large(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 200px; object-fit: contain; border: 1px solid #ddd; padding: 10px; border-radius: 8px;" />',
                obj.logo.url
            )
        return format_html('<span style="color: #999;">No logo uploaded</span>')
    logo_preview_large.short_description = 'Logo Preview'
    
    # Custom method to show clickable website link
    def website_link(self, obj):
        if obj.website_url:
            return format_html(
                '<a href="{}" target="_blank" style="color: #1967d2;">Visit Site</a>',
                obj.website_url
            )
        return format_html('<span style="color: #999;">-</span>')
    website_link.short_description = 'Website'
    
    # Customize the add/change form
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
        js = ('admin/js/custom_admin.js',)
    
    # Action to feature multiple companies at once
    actions = ['make_featured', 'remove_featured']
    
    def make_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(
            request,
            f'{updated} company(ies) marked as featured.'
        )
    make_featured.short_description = 'Mark selected companies as featured'
    
    def remove_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(
            request,
            f'{updated} company(ies) removed from featured.'
        )
    remove_featured.short_description = 'Remove selected companies from featured'
