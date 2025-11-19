from django.db import models
from django.utils.text import slugify


class JobCategory(models.Model):
    name = models.CharField(max_length=255)
    icon = models.CharField(max_length=100, blank=True, null=True, help_text="FontAwesome icon class (e.g., fa-solid fa-laptop)")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(JobCategory, self).save(*args, **kwargs)

    def _str_(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Job Categories"