# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer, 
    ConversationDetailSerializer, 
    MessageSerializer
)

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get all conversations for the logged-in user, skipping broken ones"""
        user = self.request.user
        base_qs = Conversation.objects.filter(
            Q(participant_one=user) | Q(participant_two=user)
        )

        valid_ids = []
        for conv in base_qs:
            try:
                # Access both participants to ensure they exist
                _ = conv.participant_one
                _ = conv.participant_two
                valid_ids.append(conv.id)
            except User.DoesNotExist:
                # Skip conversations with deleted users
                continue

        return Conversation.objects.filter(id__in=valid_ids)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ConversationListSerializer
        return ConversationDetailSerializer
    
    @action(detail=False, methods=['post'])
    def start_conversation(self, request):
        """
        Start or get existing conversation with a candidate
        POST data: {'receiver_id': <user_id>}
        """
        receiver_id = request.data.get('receiver_id')
        
        if not receiver_id:
            return Response(
                {'error': 'receiver_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        receiver = get_object_or_404(User, id=receiver_id)
        
        conversation = Conversation.get_or_create_conversation(
            request.user, 
            receiver
        )
        
        serializer = ConversationDetailSerializer(
            conversation, 
            context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send a message in this conversation
        POST data: {'body': 'message text', 'attachment': <optional file>}
        """
        conversation = self.get_object()
        body = request.data.get('body')
        
        if not body:
            return Response(
                {'error': 'Message body is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determine receiver (the other participant)
        receiver = conversation.get_other_participant(request.user)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            receiver=receiver,
            body=body,
            attachment=request.data.get('attachment')
        )
        
        # Update conversation timestamp
        conversation.save()
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_messages_read(self, request, pk=None):
        """Mark all messages in conversation as read for current user"""
        conversation = self.get_object()
        Message.objects.filter(
            conversation=conversation,
            receiver=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({'status': 'messages marked as read'})
