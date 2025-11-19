from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobCategoryViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'categories', JobCategoryViewSet, basename='jobcategory')

urlpatterns = [
    path('api/', include(router.urls)),
]