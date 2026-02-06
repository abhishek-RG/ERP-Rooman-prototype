from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report, Activity

User = get_user_model()


class AdminProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserManagementSerializer(serializers.ModelSerializer):
    """
    Serializer for managing all users
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['timestamp']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['created_at']


class ReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True)
    
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['created_at']


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user info for activity responses"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['id']


class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for Activity model with enhanced validation
    """
    executive_details = UserMinimalSerializer(source='executive', read_only=True)
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = Activity
        fields = [
            'id',
            'executive',
            'executive_details',
            'activity_type',
            'activity_type_display',
            'activity_description',
            'activity_date',
            'start_time_hour',
            'start_time_minute',
            'duration_hour',
            'duration_minute',
            'priority',
            'priority_display',
            'person_to_contact',
            'phone_1',
            'phone_2',
            'venue',
            'status',
            'status_display',
            'feedback',
            'remarks',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_activity_description(self, value):
        """Validate activity description length"""
        if len(value) > 255:
            raise serializers.ValidationError("Activity description must not exceed 255 characters.")
        if not value.strip():
            raise serializers.ValidationError("Activity description cannot be empty.")
        return value
    
    def validate_feedback(self, value):
        """Validate feedback length"""
        if value and len(value) > 255:
            raise serializers.ValidationError("Feedback must not exceed 255 characters.")
        return value
    
    def validate_remarks(self, value):
        """Validate remarks length"""
        if value and len(value) > 255:
            raise serializers.ValidationError("Remarks must not exceed 255 characters.")
        return value
    
    def validate_venue(self, value):
        """Validate venue length"""
        if value and len(value) > 255:
            raise serializers.ValidationError("Venue must not exceed 255 characters.")
        return value
    
    def validate(self, data):
        """Additional field validation"""
        # Validate time fields
        if data.get('start_time_hour') is not None:
            if not (0 <= data['start_time_hour'] <= 23):
                raise serializers.ValidationError(
                    {'start_time_hour': 'Hour must be between 0 and 23'}
                )
        
        if data.get('start_time_minute') is not None:
            if not (0 <= data['start_time_minute'] <= 59):
                raise serializers.ValidationError(
                    {'start_time_minute': 'Minute must be between 0 and 59'}
                )
        
        if data.get('duration_hour') is not None:
            if not (0 <= data['duration_hour'] <= 23):
                raise serializers.ValidationError(
                    {'duration_hour': 'Duration hour must be between 0 and 23'}
                )
        
        if data.get('duration_minute') is not None:
            if not (0 <= data['duration_minute'] <= 59):
                raise serializers.ValidationError(
                    {'duration_minute': 'Duration minute must be between 0 and 59'}
                )
        
        return data


class ActivityListSerializer(ActivitySerializer):
    """
    Simplified serializer for list view - excludes some fields for performance
    """
    class Meta(ActivitySerializer.Meta):
        fields = [
            'id',
            'executive',
            'executive_details',
            'activity_type',
            'activity_type_display',
            'activity_description',
            'activity_date',
            'priority',
            'priority_display',
            'status',
            'status_display',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
