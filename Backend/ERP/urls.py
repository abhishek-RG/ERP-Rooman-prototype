"""
URL configuration for Backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from admin.views import ActivityViewSet

# Activity router - mapped directly to /api/activities/
activity_router = DefaultRouter()
activity_router.register(r'', ActivityViewSet, basename='activity')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('Auth.urls')),
    path('api/student/', include('student.urls')),
    path('api/admin/', include('admin.urls')),
    path('api/employee/', include('employee.urls')),
    path('api/activities/', include(activity_router.urls)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
