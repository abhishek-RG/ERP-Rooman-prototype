from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthTestCase(TestCase):
    """
    Test cases for Auth app
    """
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='student'
        )
    
    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.role, 'student')
        self.assertTrue(self.user.is_active)
