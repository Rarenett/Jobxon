from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobCategoryViewSet,JobTypeViewSet
from . import views 
# Create a router and register the viewset
router = DefaultRouter()
router.register(r'categories', JobCategoryViewSet, basename='jobcategory')
router.register(r'job-type', JobTypeViewSet,basename='jobtype')

urlpatterns = [
    path('api/', include(router.urls)),
    path("api/job-type/", views.add_jobtype, name="add_jobtype"),
]