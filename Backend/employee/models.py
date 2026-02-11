from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Employee(models.Model):
    """
    Employee Profile Model
    """
    CENTERS = [
        ('Electronic City PMKK Futureskill (TC016371)', 'Electronic City PMKK Futureskill (TC016371)'),
        ('Rajajinagar (123)', 'Rajajinagar (123)'),
        ('Rajajinagar Bangalore (RAJBAN)', 'Rajajinagar Bangalore (RAJBAN)'),
        ('Rooman Online (RON)', 'Rooman Online (RON)'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    center = models.CharField(max_length=100, choices=CENTERS, blank=True, null=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    join_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    employment_type = models.CharField(max_length=20, choices=[
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract')
    ])
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    emergency_contact = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"


class EmployeeAttendance(models.Model):
    """
    Employee Attendance Model
    """
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    check_in = models.TimeField()
    check_out = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('half-day', 'Half Day'),
        ('leave', 'Leave')
    ])
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'employee_attendances'
        unique_together = ['employee', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.date}"


class LeaveRequest(models.Model):
    """
    Employee Leave Request Model
    """
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=50, choices=[
        ('sick', 'Sick Leave'),
        ('casual', 'Casual Leave'),
        ('earned', 'Earned Leave'),
        ('maternity', 'Maternity Leave'),
        ('paternity', 'Paternity Leave')
    ])
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leave_requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.leave_type} - {self.start_date}"


class Task(models.Model):
    """
    Employee Task Model
    """
    assigned_to = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='tasks')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tasks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ])
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='pending')
    due_date = models.DateTimeField()
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.assigned_to.employee_id}"


class Payroll(models.Model):
    """
    Employee Payroll Model
    """
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payrolls')
    month = models.IntegerField()
    year = models.IntegerField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('paid', 'Paid')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payrolls'
        unique_together = ['employee', 'month', 'year']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.month}/{self.year}"


class Performance(models.Model):
    """
    Employee Performance Review Model
    """
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performances')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviewed_performances')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    strengths = models.TextField()
    areas_of_improvement = models.TextField()
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'performances'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.review_period_start} to {self.review_period_end}"
