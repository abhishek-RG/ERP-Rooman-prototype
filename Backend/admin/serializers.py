from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report, Enquiry

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


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = [
            'id',
            'name',
            'center',
            'enquiry_type',
            'gender',
            'computer_knowledge',
            'qualification',
            'status',
            'organisation_name',
            'designation',
            'total_work_experience',
            'mobile_number',
            'email',
            'country',
            'state',
            'city',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_mobile_number(self, value):
        """
        Validate mobile number: must be exactly 10 digits and numbers only
        """
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Please enter a valid 10-digit mobile number")
        return value

    def validate_email(self, value):
        """
        Validate email: ensures standard email format and custom error message
        """
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Please enter a valid email address")
        return value

