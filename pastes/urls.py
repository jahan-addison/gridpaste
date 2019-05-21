from django.urls import path

from . import views

urlpatterns = [
    path('', views.list),
    path('delete/<int:id>/', views.delete),
    path('<int:id>/', views.show),
    path('edit/<int:id>/', views.edit),
    path('paste/', views.paste),
]