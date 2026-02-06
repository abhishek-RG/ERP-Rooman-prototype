from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report, Activity, Enquiry

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
    Serializer for managing all users (creation and listing)
    Supports role-specific profile creation
    """
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    
    # Student-specific fields (optional, only used when role='student')
    student_id = serializers.CharField(write_only=True, required=False)
    center = serializers.CharField(write_only=True, required=False)
    enrollment_date = serializers.DateField(write_only=True, required=False)
    course = serializers.CharField(write_only=True, required=False)
    guardian_name = serializers.CharField(write_only=True, required=False)
    guardian_contact = serializers.CharField(write_only=True, required=False)
    emergency_contact = serializers.CharField(write_only=True, required=False)
    
    # Employee-specific fields (optional, only used when role='employee')
    employee_id = serializers.CharField(write_only=True, required=False)
    designation = serializers.CharField(write_only=True, required=False)
    department = serializers.CharField(write_only=True, required=False)
    join_date = serializers.DateField(write_only=True, required=False)
    salary = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    employment_type = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone_number', 'password', 'is_active', 'date_joined',
                  'student_id', 'center', 'enrollment_date', 'course', 'guardian_name',
                  'guardian_contact', 'emergency_contact', 'employee_id', 'designation',
                  'department', 'join_date', 'salary', 'employment_type']
        read_only_fields = ['id', 'date_joined']
    
    def create(self, validated_data):
        """Create user with password and optional profile"""
        from datetime import date
        
        password = validated_data.pop('password', None)
        role = validated_data.get('role')
        
        # Extract all role-specific fields upfront
        student_id = validated_data.pop('student_id', None)
        center = validated_data.pop('center', None)
        enrollment_date = validated_data.pop('enrollment_date', None)
        course_code = validated_data.pop('course', None)
        guardian_name = validated_data.pop('guardian_name', None)
        guardian_contact = validated_data.pop('guardian_contact', None)
        emergency_contact_student = validated_data.pop('emergency_contact', None)
        
        employee_id = validated_data.pop('employee_id', None)
        designation = validated_data.pop('designation', None)
        department = validated_data.pop('department', None)
        join_date = validated_data.pop('join_date', None)
        salary = validated_data.pop('salary', None)
        employment_type = validated_data.pop('employment_type', None)
        
        # Create user first
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        
        # Create student profile if role is student
        if role == 'student':
            try:
                from student.models import Student, Course, Enrollment
                
                if not student_id:
                    import uuid
                    student_id = f"STU-{uuid.uuid4().hex[:8].upper()}"
                
                student = Student.objects.create(
                    user=user,
                    student_id=student_id,
                    center=center or 'Rooman Online (RON)',
                    enrollment_date=enrollment_date or date.today(),
                    department='Unassigned',
                    semester=1,
                    guardian_name=guardian_name or 'Not Provided',
                    guardian_contact=guardian_contact or '0000000000',
                    emergency_contact=emergency_contact_student or '0000000000',
                )
                
                # Create enrollment if course is provided
                if course_code:
                    try:
                        course = Course.objects.get(course_code=course_code)
                        Enrollment.objects.create(student=student, course=course)
                    except Course.DoesNotExist:
                        pass
                        
            except Exception as e:
                user.delete()
                raise serializers.ValidationError(f"Failed to create student profile: {str(e)}")
        
        # Create employee profile if role is employee
        if role == 'employee':
            try:
                from employee.models import Employee
                
                if not employee_id:
                    import uuid
                    employee_id = f"EMP-{uuid.uuid4().hex[:8].upper()}"
                
                Employee.objects.create(
                    user=user,
                    employee_id=employee_id,
                    designation=designation or 'Employee',
                    department=department or 'General',
                    join_date=join_date or date.today(),
                    salary=salary or '50000.00',
                    employment_type=employment_type or 'full-time',
                    emergency_contact=emergency_contact_student or '0000000000',
                )
            except Exception as e:
                user.delete()
                raise serializers.ValidationError(f"Failed to create employee profile: {str(e)}")
        
        return user
    
    def update(self, instance, validated_data):
        """Update user (password handled separately if provided)"""
        password = validated_data.pop('password', None)
        
        # Remove write-only fields
        for field in ['student_id', 'center', 'enrollment_date', 'course', 'guardian_name',
                      'guardian_contact', 'emergency_contact', 'employee_id', 'designation',
                      'department', 'join_date', 'salary', 'employment_type', 'confirmation_password']:
            validated_data.pop(field, None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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
