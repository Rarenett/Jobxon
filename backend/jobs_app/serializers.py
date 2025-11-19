from rest_framework import serializers
from .models import JobCategory


class JobCategorySerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'icon', 'slug', 'created_at', 'job_count']
        read_only_fields = ['slug', 'created_at']
    
    def get_job_count(self, obj):
        # You can update this later to count actual jobs
        return 0