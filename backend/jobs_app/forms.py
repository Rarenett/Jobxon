from django import forms
from .models import JobCategory


class JobCategoryAdminForm(forms.ModelForm):
    icon = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': 'fa-solid fa-laptop',
            'class': 'vTextField'
        }),
        help_text='FontAwesome icon class (e.g., fa-solid fa-laptop)'
    )
    
    class Meta:
        model = JobCategory
        fields = ['name', 'icon']
    
    def clean_name(self):
        """Custom validation for name field"""
        name = self.cleaned_data.get('name')
        if JobCategory.objects.filter(name__iexact=name).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError('A category with this name already exists.')
        return name
    
    def clean_icon(self):
        """Validate icon format"""
        icon = self.cleaned_data.get('icon')
        if icon and not icon.startswith('fa-'):
            raise forms.ValidationError('Icon must be a valid FontAwesome class starting with "fa-"')
        return icon
