from django.urls import path

from .views import (
    OpportunityListCreateView,
    OpportunityRetrieveUpdateDestroyView,
)

urlpatterns = [
    path(
        "",
        OpportunityListCreateView.as_view(),
        name="opportunity-list-create",
    ),
    path(
        "<int:pk>/",
        OpportunityRetrieveUpdateDestroyView.as_view(),
        name="opportunity-detail",
    ),
]