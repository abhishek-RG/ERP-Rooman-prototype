from django.contrib import admin as django_admin
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report, Enquiry, CourseFeeStructure


@django_admin.register(AdminProfile)
class AdminProfileAdmin(django_admin.ModelAdmin):
    list_display = ['admin_id', 'user', 'designation', 'department', 'join_date']
    list_filter = ['department', 'join_date']
    search_fields = ['admin_id', 'user__username', 'user__email']


@django_admin.register(SystemSettings)
class SystemSettingsAdmin(django_admin.ModelAdmin):
    list_display = ['setting_key', 'setting_value', 'updated_at']
    search_fields = ['setting_key', 'description']


@django_admin.register(AuditLog)
class AuditLogAdmin(django_admin.ModelAdmin):
    list_display = ['user', 'action', 'model_name', 'object_id', 'timestamp']
    list_filter = ['action', 'model_name', 'timestamp']
    search_fields = ['user__username', 'action']
    readonly_fields = ['user', 'action', 'model_name', 'object_id', 'changes', 'ip_address', 'timestamp']


@django_admin.register(Notification)
class NotificationAdmin(django_admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'title', 'message']


@django_admin.register(Report)
class ReportAdmin(django_admin.ModelAdmin):
    list_display = ['report_name', 'report_type', 'generated_by', 'created_at']
    list_filter = ['report_type', 'created_at']
    search_fields = ['report_name', 'generated_by__username']


@django_admin.register(Enquiry)
class EnquiryAdmin(django_admin.ModelAdmin):
    list_display = ['name', 'center', 'enquiry_type', 'mobile_number', 'email', 'status', 'created_at']
    list_filter = ['center', 'enquiry_type', 'status', 'gender', 'created_at']
    search_fields = ['name', 'email', 'mobile_number', 'organisation_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Details', {
            'fields': ('name', 'center', 'enquiry_type', 'gender', 'computer_knowledge', 'qualification', 'status')
        }),
        ('Work Details', {
            'fields': ('organisation_name', 'designation', 'total_work_experience')
        }),
        ('Contact Details', {
            'fields': ('mobile_number', 'email', 'country', 'state', 'city')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@django_admin.register(CourseFeeStructure)
class CourseFeeStructureAdmin(django_admin.ModelAdmin):
    list_display = ['course_name', 'fee_amount']
    search_fields = ['course_name']
    list_editable = ['fee_amount']
