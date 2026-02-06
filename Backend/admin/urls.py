from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminProfileViewSet, UserManagementViewSet,
    SystemSettingsViewSet, AuditLogViewSet,
    NotificationViewSet, ReportViewSet, EnquiryViewSet
)

router = DefaultRouter()
router.register(r'profiles', AdminProfileViewSet, basename='admin-profile')
router.register(r'users', UserManagementViewSet, basename='user-management')
router.register(r'settings', SystemSettingsViewSet, basename='system-settings')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'enquiry', EnquiryViewSet, basename='enquiry')

urlpatterns = [
    path('', include(router.urls)),
]

