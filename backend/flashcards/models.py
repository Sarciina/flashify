# flashcards/models.py
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

class Flashcard(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='flashcards')
    question = models.CharField(max_length=255)
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Added field to track updates

    def __str__(self):
        return f"{self.question} - {self.user.username}"