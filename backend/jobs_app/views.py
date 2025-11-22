from django.shortcuts import render
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import JobCategory,JobType
from .serializers import JobCategorySerializer,JobTypeSerializer
from django.http import HttpResponse
from django.utils.text import slugify


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

class JobTypeViewSet(viewsets.ModelViewSet):
    queryset = JobType.objects.all().order_by("id")
    serializer_class = JobTypeSerializer


def add_jobtype(request):
    if request.method == "POST":
        name = request.POST.get("name")

        if not name:
            return HttpResponse("Name required", status=400)

        JobType.objects.create(
            name=name,
            slug=slugify(name)
        )

        return HttpResponse("Job Type Added", status=201)

    return HttpResponse("Only POST allowed", status=405)