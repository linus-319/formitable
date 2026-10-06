from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Opportunity
from .serializers import OpportunitySerializer


class OpportunityListCreateView(generics.ListCreateAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Opportunity.objects.filter(
            organization_id=self.kwargs["organization_id"],
            organization__users=self.request.user,
        )

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.kwargs["organization_id"]
        )


class OpportunityRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Opportunity.objects.filter(
            organization_id=self.kwargs["organization_id"],
            organization__users=self.request.user,
        )
