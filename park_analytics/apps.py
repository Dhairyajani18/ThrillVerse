from django.apps import AppConfig

class ParkAnalyticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'park_analytics'

    def ready(self):
        # This forces Django to import views.py and run load_models() immediately on boot
        import park_analytics.views