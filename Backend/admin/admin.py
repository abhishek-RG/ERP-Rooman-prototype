from django.contrib import admin as django_admin
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report


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
