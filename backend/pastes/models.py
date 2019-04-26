from django.db import models

class Pastes(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    title = models.TextField()
    user = models.TextField(default='anonymous')
    paste = models.TextField()