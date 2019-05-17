from django.contrib.auth.models import User
from django.test import TestCase, Client

class UserTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'testsuser',
            'password': 'testsuser'
        }
        self.client = Client()

        user = User.objects.create(username=self.credentials['username'])
        user.set_password(self.credentials['password'])
        user.save()
    def test_login(self):
        logged_in = self.client.login(**self.credentials)
        print(logged_in)
        self.assertTrue(logged_in)