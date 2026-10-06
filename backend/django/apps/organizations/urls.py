from django.urls import path

from .views import UserOrganizationListView

urlpatterns = [
    path(
        "",
        UserOrganizationListView.as_view(),
        name="organization-list",
    ),
]