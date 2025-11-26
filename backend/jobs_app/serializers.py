from rest_framework import serializers
from .models import JobCategory, JobType, Job

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'icon', 'slug', 'created_at']

class JobTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = ['id', 'name', 'slug', 'created_at']


        
class JobSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    job_type_name = serializers.CharField(source='job_type.name', read_only=True)
    posted_by_name = serializers.CharField(source='posted_by.username', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)  # NEW

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'category', 'category_name', 'job_type', 'job_type_name',
            'company', 'company_name',  # NEW
            'offered_salary', 'experience', 'qualification', 'gender', 'country', 'city',
            'location', 'latitude', 'longitude', 'email', 'website', 'est_since',
            'complete_address', 'description', 'start_date', 'end_date',
            'posted_by', 'posted_by_name', 'created_at', 'updated_at', 'slug'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'posted_by']

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["posted_by"] = request.user
        return super().create(validated_data)
