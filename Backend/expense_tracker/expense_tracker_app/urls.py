from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterUserAPIView.as_view(), name='register'),
        path('login/', LoginAPIView.as_view(), name='login'),
            path('expenses/', ExpenseAPIView.as_view(), name='create-expense'),


]
