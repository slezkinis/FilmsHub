from django.db import models

from users.models import User


class AiRecHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True
    )
    response = models.TextField()
    request = models.TextField()
    total_tokens = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record {self.id} by {self.user}"
