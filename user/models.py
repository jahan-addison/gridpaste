from django.db import models

class User(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    username = models.TextField()
    password = models.TextField()
    email = models.TextField()