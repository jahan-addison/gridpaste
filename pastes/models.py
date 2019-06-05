from django.contrib.postgres.fields import JSONField
from django.db import models

class Pastes(models.Model):
    title = models.TextField()
    user = models.TextField(default='anonymous')
    paste = JSONField()
    token = models.TextField(default='null')