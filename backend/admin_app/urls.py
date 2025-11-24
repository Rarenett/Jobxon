from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import CandidateProfileViewSet
from admin_app.views import CandidateResumeHeadlineView


router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
path('resume-headline/', CandidateResumeHeadlineView.as_view(), name='resume-headline'),



urlpatterns = [
    path('api/', include(router.urls)),
]
=======
from .views import CompanyProfileViewSet

router = DefaultRouter()
router.register(r'companies', CompanyProfileViewSet, basename='company')

urlpatterns = [
    path('api/', include(router.urls)),
]
>>>>>>> main
