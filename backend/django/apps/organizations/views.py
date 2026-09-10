from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Organization
from .serializers import OrganizationSerializer


class UserOrganizationListView(generics.ListAPIView):
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Organization.objects.filter(
            users=self.request.user
        )