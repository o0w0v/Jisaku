from django.urls import path

from . import views

urlpatterns = [
    path('pages/', views.Jisaku, name='index'),
    path('usage/',views.Usage,name="Usage")
]