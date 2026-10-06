from django.db import models

class Opportunity(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"

    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.CASCADE,
        related_name="opportunities",
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.OPEN,
    )
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)