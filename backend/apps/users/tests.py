from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .services import reset_password


User = get_user_model()


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    FRONTEND_URL='http://testserver',
)
class PasswordResetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='customer@example.com',
            password='OriginalPassword123!',
            first_name='Customer',
            last_name='Example',
        )
        self.client = APIClient()

    def test_reset_otp_is_emailed_and_can_only_be_used_once(self):
        response = self.client.post('/api/v1/auth/password/forgot/', {'email': self.user.email}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)

        otp = mail.outbox[0].body.split('code is: ')[1].splitlines()[0]

        response = self.client.post(
            '/api/v1/auth/password/reset/',
            {'email': self.user.email, 'otp': otp, 'new_password': 'NewSecurePassword123!'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewSecurePassword123!'))

        response = self.client.post(
            '/api/v1/auth/password/reset/',
            {'email': self.user.email, 'otp': otp, 'new_password': 'AnotherSecurePassword123!'},
            format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_reset_request_does_not_disclose_unknown_email_addresses(self):
        response = self.client.post('/api/v1/auth/password/forgot/', {'email': 'unknown@example.com'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)

    def test_password_change_revokes_existing_refresh_token(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.force_authenticate(self.user)
        response = self.client.post(
            '/api/v1/auth/password/change/',
            {'old_password': 'OriginalPassword123!', 'new_password': 'ChangedSecurePassword123!'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)

        self.client.force_authenticate(user=None)
        response = self.client.post('/api/v1/auth/refresh/', {'refresh': str(refresh)}, format='json')
        self.assertEqual(response.status_code, 401)
