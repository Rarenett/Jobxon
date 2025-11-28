# serializers.py
from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()

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
    
    def get_sender_name(self, obj):
        return self._get_user_display_name(obj.sender)
    
    def get_receiver_name(self, obj):
        return self._get_user_display_name(obj.receiver)
    
    def _get_user_display_name(self, user):
        """Get display name from related profile models"""
        if not user:
            return 'Unknown User'
        
        user_type = getattr(user, 'user_type', None)
        
        # For Candidate - fetch from Candidate model
        if user_type == 'candidate':
            try:
                # Try to get candidate profile (adjust related_name as needed)
                if hasattr(user, 'candidate_profile'):
                    candidate = user.candidate_profile
                    # Check for full_name field
                    if hasattr(candidate, 'full_name') and candidate.full_name:
                        return candidate.full_name
                    # Check for first_name and last_name
                    if hasattr(candidate, 'first_name') and candidate.first_name:
                        last_name = getattr(candidate, 'last_name', '')
                        return f"{candidate.first_name} {last_name}".strip()
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        # For Employer - fetch from Company/Employer model
        elif user_type == 'employer':
            try:
                # Try to get employer profile (adjust related_name as needed)
                if hasattr(user, 'employer_profile'):
                    employer = user.employer_profile
                    # Check for company_name
                    if hasattr(employer, 'company_name') and employer.company_name:
                        return employer.company_name
                    # Check for name field
                    if hasattr(employer, 'name') and employer.name:
                        return employer.name
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        # Fallback to username or email
        if hasattr(user, 'username') and user.username and user.username != user.email:
            return user.username
        return user.email


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
    
    def _get_user_display_name(self, user):
        """Get display name from related profile models"""
        if not user:
            return 'Unknown User'
        
        user_type = getattr(user, 'user_type', None)
        
        # For Candidate - fetch from Candidate model
        if user_type == 'candidate':
            try:
                if hasattr(user, 'candidate_profile'):
                    candidate = user.candidate_profile
                    if hasattr(candidate, 'full_name') and candidate.full_name:
                        return candidate.full_name
                    if hasattr(candidate, 'first_name') and candidate.first_name:
                        last_name = getattr(candidate, 'last_name', '')
                        return f"{candidate.first_name} {last_name}".strip()
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        # For Employer - fetch from Company/Employer model
        elif user_type == 'employer':
            try:
                if hasattr(user, 'employer_profile'):
                    employer = user.employer_profile
                    if hasattr(employer, 'company_name') and employer.company_name:
                        return employer.company_name
                    if hasattr(employer, 'name') and employer.name:
                        return employer.name
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        # Fallback to username or email
        if hasattr(user, 'username') and user.username and user.username != user.email:
            return user.username
        return user.email
    
    def _get_profile_image(self, user):
        """Get profile image URL"""
        if not user:
            return None
        
        user_type = getattr(user, 'user_type', None)
        
        if user_type == 'candidate':
            try:
                if hasattr(user, 'candidate_profile'):
                    candidate = user.candidate_profile
                    if hasattr(candidate, 'profile_image') and candidate.profile_image:
                        return candidate.profile_image.url
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        return None
    
    def _get_logo(self, user):
        """Get company logo URL"""
        if not user:
            return None
        
        user_type = getattr(user, 'user_type', None)
        
        if user_type == 'employer':
            try:
                if hasattr(user, 'employer_profile'):
                    employer = user.employer_profile
                    if hasattr(employer, 'logo') and employer.logo:
                        return employer.logo.url
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        return None
    
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
                'profile_image': None,
                'logo': None,
            }

        return {
            'id': other_user.id,
            'name': self._get_user_display_name(other_user),
            'email': other_user.email,
            'user_type': getattr(other_user, 'user_type', None),
            'profile_image': self._get_profile_image(other_user),
            'logo': self._get_logo(other_user),
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
    
    def _get_user_display_name(self, user):
        """Get display name from related profile models"""
        if not user:
            return 'Unknown User'
        
        user_type = getattr(user, 'user_type', None)
        
        if user_type == 'candidate':
            try:
                if hasattr(user, 'candidate_profile'):
                    candidate = user.candidate_profile
                    if hasattr(candidate, 'full_name') and candidate.full_name:
                        return candidate.full_name
                    if hasattr(candidate, 'first_name') and candidate.first_name:
                        last_name = getattr(candidate, 'last_name', '')
                        return f"{candidate.first_name} {last_name}".strip()
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        elif user_type == 'employer':
            try:
                if hasattr(user, 'employer_profile'):
                    employer = user.employer_profile
                    if hasattr(employer, 'company_name') and employer.company_name:
                        return employer.company_name
                    if hasattr(employer, 'name') and employer.name:
                        return employer.name
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        if hasattr(user, 'username') and user.username and user.username != user.email:
            return user.username
        return user.email
    
    def _get_profile_image(self, user):
        """Get profile image URL"""
        if not user:
            return None
        
        user_type = getattr(user, 'user_type', None)
        
        if user_type == 'candidate':
            try:
                if hasattr(user, 'candidate_profile'):
                    candidate = user.candidate_profile
                    if hasattr(candidate, 'profile_image') and candidate.profile_image:
                        return candidate.profile_image.url
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        return None
    
    def _get_logo(self, user):
        """Get company logo URL"""
        if not user:
            return None
        
        user_type = getattr(user, 'user_type', None)
        
        if user_type == 'employer':
            try:
                if hasattr(user, 'employer_profile'):
                    employer = user.employer_profile
                    if hasattr(employer, 'logo') and employer.logo:
                        return employer.logo.url
            except (ObjectDoesNotExist, AttributeError):
                pass
        
        return None
    
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
                'profile_image': None,
                'logo': None,
            }

        return {
            'id': other_user.id,
            'name': self._get_user_display_name(other_user),
            'email': other_user.email,
            'user_type': getattr(other_user, 'user_type', None),
            'profile_image': self._get_profile_image(other_user),
            'logo': self._get_logo(other_user),
        }
