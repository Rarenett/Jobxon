from users_app.models import CandidateProfile
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import Job, JobApplication, JobCategory, JobType
from .serializers import JobApplicationSerializer, JobSerializer, EmployerJobSerializer, JobCategorySerializer, JobTypeSerializer
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


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.select_related('job', 'job__company', 'candidate').all().order_by('-applied_at')
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If candidate: see own applications
        if hasattr(user, 'candidate_profile'):
            return JobApplication.objects.select_related(
                'job', 'job__company', 'candidate'
            ).filter(candidate__user=user).order_by('-applied_at')
        # If employer: see applications to their jobs
        if user.is_staff or hasattr(user, 'company_profile'):
            return JobApplication.objects.select_related(
                'job', 'job__company', 'candidate'
            ).filter(job__posted_by=user).order_by('-applied_at')
        return JobApplication.objects.none()

    def get_serializer_context(self):
        """Pass request to serializer for building absolute URLs"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        user = request.user

        # Ensure user has a candidate profile
        try:
            candidate_profile = user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return Response(
                {"error": "You must create a candidate profile before applying for jobs."},
                status=status.HTTP_400_BAD_REQUEST
            )

        job_id = request.data.get('job')
        if not job_id:
            return Response(
                {"error": "Job ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check job exists
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response(
                {"error": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent duplicate applications
        if JobApplication.objects.filter(job=job, candidate=candidate_profile).exists():
            return Response(
                {"error": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create application
        cover_letter = request.data.get('cover_letter', '')
        resume = request.FILES.get('resume')

        application = JobApplication.objects.create(
            job=job,
            candidate=candidate_profile,
            candidate_id_value=candidate_profile.candidate_id,
            cover_letter=cover_letter,
            resume=resume
        )

        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
