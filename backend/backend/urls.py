from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('user.urls')),   # User-related URLs
    path('api/flashcards/', include('flashcards.urls')),   # Flashcard-related URLs
]
