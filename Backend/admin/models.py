from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminProfile(models.Model):
    """
    Admin Profile Model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    admin_id = models.CharField(max_length=20, unique=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    join_date = models.DateField()
    permissions = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_profiles'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.admin_id} - {self.user.get_full_name()}"


class SystemSettings(models.Model):
    """
    System Settings Model
    """
    setting_key = models.CharField(max_length=100, unique=True)
    setting_value = models.TextField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'system_settings'
        ordering = ['setting_key']
    
    def __str__(self):
        return self.setting_key


class AuditLog(models.Model):
    """
    Audit Log Model for tracking admin actions
    """
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    object_id = models.IntegerField()
    changes = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.model_name}"


class Notification(models.Model):
    """
    Notification Model
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=[
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('success', 'Success')
    ])
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class Report(models.Model):
    """
    Report Model for generating various reports
    """
    report_name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=50, choices=[
        ('student', 'Student Report'),
        ('employee', 'Employee Report'),
        ('attendance', 'Attendance Report'),
        ('financial', 'Financial Report'),
        ('academic', 'Academic Report')
    ])
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    file_path = models.FileField(upload_to='reports/', blank=True, null=True)
    parameters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.report_name} - {self.created_at}"


class Enquiry(models.Model):
    """
    Enquiry Model for managing student/customer enquiries
    """
    # Center choices
    CENTER_CHOICES = [
        ('all', 'All Centers'),
        ('TC016371', 'Electronic City PMKK Futureskill (TC016371)'),
        ('123', 'Rajajinagar (123)'),
        ('RAJBAN', 'Rajajinagar Bangalore (RAJBAN)'),
        ('RON', 'Rooman Online (RON)'),
    ]
    
    # Type choices
    TYPE_CHOICES = [
        ('corporate', 'Corporate'),
        ('email', 'EMAIL'),
        ('facebook', 'Facebook'),
        ('job_mela', 'JOB MELA'),
        ('old_student', 'Old Student'),
        ('online_registration', 'Online Registration'),
        ('placements', 'Placements'),
        ('referral_app', 'Referral APP'),
        ('seminar_workshop', 'Seminar/Workshop'),
        ('sms', 'SMS'),
        ('telephonic', 'TELEPHONIC'),
        ('walkin_others', 'WALK-IN (Others)'),
        ('walkin_experienced', 'Walk-in Experienced'),
        ('walkin_fresher', 'Walk-in Fresher'),
    ]
    
    # Gender choices
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    # Computer Knowledge choices
    COMPUTER_KNOWLEDGE_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    # Status choices
    STATUS_CHOICES = [
        ('employed', 'Employed'),
        ('unemployed', 'Unemployed'),
        ('student', 'Student'),
        ('self_employed', 'Self Employed'),
    ]
    
    # Basic Details
    name = models.CharField(max_length=255)
    center = models.CharField(max_length=50, choices=CENTER_CHOICES)
    enquiry_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    computer_knowledge = models.CharField(max_length=20, choices=COMPUTER_KNOWLEDGE_CHOICES, blank=True, null=True)
    qualification = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='student', blank=True, null=True)
    organisation_name = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    total_work_experience = models.CharField(max_length=50, blank=True, null=True)
    
    # Contact Details
    mobile_number = models.CharField(max_length=20)
    email = models.EmailField()
    country = models.CharField(max_length=100, default='India')
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enquiries'
        verbose_name = 'Enquiry'
        verbose_name_plural = 'Enquiries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.center} - {self.enquiry_type}"

