from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobCategoryViewSet, JobTypeViewSet, JobViewSet

router = DefaultRouter()
router.register(r'categories', JobCategoryViewSet, basename='jobcategory')
router.register(r'job-type', JobTypeViewSet, basename='jobtype')
router.register(r'jobs', JobViewSet, basename='job')

urlpatterns = [
    path('', include(router.urls)),
    
]
