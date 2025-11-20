from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
<<<<<<< Updated upstream
from .views import (
    CompanyProfileDetailView, CompanyListView,
    CompanyPhotoUploadView, CompanyPhotoListView, CompanyPhotoDeleteView
)
urlpatterns = [
    path('api/', include(router.urls)),
    path('profile/', CompanyProfileDetailView.as_view(), name='company_profile'),
    path('all/', CompanyListView.as_view(), name='company_list'),

    # Photos
    path('photos/upload/', CompanyPhotoUploadView.as_view(), name='company_photo_upload'),
    path('photos/', CompanyPhotoListView.as_view(), name='company_photo_list'),
    path('photos/<int:pk>/delete/', CompanyPhotoDeleteView.as_view(), name='company_photo_delete'),
    
=======

urlpatterns = [
    path('api/', include(router.urls)),
>>>>>>> Stashed changes
]
