from django.shortcuts import render
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import JobCategory,JobType
from .serializers import JobCategorySerializer,JobTypeSerializer
from django.http import HttpResponse
from django.utils.text import slugify
from django.shortcuts import get_object_or_404

class JobCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing JobCategory instances.
    Provides CRUD operations: list, create, retrieve, update, delete
    """
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        """
        Optionally filter categories by active status
        """
        queryset = JobCategory.objects.all().order_by('name')
        return queryset
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """
        Custom endpoint to get categories with most jobs
        URL: /api/categories/popular/
        """
        categories = self.get_queryset()[:10]  # Top 10 categories
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

def home(request):
    return render(request,'home.html')

def index(request):
    return render(request,'home.html')

def register(request):
    return render(request,'register.html')


from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.text import slugify
from .models import JobType
from .serializers import JobTypeSerializer


class JobTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing JobType instances.
    Provides CRUD operations: list, create, retrieve, update, delete
    """
    queryset = JobType.objects.all()
    serializer_class = JobTypeSerializer
    lookup_field = 'pk'
    
    def get_queryset(self):
        """
        Order job types by name
        """
        queryset = JobType.objects.all().order_by('name')
        return queryset
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """
        Custom endpoint to get popular job types
        URL: /api/job-type/popular/
        """
        job_types = self.get_queryset()[:10]
        serializer = self.get_serializer(job_types, many=True)
        return Response(serializer.data)


# Remove these custom functions - not needed anymore:
# def add_jobtype(request):
# def edit_jobtype(request, pk):
# def delete_jobtype(request, pk):