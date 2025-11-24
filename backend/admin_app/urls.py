from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet
from admin_app.views import CandidateResumeHeadlineView


router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
path('resume-headline/', CandidateResumeHeadlineView.as_view(), name='resume-headline'),



urlpatterns = [
    path('api/', include(router.urls)),
]
