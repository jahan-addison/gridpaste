from django.urls import path

from . import views

urlpatterns = [
    path('', views.list),
    path('delete/<int:id>/', views.delete),
    path('paste/', views.paste),
    path('<token>/', views.show),
]