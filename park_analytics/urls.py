from django.urls import path
from . import views


views.load_models()

urlpatterns = [
    path('predict-crowd', views.predict_crowd, name='predict_crowd'),
    path('predict-wait-time', views.predict_wait_time, name='predict_wait_time'),
]