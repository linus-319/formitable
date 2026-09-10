from django.urls import path

from .views import (
    OpportunityListCreateView,
    OpportunityRetrieveUpdateView,
)

urlpatterns = [
    path(
        "",
        OpportunityListCreateView.as_view(),
        name="opportunity-list-create",
    ),
    path(
        "<int:pk>/",
        OpportunityRetrieveUpdateView.as_view(),
        name="opportunity-detail",
    ),
]