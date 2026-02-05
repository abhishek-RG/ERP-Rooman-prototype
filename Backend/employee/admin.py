from django.contrib import admin
from .models import (
    Employee, EmployeeAttendance, LeaveRequest,
    Task, Payroll, Performance
)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'designation', 'department', 'employment_type', 'join_date']
    list_filter = ['department', 'employment_type', 'join_date']
    search_fields = ['employee_id', 'user__username', 'user__email']


@admin.register(EmployeeAttendance)
class EmployeeAttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'check_in', 'check_out', 'status']
    list_filter = ['status', 'date']
    search_fields = ['employee__employee_id']


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'status']
    list_filter = ['leave_type', 'status', 'start_date']
    search_fields = ['employee__employee_id']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'assigned_to', 'priority', 'status', 'due_date']
    list_filter = ['priority', 'status', 'due_date']
    search_fields = ['title', 'assigned_to__employee_id']


@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ['employee', 'month', 'year', 'net_salary', 'payment_status']
    list_filter = ['payment_status', 'year', 'month']
    search_fields = ['employee__employee_id']


@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'review_period_start', 'review_period_end', 'rating']
    list_filter = ['rating', 'review_period_start']
    search_fields = ['employee__employee_id']
