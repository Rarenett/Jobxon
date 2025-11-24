from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet

router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')

urlpatterns = [
    path('api/', include(router.urls)),
]
