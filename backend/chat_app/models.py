# models.py
from django.db import models
from django.conf import settings
from django.db.models import Q

class Conversation(models.Model):
    """
    Represents a conversation thread between two users (employer and candidate)
    """
    participant_one = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='conversations_as_participant_one'
    )
    participant_two = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='conversations_as_participant_two'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        # Ensure unique conversation between two users
        constraints = [
            models.UniqueConstraint(
                fields=['participant_one', 'participant_two'],
                name='unique_conversation'
            )
        ]
    
    def __str__(self):
        return f"Conversation between {self.participant_one.email} and {self.participant_two.email}"
    
    @classmethod
    def get_or_create_conversation(cls, user1, user2):
        """
        Get existing conversation or create new one between two users
        Handles both user order scenarios
        """
        conversation = cls.objects.filter(
            Q(participant_one=user1, participant_two=user2) |
            Q(participant_one=user2, participant_two=user1)
        ).first()
        
        if not conversation:
            conversation = cls.objects.create(
                participant_one=user1,
                participant_two=user2
            )
        
        return conversation
    
    def get_other_participant(self, user):
        """Get the other user in this conversation"""
        if self.participant_one == user:
            return self.participant_two
        return self.participant_one
    
    def get_last_message(self):
        """Get the most recent message in this conversation"""
        return self.messages.first()
    
    def get_unread_count(self, user):
        """Get count of unread messages for a specific user"""
        return self.messages.filter(receiver=user, is_read=False).count()


class Message(models.Model):
    """
    Individual messages within a conversation
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional: For file attachments like resume, portfolio
    attachment = models.FileField(
        upload_to='chat_attachments/',
        null=True,
        blank=True
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.sender.email} to {self.receiver.email}"
    
    def mark_as_read(self):
        """Mark this message as read"""
        if not self.is_read:
            self.is_read = True
            self.save(update_fields=['is_read'])
