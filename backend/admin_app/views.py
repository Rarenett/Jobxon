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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status



class CandidateResumeHeadlineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            return Response({
                "headline": profile.resume_headline
            })
        except CandidateProfile.DoesNotExist:
            return Response({"headline": ""}, status=200)

    def put(self, request):
        headline = request.data.get("headline")

        if not headline:
            return Response({"error": "Headline is required"}, status=400)

        profile, created = CandidateProfile.objects.get_or_create(user=request.user)
        profile.resume_headline = headline
        profile.save()

        return Response({"message": "Headline updated successfully"}, status=status.HTTP_200_OK)

