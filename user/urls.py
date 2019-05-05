from django.conf.urls import include, url


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
    url(r'^', include('django_registration.backends.one_step.urls')),
    url(r'^', include('django.contrib.auth.urls')), 
]