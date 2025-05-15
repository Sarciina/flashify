from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Flashcard
from .serializers import FlashCardListSerializer, FlashCardDetailSerializer, FlashCardCreateSerializer

class FlashCardView(APIView):
    permission_classes = [IsAuthenticated]

    # List all flashcards or retrieve a specific one
    def get(self, request, pk=None):
        if pk is None:  # List all flashcards if no pk is provided
            flashcards = Flashcard.objects.filter(user=request.user)
            serializer = FlashCardListSerializer(flashcards, many=True)
            return Response(serializer.data)
        else:  # Retrieve a specific flashcard
            try:
                flashcard = Flashcard.objects.get(pk=pk, user=request.user)
            except Flashcard.DoesNotExist:
                return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = FlashCardDetailSerializer(flashcard)
            return Response(serializer.data)

    # Create a new flashcard
    def post(self, request):
        serializer = FlashCardCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update a specific flashcard
    def put(self, request, pk):
        try:
            flashcard = Flashcard.objects.get(pk=pk, user=request.user)
        except Flashcard.DoesNotExist:
            return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = FlashCardCreateSerializer(flashcard, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete a specific flashcard
    def delete(self, request, pk):
        try:
            flashcard = Flashcard.objects.get(pk=pk, user=request.user)
            flashcard.delete()
            return Response({"message": "Flashcard deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Flashcard.DoesNotExist:
            return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)