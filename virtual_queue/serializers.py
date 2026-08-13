from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ride, VirtualQueue, QueueSlot, UserQueueStats
from .views_helper import get_ai_wait_time

class RideSerializer(serializers.ModelSerializer):
    current_wait_time = serializers.ReadOnlyField()
    active_queue_count = serializers.ReadOnlyField()
    is_joinable = serializers.ReadOnlyField()
    category = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    height = serializers.SerializerMethodField()
    zone = serializers.SerializerMethodField()
    snapshot = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = (
            'id', 'name', 'emoji', 'category', 'thrill_level', 'capacity',
            'duration_minutes', 'min_height_cm', 'rating', 'status',
            'queue_enabled', 'max_queue_size', 'current_wait_time',
            'active_queue_count', 'is_joinable', 'img', 'duration', 'height', 'zone',
            'loading_seconds', 'duration_seconds', 'current_batch_number',
            'current_phase', 'snapshot'
        )

    def get_category(self, obj):
        cat_map = {
            'thrill': 'Thriller',
            'water': 'Water',
            'family': 'Family',
            'kids': 'Kids',
            'vr': 'VR'
        }
        return cat_map.get(obj.category.lower(), obj.category.capitalize())

    def get_zone(self, obj):
        cat = obj.category.lower()
        if 'thrill' in cat:
            return 'Thriller Zone'
        elif 'water' in cat:
            return 'Water Zone'
        elif 'family' in cat:
            return 'Family Zone'
        elif 'kids' in cat:
            return 'Kids Zone'
        return f"{obj.category.capitalize()} Zone"

    def get_duration(self, obj):
        return f"{obj.duration_minutes} min" if obj.duration_minutes else "None"

    def get_height(self, obj):
        if obj.min_height_cm:
            return f"{obj.min_height_cm} cm"
        return "None"

    def get_snapshot(self, obj):
        from .queue_engine import get_ride_snapshot
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None
        return get_ride_snapshot(obj, user=user)

class VirtualQueueSerializer(serializers.ModelSerializer):
    ride = RideSerializer(read_only=True)
    joined_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", read_only=True)
    completed_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", read_only=True)
    boarding_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", read_only=True)
    batches_ahead = serializers.SerializerMethodField()

    class Meta:
        model = VirtualQueue
        fields = (
            'id', 'token', 'position', 'batch_number', 'status', 'estimated_wait',
            'boarding_time', 'joined_at', 'completed_at', 'ride', 'batches_ahead'
        )

    def get_batches_ahead(self, obj):
        from .queue_engine import calculate_wait_time
        wait_info = calculate_wait_time(obj.ride, obj.batch_number)
        return wait_info['batches_ahead']

class JoinQueueSerializer(serializers.Serializer):
    ride_id = serializers.IntegerField(write_only=True)

    def validate_ride_id(self, value):
        try:
            ride = Ride.objects.get(id=value)
        except Ride.DoesNotExist:
            raise serializers.ValidationError("Ride does not exist.")
        return value

    def validate(self, data):
        user = self.context['request'].user
        ride = Ride.objects.get(id=data['ride_id'])
        
        # User must not already have an active queue (status=waiting OR status=boarding)
        active_exists = VirtualQueue.objects.filter(
            user=user, 
            status__in=['waiting', 'boarding']
        ).exists()
        if active_exists:
            raise serializers.ValidationError("You already have an active queue reservation.")
        
        # Ride must be joinable
        if not ride.is_joinable:
            raise serializers.ValidationError("Ride is not accepting queue entries.")
            
        # Status must not be maintenance
        if ride.status == 'maintenance':
            raise serializers.ValidationError("Ride is under maintenance.")
            
        return data

class QueueDetailSerializer(VirtualQueueSerializer):
    position = serializers.SerializerMethodField()
    people_ahead = serializers.SerializerMethodField()
    progress_percent = serializers.SerializerMethodField()
    ai_prediction = serializers.SerializerMethodField()
    estimated_wait_seconds = serializers.SerializerMethodField()
    ride_snapshot = serializers.SerializerMethodField()

    class Meta(VirtualQueueSerializer.Meta):
        fields = VirtualQueueSerializer.Meta.fields + (
            'people_ahead', 'progress_percent', 'ai_prediction',
            'estimated_wait_seconds', 'ride_snapshot'
        )

    def get_position(self, obj):
        return self.get_people_ahead(obj) + 1

    def get_people_ahead(self, obj):
        return VirtualQueue.objects.filter(
            ride=obj.ride,
            status__in=['waiting', 'boarding'],
            position__lt=obj.position
        ).count()

    def get_progress_percent(self, obj):
        from .queue_engine import sync_ride_state
        sync_ride_state(obj.ride)
        current = obj.ride.current_batch_number
        if obj.batch_number <= current:
            return 100
        batches_behind = obj.batch_number - current
        return max(5, int((1.0 / (batches_behind + 1)) * 100))

    def get_ai_prediction(self, obj):
        from .queue_engine import calculate_wait_time
        wait_info = calculate_wait_time(obj.ride, obj.batch_number)
        return wait_info['wait_minutes']

    def get_estimated_wait_seconds(self, obj):
        from .queue_engine import calculate_wait_time
        wait_info = calculate_wait_time(obj.ride, obj.batch_number)
        return wait_info['wait_seconds']

    def get_ride_snapshot(self, obj):
        from .queue_engine import get_ride_snapshot
        return get_ride_snapshot(obj.ride, user=obj.user)


class QueueHistorySerializer(serializers.ModelSerializer):
    ride_name = serializers.CharField(source='ride.name', read_only=True)
    ride_emoji = serializers.CharField(source='ride.emoji', read_only=True)
    joined_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", read_only=True)
    completed_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", read_only=True)
    wait_minutes = serializers.SerializerMethodField()

    class Meta:
        model = VirtualQueue
        fields = (
            'id', 'token', 'ride_name', 'ride_emoji', 'status',
            'joined_at', 'completed_at', 'wait_minutes'
        )

    def get_wait_minutes(self, obj):
        if obj.completed_at and obj.joined_at:
            diff = obj.completed_at - obj.joined_at
            return max(0, int(diff.total_seconds() / 60))
        elif obj.cancelled_at and obj.joined_at:
            diff = obj.cancelled_at - obj.joined_at
            return max(0, int(diff.total_seconds() / 60))
        return obj.estimated_wait

class UserQueueStatsSerializer(serializers.ModelSerializer):
    average_wait = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    favorite_ride = serializers.SerializerMethodField()

    class Meta:
        model = UserQueueStats
        fields = (
            'total_rides', 'total_wait_min', 'average_wait',
            'cancelled_count', 'xp_points', 'level', 'favorite_ride'
        )

    def get_favorite_ride(self, obj):
        from django.db.models import Count
        fav = VirtualQueue.objects.filter(
            user=obj.user,
            status='completed'
        ).values('ride__name').annotate(count=Count('ride')).order_by('-count').first()
        if fav:
            return {"name": fav['ride__name'], "count": fav['count']}
        return {"name": "None", "count": 0}


from .models import Ticket, Payment

class TicketSerializer(serializers.ModelSerializer):
    qr_code_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = '__all__'

    def get_qr_code_base64(self, obj):
        try:
            from django.core import signing
            from virtual_queue.services.qr_service import generate_qr_code_base64
            
            # Generate a cryptographically signed token for this ticket
            payload = {
                "booking_id": str(obj.ticket_id),
                "visit_date": str(obj.valid_date),
                "visitor_count": 1,
                "user_id": int(obj.user.id)
            }
            signed_token = signing.dumps(payload)
            return generate_qr_code_base64(signed_token)
        except Exception:
            return None

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        fields = '__all__'
