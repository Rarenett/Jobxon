from requests import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from users_app.models import CandidateProfile
from admin_app.serializer import CandidateProfileListSerializer

class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all().order_by('-id')
    serializer_class = CandidateProfileListSerializer
    permission_classes = [IsAuthenticated]


    from rest_framework.response import Response
from rest_framework import status

def destroy(self, request, *args, **kwargs):
    instance = self.get_object()
    instance.delete()
    return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)
