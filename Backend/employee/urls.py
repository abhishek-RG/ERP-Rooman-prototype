from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet, EmployeeAttendanceViewSet, LeaveRequestViewSet,
    TaskViewSet, PayrollViewSet, PerformanceViewSet
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'attendance', EmployeeAttendanceViewSet, basename='employee-attendance')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'payroll', PayrollViewSet, basename='payroll')
router.register(r'performance', PerformanceViewSet, basename='performance')

urlpatterns = [
    path('', include(router.urls)),
]
