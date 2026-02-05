from django.core.management.base import BaseCommand
from Auth.models import User


class Command(BaseCommand):
    help = 'Create test users for all three roles (student, admin, employee)'

    def handle(self, *args, **kwargs):
        # Create Student User
        student, created = User.objects.get_or_create(
            username='student1',
            defaults={
                'email': 'student@example.com',
                'role': 'student',
                'first_name': 'John',
                'last_name': 'Student',
                'phone_number': '1234567890',
            }
        )
        if created:
            student.set_password('student123')
            student.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Student user created: {student.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠ Student user already exists: {student.username}'))

        # Create Admin User
        admin, created = User.objects.get_or_create(
            username='admin1',
            defaults={
                'email': 'admin@example.com',
                'role': 'admin',
                'first_name': 'Jane',
                'last_name': 'Admin',
                'phone_number': '0987654321',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Admin user created: {admin.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠ Admin user already exists: {admin.username}'))

        # Create Employee User
        employee, created = User.objects.get_or_create(
            username='employee1',
            defaults={
                'email': 'employee@example.com',
                'role': 'employee',
                'first_name': 'Mike',
                'last_name': 'Employee',
                'phone_number': '5555555555',
            }
        )
        if created:
            employee.set_password('employee123')
            employee.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Employee user created: {employee.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠ Employee user already exists: {employee.username}'))

        self.stdout.write(self.style.SUCCESS('\n=== Login Credentials ==='))
        self.stdout.write(self.style.SUCCESS('Student: username=student1, password=student123'))
        self.stdout.write(self.style.SUCCESS('Admin: username=admin1, password=admin123'))
        self.stdout.write(self.style.SUCCESS('Employee: username=employee1, password=employee123'))
