from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobApplicationViewSet, JobCategoryViewSet, JobTypeViewSet, JobViewSet, company_list

router = DefaultRouter()
router.register(r'categories', JobCategoryViewSet, basename='jobcategory')
router.register(r'job-type', JobTypeViewSet, basename='jobtype')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', JobApplicationViewSet, basename='job-application')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/companies/', company_list, name='company-list'),  # NEW
]
