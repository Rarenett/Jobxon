# serializers.py
from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()
from django.core.exceptions import ObjectDoesNotExist


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    receiver_name = serializers.SerializerMethodField()
    receiver_email = serializers.CharField(source='receiver.email', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'sender_name', 
            'sender_email', 'receiver', 'receiver_name', 'receiver_email',
            'body', 'is_read', 'created_at', 'attachment'
        ]
        read_only_fields = ['sender', 'created_at']
    
    # serializers.py
    def get_sender_name(self, obj):
        # Try multiple fields in order
        if hasattr(obj.sender, 'full_name') and obj.sender.full_name:
            return obj.sender.full_name
        if hasattr(obj.sender, 'username') and obj.sender.username:
            return obj.sender.username
        return obj.sender.email

    
    def get_receiver_name(self, obj):
        # Try multiple fields in order of preference
        if hasattr(obj.receiver, 'full_name') and obj.receiver.full_name:
            return obj.receiver.full_name
        if hasattr(obj.receiver, 'get_full_name'):
            full_name = obj.receiver.get_full_name()
            if full_name and full_name.strip():
                return full_name
        if hasattr(obj.receiver, 'username') and obj.receiver.username:
            return obj.receiver.username
        if hasattr(obj.receiver, 'first_name') and obj.receiver.first_name:
            last_name = getattr(obj.receiver, 'last_name', '')
            return f"{obj.receiver.first_name} {last_name}".strip()
        return obj.receiver.email



class ConversationListSerializer(serializers.ModelSerializer):
    other_participant = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'other_participant', 'last_message', 
            'unread_count', 'created_at', 'updated_at'
        ]
    
    def get_other_participant(self, obj):
        request = self.context.get('request')
        try:
            other_user = obj.get_other_participant(request.user)
        except (User.DoesNotExist, ObjectDoesNotExist, AttributeError):
            return {
                'id': None,
                'name': 'Unknown User',
                'email': '',
                'user_type': None,
            }

        if hasattr(other_user, 'get_full_name'):
            name = other_user.get_full_name() or other_user.email
        elif getattr(other_user, 'username', None):
            name = other_user.username
        else:
            name = other_user.email

        return {
            'id': other_user.id,
            'name': name,
            'email': other_user.email,
            'user_type': getattr(other_user, 'user_type', None),
        }
    
    def get_last_message(self, obj):
        last_msg = obj.get_last_message()
        if last_msg:
            return {
                'body': last_msg.body,
                'created_at': last_msg.created_at,
                'is_read': last_msg.is_read,
                'sender_id': last_msg.sender.id if last_msg.sender_id else None,
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        try:
            return obj.get_unread_count(request.user)
        except (User.DoesNotExist, ObjectDoesNotExist):
            return 0

class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    other_participant = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'other_participant', 'messages', 'created_at', 'updated_at']
    
    def get_other_participant(self, obj):
        request = self.context.get('request')
        try:
            other_user = obj.get_other_participant(request.user)
        except (User.DoesNotExist, ObjectDoesNotExist, AttributeError):
            return {
                'id': None,
                'name': 'Unknown User',
                'email': '',
                'user_type': None,
            }

        if hasattr(other_user, 'get_full_name'):
            name = other_user.get_full_name() or other_user.email
        elif getattr(other_user, 'username', None):
            name = other_user.username
        else:
            name = other_user.email

        return {
            'id': other_user.id,
            'name': name,
            'email': other_user.email,
            'user_type': getattr(other_user, 'user_type', None),
        }
