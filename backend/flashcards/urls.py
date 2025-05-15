from django.urls import path
from .views import FlashCardView  # Import the FlashCardView class

urlpatterns = [
    # Route for listing and creating flashcards
    path('', FlashCardView.as_view(), name='flashcard-list-create'),  # List or create flashcards

    # Route for retrieving, updating, or deleting a specific flashcard by its primary key (pk)
    path('<int:pk>/', FlashCardView.as_view(), name='flashcard-detail-update-delete'),  # Retrieve, update, or delete by pk
]