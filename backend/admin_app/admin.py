from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import PricingPlan
from django.utils.html import format_html

@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'frequency', 'recommended', 'features_summary')
    list_filter = ('recommended', 'frequency')
    search_fields = ('name',)

    def features_summary(self, obj):
        # Show features in a compact way in the list display
        if not obj.features:
            return "-"
        # Create a comma separated string of features, marking which are available
        features_str = ", ".join(
            f"{f['feature']} ({'✓' if f.get('available', False) else '✗'})" for f in obj.features
        )
        return format_html(features_str)

    features_summary.short_description = 'Features'

