import datetime
from django.db.models import F

XP_BASE = 50
XP_PER_THRILL = 10
XP_FIRST_RIDE_BONUS = 100

def estimate_crowd():
    from park_analytics.views import crowd_model, weather_encoder
    import pandas as pd
    now = datetime.datetime.now()
    day_of_week = now.weekday()
    hour = now.hour
    hour = max(9, min(21, hour))
    if crowd_model is not None and weather_encoder is not None:
        try:
            weather_encoded = weather_encoder.transform(['Sunny'])[0]
            features = pd.DataFrame([[hour, day_of_week, weather_encoded]], 
                                    columns=['hour', 'day_of_week', 'weather_encoded'])
            prediction = crowd_model.predict(features)[0]
            return int(prediction)
        except Exception:
            return 500
    return 500

def get_ai_wait_time(ride_id, crowd_count=None):
    from park_analytics.views import wait_time_model
    import pandas as pd
    now = datetime.datetime.now()
    day_of_week = now.weekday()
    if crowd_count is None:
        crowd_count = estimate_crowd()
    if wait_time_model is not None:
        try:
            features = pd.DataFrame([[ride_id, crowd_count, day_of_week]], 
                                    columns=['ride_id', 'current_crowd', 'day_of_week'])
            prediction = wait_time_model.predict(features)[0]
            return max(5, int(prediction))
        except Exception:
            return 15
    return 15

def calculate_xp(ride, user):
    from .models import UserQueueStats
    xp = XP_BASE + (ride.thrill_level * XP_PER_THRILL)
    stats, _ = UserQueueStats.objects.get_or_create(user=user)
    if stats.total_rides == 0:
        xp += XP_FIRST_RIDE_BONUS
    return xp

def get_user_level(xp_points):
    if xp_points < 500:
        return "Newbie"
    elif xp_points < 1500:
        return "Explorer"
    elif xp_points < 3000:
        return "Thrill Seeker"
    elif xp_points < 6000:
        return "Adventure Pro"
    else:
        return "ThrillVerse Legend"

def recalculate_positions(ride, from_position):
    from .models import VirtualQueue
    VirtualQueue.objects.filter(
        ride=ride,
        status='waiting',
        position__gt=from_position
    ).update(position=F('position') - 1)
