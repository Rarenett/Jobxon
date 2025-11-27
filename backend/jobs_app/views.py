from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action


from .models import Job, JobCategory, JobType
from .serializers import JobSerializer, EmployerJobSerializer, JobCategorySerializer, JobTypeSerializer
from companies_app.models import CompanyProfile


class JobCategoryViewSet(viewsets.ModelViewSet):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class JobTypeViewSet(viewsets.ModelViewSet):
    queryset = JobType.objects.all()
    serializer_class = JobTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# jobs_app/views.py

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('category', 'job_type', 'posted_by', 'company').all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            if self.request.user.is_authenticated and self.request.user.is_staff:
                return JobSerializer
            return EmployerJobSerializer
        return JobSerializer

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
    
    # NEW: Custom endpoint for employer's own jobs
    @action(detail=False, methods=['get'], url_path='my-jobs')
    def my_jobs(self, request):
        """Get jobs posted by the current logged-in employer"""
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        jobs = self.queryset.filter(posted_by=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def company_list(request):
    """Simple endpoint to get active companies for dropdown"""
    companies = CompanyProfile.objects.filter(is_active=True).values('id', 'name')
    return Response(list(companies))
