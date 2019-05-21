from django.contrib.postgres.fields import JSONField
from django.db import models

class Pastes(models.Model):
    id = models.AutoField(primary_key=True, serialize=True)
    title = models.TextField()
    user = models.TextField(default='anonymous')
    paste = JSONField()
    token = models.TextField(default='null')