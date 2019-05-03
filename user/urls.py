from django.urls import path, include

from . import views

""" 
This will cover the following paths with djangos built in authentication system.

user/login/ [name='login']
user/logout/ [name='logout']
user/password_change/ [name='password_change']
user/password_change/done/ [name='password_change_done']
user/password_reset/ [name='password_reset']
user/password_reset/done/ [name='password_reset_done']
user/reset/<uidb64>/<token>/ [name='password_reset_confirm']
user/reset/done/ [name='password_reset_complete']
user/register
"""

urlpatterns = [
    path('', include('django.contrib.auth.urls')),
    path('register/', views.register)
]