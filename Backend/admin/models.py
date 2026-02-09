from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

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


class Activity(models.Model):
    """
    Activity model for tracking tasks, meetings, follow-ups, and feedback
    """
    
    # Activity Type Choices
    ACTIVITY_TYPE_CHOICES = (
        ('office_meeting', 'Office Meeting (1 Day)'),
        ('workshop_seminar', 'Workshop/Seminar Follow Up (1 Day)'),
        ('enquiry_followup', 'Enquiry Follow Up (1 Day)'),
        ('batch_commencement', 'Batch Commencement Follow Up (1 Day)'),
        ('fee_followup', 'Fee Follow-up (1 Day)'),
        ('urgent_task', 'Urgent Task (12 hrs)'),
        ('house_visit', 'House Visit (2 Days)'),
        ('lab_problem', 'Lab Problem (1 Day)'),
        ('request_suggestion', 'Request / Suggestion (1 Day)'),
        ('normal_task', 'Normal Task (2 Days)'),
        ('student_info', 'Student Information (1 Day)'),
        ('student_request', 'Student Request (1 Day)'),
        ('student_feedback', 'Student Feedback (1 Day)'),
        ('student_suggestion', 'Student Suggestion (1 Day)'),
        ('student_complaint', 'Student Complaint (1 Day)'),
    )
    
    # Priority Choices
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    # Activity Status Choices
    STATUS_CHOICES = (
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    )
    
    # Activity Info Section
    executive = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='activities_created'
    )
    activity_type = models.CharField(
        max_length=30,
        choices=ACTIVITY_TYPE_CHOICES
    )
    activity_description = models.TextField(
        max_length=255,
        help_text="Maximum 255 characters"
    )
    activity_date = models.DateField()
    
    # Start Time
    start_time_hour = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        null=True,
        blank=True
    )
    start_time_minute = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(59)],
        null=True,
        blank=True
    )
    
    # Duration
    duration_hour = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        null=True,
        blank=True
    )
    duration_minute = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(59)],
        null=True,
        blank=True
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium'
    )
    
    # Contact Info Section
    person_to_contact = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    phone_1 = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text="Phone number with digits only"
    )
    phone_2 = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text="Optional second phone number"
    )
    venue = models.TextField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Maximum 255 characters"
    )
    
    # Feedback Section
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='planned'
    )
    feedback = models.TextField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Maximum 255 characters"
    )
    
    # Remarks Section
    remarks = models.TextField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Maximum 255 characters"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'activities'
        ordering = ['-created_at']
        verbose_name_plural = 'Activities'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['activity_date']),
            models.Index(fields=['executive']),
        ]
    
    def __str__(self):
        return f"{self.get_activity_type_display()} - {self.activity_date} ({self.executive.username})"


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


class CourseFeeStructure(models.Model):
    """
    Model for storing course-wise fees
    """
    course_name = models.CharField(max_length=255, unique=True)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'course_fee_structure'
        verbose_name = 'Course Fee Structure'
        verbose_name_plural = 'Course Fee Structures'
        ordering = ['course_name']

    def __str__(self):
        return f"{self.course_name} - {self.fee_amount}"


class StudentInvoice(models.Model):
    student = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=20, unique=True, editable=False)
    invoice_date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total Course Fees")
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    registration_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    courses = models.TextField(help_text="Comma separated courses")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_invoices'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.invoice_number} - {self.student.user.get_full_name()}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            import random
            from datetime import datetime
            # Format: RAJBANINV + random number as per image example
            self.invoice_number = f"INV{datetime.now().strftime('%Y%m')}{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)


class InvoiceInstallment(models.Model):
    invoice = models.ForeignKey(StudentInvoice, on_delete=models.CASCADE, related_name='installments')
    installment_no = models.IntegerField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pending', choices=[('Pending', 'Pending'), ('Paid', 'Paid')])

    class Meta:
        db_table = 'invoice_installments'
        ordering = ['installment_no']


class StudentReceipt(models.Model):
    invoice = models.ForeignKey(StudentInvoice, on_delete=models.CASCADE, related_name='receipts')
    receipt_number = models.CharField(max_length=20, unique=True, editable=False)
    receipt_date = models.DateField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=[
        ('Course Fees', 'Course Fees'), 
        ('Courseware', 'Courseware'),
        ('Exam Fees', 'Exam Fees'),
        ('Misc', 'Misc')
    ], default='Course Fees')
    payment_mode = models.CharField(max_length=50, default='Cash')
    transaction_ref = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('AdminProfile', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'student_receipts'
        ordering = ['-receipt_date']

    def __str__(self):
        return f"{self.receipt_number} - {self.amount}"

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            import random
            from datetime import datetime
            self.receipt_number = f"RCT{datetime.now().strftime('%Y%m')}{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)


class EmployeeSalaryStatus(models.Model):
    """
    Model to track current salary payment status for employees
    """
    employee = models.OneToOneField('employee.Employee', on_delete=models.CASCADE, related_name='salary_status')
    status = models.CharField(max_length=20, choices=[('Paid', 'Salary Paid'), ('Pending', 'Pending')], default='Pending')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employee_salary_status'
        verbose_name = 'Employee Salary Status'
        verbose_name_plural = 'Employee Salary Statuses'

    def __str__(self):
        return f"{self.employee.user.username} - {self.status}"

