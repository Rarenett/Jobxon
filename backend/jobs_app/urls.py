from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobCategoryViewSet, JobTypeViewSet, JobViewSet, company_list

router = DefaultRouter()
router.register(r'categories', JobCategoryViewSet, basename='jobcategory')
router.register(r'job-type', JobTypeViewSet, basename='jobtype')
router.register(r'jobs', JobViewSet, basename='job')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/companies/', company_list, name='company-list'),  # NEW
]
