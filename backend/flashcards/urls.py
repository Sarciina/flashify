from django.urls import path
from .views import FlashCardView  # Import the FlashCardView class

urlpatterns = [
    # Route for listing and creating flashcards
    path('', FlashCardView.as_view(), name='flashcard-list-create'),  # List or create flashcards

    # Route for retrieving or deleting a specific flashcard by its primary key (pk)
    path('<int:pk>/', FlashCardView.as_view(), name='flashcard-detail-delete'),  # Retrieve or delete by pk
]
