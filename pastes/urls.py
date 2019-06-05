from django.urls import path

from . import views

urlpatterns = [
    path('', views.list, name='pastes'),
    path('delete/<int:id>/', views.delete, name='delete'),
    path('paste/', views.paste, name='paste'),
    path('<token>/', views.show),
]