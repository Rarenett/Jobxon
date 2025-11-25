from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import JobCategory, JobType, Job
from .serializers import JobCategorySerializer, JobTypeSerializer, JobSerializer
from rest_framework.permissions import AllowAny


class JobCategoryViewSet(viewsets.ModelViewSet):
    queryset = JobCategory.objects.all().order_by('name')
    serializer_class = JobCategorySerializer
    permission_classes = [AllowAny]

class JobTypeViewSet(viewsets.ModelViewSet):
    queryset = JobType.objects.all().order_by('name')
    serializer_class = JobTypeSerializer
    permission_classes = [AllowAny]

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('category', 'job_type', 'posted_by').all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
