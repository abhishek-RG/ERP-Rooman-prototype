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
    
    # Reason for Enquiry choices
    REASON_FOR_ENQUIRY_CHOICES = [
        ('for_knowledge', 'For knowledge'),
        ('internship_or_project', 'Internship or project'),
        ('upskilling', 'Upskilling'),
        ('placements', 'Placements'),
    ]
    
    # Course choices
    COURSE_CHOICES = [
        ('advanced_java_005', 'Advanced Java (005)'),
        ('ai_in_cybersecurity_49', 'AI in Cybersecurity (49)'),
        ('application_developer_web_mobile_fsd', 'Application Developer Web and Mobile (FSD)'),
        ('aws_012', 'AWS (012)'),
        ('aws_internship', 'AWS Internship (Internship-1)'),
        ('aws_level_2', 'AWS Level 2 (AWS Advanced)'),
        ('ccna_009', 'CCNA (009)'),
        ('ccnp_23', 'CCNP (23)'),
        ('ccnp_enarsi', 'CCNP-ENARSI (CCNP 23.1)'),
        ('ccnp_encor', 'CCNP-ENCOR (CCNP 23)'),
        ('core_java_004', 'Core Java (004)'),
        ('core_java_pap', 'Core Java (PAP) (PAP-1)'),
        ('cyber_security_10', 'Cyber Security (10)'),
        ('data_analytics_internship', 'Data Analytics Internship (Internship-2)'),
        ('data_science_ai_28', 'Data Science & AI (28)'),
        ('data_science_business_analytics_001', 'Data Science & Business Analytics (001)'),
        ('data_science_machine_learning_019', 'Data Science & Machine Learning (019)'),
        ('ethical_hacking_011', 'Ethical Hacking (011)'),
        ('front_end_technologies_006', 'Front End Technologies (006)'),
        ('full_stack_cloud_devops', 'Full Stack Cloud & DevOps (FutureAcad-04)'),
        ('full_stack_cyber_security', 'Full Stack Cyber Security (FutureAcad-03)'),
        ('full_stack_development_python_26', 'Full Stack Development – Python (26)'),
        ('full_stack_software_developer_internship', 'Full Stack Software Developer Internship (Internship-3)'),
        ('full_stack_software_developer_genai', 'Full Stack Software Developer with GenAI (FutureAcad-06)'),
        ('hardware_and_networking_37', 'Hardware and Networking (37)'),
        ('interview_prep_program', 'Interview Prep Program (Interview-1)'),
        ('java_frameworks_27', 'Java Frameworks (27)'),
        ('machine_learning_002', 'Machine Learning (002)'),
        ('master_data_analytics_ml', 'Master in Data Analytics & Machine Learning (FutureAcad-02)'),
        ('master_nextgen_ai_data_science', 'Master in NextGen AI & Data Science (FutureAcad-01)'),
        ('mysql_nosql_014', 'MySQL / NoSQL (014)'),
        ('networking_cyber_security_22', 'Networking & Cyber Security (22)'),
        ('networking_essentials', 'Networking Essentials (Net-Ess)'),
        ('professional_cloud_devops', 'Professional in Cloud and DevOps (Professional-08)'),
        ('professional_core_it_ops', 'Professional in Core IT Ops: Network, Server & Cloud (Professional-01)'),
        ('professional_cyber_security_expert', 'Professional in Cyber Security Expert (Professional-06)'),
        ('professional_data_analytics', 'Professional in Data Analytics (Professional-03)'),
        ('professional_generative_ai_mlops', 'Professional in Generative AI and MLOps (Professional-05)'),
        ('professional_ml_deep_learning', 'Professional in Machine Learning & Deep Learning (Professional-04)'),
        ('professional_web_development_dsa', 'Professional in Web Development & DSA (Professional-02)'),
        ('python_frameworks_008', 'Python Frameworks (008)'),
        ('python_programming_007', 'Python Programming (007)'),
        ('server_admin_cloud_computing_21', 'Server Admin & Cloud Computing (21)'),
        ('soft_skills_43', 'Soft Skills (43)'),
        ('vmware_essentials_13', 'VMWare Essentials (13)'),
        ('windows_server_administrator_24', 'Windows Server Administrator (24)'),
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
    reason_for_enquiry = models.CharField(max_length=50, choices=REASON_FOR_ENQUIRY_CHOICES, blank=True, null=True)
    course = models.CharField(max_length=100, choices=COURSE_CHOICES, blank=True, null=True)
    
    # Lead Management Fields
    LEAD_STATUS_CHOICES = [
        ('cold', 'Cold'),
        ('warm', 'Warm'),
        ('hot', 'Hot'),
    ]
    
    STAGE_CHOICES = [
        ('ENQUIRY', 'Enquiry'),
        ('LEAD', 'Lead'),
        ('CONVERTED', 'Converted'),
    ]
    
    lead_status = models.CharField(max_length=10, choices=LEAD_STATUS_CHOICES, blank=True, null=True)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='ENQUIRY')
    notes = models.TextField(blank=True, null=True)
    
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


class FollowUp(models.Model):
    """Model to store follow-up records for enquiries"""
    OUTCOME_CHOICES = [
        ('connected', 'Connected'),
        ('no_response', 'No Response'),
        ('call_back', 'Call Back'),
    ]
    
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name='followups')
    date = models.DateField()
    notes = models.TextField()
    outcome = models.CharField(max_length=20, choices=OUTCOME_CHOICES)
    next_follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'follow_ups'
        verbose_name = 'Follow Up'
        verbose_name_plural = 'Follow Ups'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Follow-up for {self.enquiry.name} on {self.date}"

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

