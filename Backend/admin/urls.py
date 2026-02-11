from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminProfileViewSet, UserManagementViewSet,
    SystemSettingsViewSet, AuditLogViewSet,
    NotificationViewSet, ReportViewSet, EnquiryViewSet,
    InvoiceDashboardViewSet, StudentInvoiceViewSet, StudentReceiptViewSet,
    CourseFeeStructureViewSet, BatchViewSet, SessionViewSet, SessionAttendanceViewSet
    CourseFeeStructureViewSet, EmployeeSalaryDashboardViewSet
)

router = DefaultRouter()
router.register(r'profiles', AdminProfileViewSet, basename='admin-profile')
router.register(r'users', UserManagementViewSet, basename='user-management')
router.register(r'settings', SystemSettingsViewSet, basename='system-settings')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'enquiry', EnquiryViewSet, basename='enquiry')
router.register(r'invoices', InvoiceDashboardViewSet, basename='invoice-dashboard')
router.register(r'student-invoices', StudentInvoiceViewSet, basename='student-invoice')
router.register(r'student-receipts', StudentReceiptViewSet, basename='student-receipt')
router.register(r'course-fees', CourseFeeStructureViewSet, basename='course-fee')
router.register(r'batches', BatchViewSet, basename='batch')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'session-attendance', SessionAttendanceViewSet, basename='session-attendance')
router.register(r'salary-dashboard', EmployeeSalaryDashboardViewSet, basename='salary-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]

