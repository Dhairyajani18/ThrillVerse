import datetime
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.db.models import F
from django.db.models.signals import post_save
from django.dispatch import receiver

# Token Generation
def generate_queue_token():
    today = datetime.date.today()
    date_str = today.strftime("%y%m%d")
    count = VirtualQueue.objects.filter(
        joined_at__date=today
    ).count() + 1
    
    while True:
        token = f"TV-{date_str}-{str(count).zfill(3)}"
        if not VirtualQueue.objects.filter(token=token).exists():
            return token
        count += 1

class Ride(models.Model):
    CATEGORY_CHOICES = (
        ('thrill', 'thrill'),
        ('family', 'family'),
        ('kids', 'kids'),
        ('water', 'water'),
        ('vr', 'vr'),
    )
    
    STATUS_CHOICES = (
        ('open', 'open'),
        ('busy', 'busy'),
        ('maintenance', 'maintenance'),
        ('closed', 'closed'),
    )

    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    thrill_level = models.PositiveSmallIntegerField()  # 1-3 or 1-5 (we seed based on frontend values)
    capacity = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField()
    min_height_cm = models.PositiveIntegerField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2)  # e.g. 4.90
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    queue_enabled = models.BooleanField(default=True)
    max_queue_size = models.PositiveIntegerField(default=200)
    img = models.URLField(max_length=500, null=True, blank=True)
    opening_time = models.TimeField(default="09:00:00")
    closing_time = models.TimeField(default="21:00:00")
    safety_instructions = models.TextField(blank=True, default="")
    maintenance_notes = models.TextField(blank=True, default="")
    expected_reopening_date = models.DateField(null=True, blank=True)
    
    # Real-world batch queue operation fields
    loading_seconds = models.PositiveIntegerField(default=120)
    duration_seconds = models.PositiveIntegerField(default=180)
    current_batch_number = models.PositiveIntegerField(default=1)
    current_cycle_start_time = models.DateTimeField(default=timezone.now)
    current_phase = models.CharField(max_length=20, default='boarding')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def cycle_time_seconds(self):
        return (self.duration_seconds or 180) + (self.loading_seconds or 120)

    @property
    def current_wait_time(self):
        from .queue_engine import calculate_wait_time
        wait_info = calculate_wait_time(self, self.current_batch_number)
        return wait_info.get('wait_minutes', 0)

    @property
    def active_queue_count(self):
        return VirtualQueue.objects.filter(ride=self, status__in=['waiting', 'boarding']).count()

    @property
    def is_joinable(self):
        return self.status in ['open', 'busy'] and self.queue_enabled and self.active_queue_count < self.max_queue_size

    def __str__(self):
        return self.name


class VirtualQueue(models.Model):
    STATUS_CHOICES = (
        ('waiting', 'In queue, waiting for turn'),
        ('boarding', "It's their turn, at ride entrance"),
        ('completed', 'Successfully rode the ride'),
        ('cancelled', 'User left queue / no-show'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='virtual_queues')
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='queues')
    token = models.CharField(max_length=20, unique=True, blank=True)
    position = models.PositiveIntegerField()
    batch_number = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    joined_at = models.DateTimeField(auto_now_add=True)
    estimated_wait = models.PositiveIntegerField()  # in minutes
    boarding_time = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    email_sent = models.BooleanField(default=False)

    @property
    def qr_ticket(self):
        try:
            from .services.qr_service import generate_qr_ticket
            return generate_qr_ticket(self.user, self)
        except Exception:
            return f"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={self.token or 'TV-PASS'}"

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = generate_queue_token()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.token} - {self.ride.name} ({self.status})"


class QueueSlot(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='slots')
    slot_time = models.DateTimeField()
    capacity = models.PositiveIntegerField()
    booked = models.PositiveIntegerField(default=0)

    @property
    def available(self):
        return self.capacity - self.booked

    def __str__(self):
        return f"{self.ride.name} Slot at {self.slot_time}"


class UserQueueStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='queue_stats')
    total_rides = models.PositiveIntegerField(default=0)
    total_wait_min = models.PositiveIntegerField(default=0)
    cancelled_count = models.PositiveIntegerField(default=0)
    xp_points = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def average_wait(self):
        if self.total_rides == 0:
            return 0
        return round(self.total_wait_min / self.total_rides)

    @property
    def level(self):
        from .views_helper import get_user_level
        return get_user_level(self.xp_points)

    def __str__(self):
        return f"{self.user.username}'s Queue Stats"


# Signals to auto-create UserQueueStats
@receiver(post_save, sender=User)
def create_user_queue_stats(sender, instance, created, **kwargs):
    if created:
        UserQueueStats.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_queue_stats(sender, instance, **kwargs):
    if hasattr(instance, 'queue_stats'):
        instance.queue_stats.save()
    else:
        UserQueueStats.objects.get_or_create(user=instance)


class Ticket(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('used', 'Used'),
        ('expired', 'Expired'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    ticket_id = models.CharField(max_length=50, unique=True)
    ticket_type = models.CharField(max_length=100)
    valid_date = models.DateField()
    holder_name = models.CharField(max_length=100)
    zones = models.CharField(max_length=100, default='All Zones')
    rides = models.CharField(max_length=100, default='Unlimited')
    price = models.PositiveIntegerField(default=999)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ticket_id} - {self.ticket_type} ({self.status})"


class Payment(models.Model):
    STATUS_CHOICES = (
        ('success', 'Success'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    ticket = models.ForeignKey(Ticket, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    payment_id = models.CharField(max_length=50, unique=True)
    amount = models.PositiveIntegerField()
    payment_method = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='success')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_id} - {self.amount} ({self.status})"


class Offer(models.Model):
    name = models.CharField(max_length=150, unique=True)
    adult_price = models.PositiveIntegerField(default=999)
    child_price = models.PositiveIntegerField(default=699)
    senior_price = models.PositiveIntegerField(default=799)
    is_active = models.BooleanField(default=True)
    banner_image = models.CharField(max_length=500, null=True, blank=True)
    description = models.TextField(blank=True, default="")
    discount_percentage = models.PositiveIntegerField(default=0)
    promo_code = models.CharField(max_length=50, blank=True, default="")
    start_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    applicable_ticket = models.CharField(max_length=100, blank=True, default="All")
    terms_conditions = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (A:{self.adult_price} C:{self.child_price} S:{self.senior_price})"


class PromoCode(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('flat', 'Flat Amount'),
        ('percentage', 'Percentage'),
    )
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='flat')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_booking_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_uses = models.PositiveIntegerField(default=1000)
    current_uses = models.PositiveIntegerField(default=0)
    expiry_date = models.DateField()
    is_active = models.BooleanField(default=True)
    applicable_offers = models.ManyToManyField(Offer, blank=True, related_name='promo_codes')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.discount_value} ({self.discount_type})"


class Booking(models.Model):
    STATUS_CHOICES = (
        ('created', 'Created'),
        ('payment_pending', 'Payment Pending'),
        ('payment_successful', 'Payment Successful'),
        ('qr_generated', 'QR Generated'),
        ('email_sent', 'Email Sent'),
        ('checked_in', 'Checked In'),
        ('completed', 'Completed'),
    )
    booking_id = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings_history')
    offer = models.ForeignKey(Offer, on_delete=models.PROTECT, related_name='bookings')
    visit_date = models.DateField()
    visitor_count = models.PositiveIntegerField(default=1)
    primary_visitor_name = models.CharField(max_length=150)
    primary_visitor_email = models.EmailField()
    primary_visitor_phone = models.CharField(max_length=20)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='created')
    qr_ticket = models.TextField(blank=True, null=True)
    is_checked_in = models.BooleanField(default=False)
    checked_in_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.booking_id} - {self.primary_visitor_name} ({self.status})"


class Visitor(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    RELATION_CHOICES = (
        ('Self', 'Self'),
        ('Spouse', 'Spouse'),
        ('Child', 'Child'),
        ('Parent', 'Parent'),
        ('Friend', 'Friend'),
        ('Relative', 'Relative'),
        ('Other', 'Other'),
    )
    TICKET_TYPE_CHOICES = (
        ('Adult', 'Adult'),
        ('Child', 'Child'),
        ('Senior Citizen', 'Senior Citizen'),
    )
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='visitors')
    full_name = models.CharField(max_length=150)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    relationship = models.CharField(max_length=30, choices=RELATION_CHOICES)
    ticket_type = models.CharField(max_length=30, choices=TICKET_TYPE_CHOICES)

    def __str__(self):
        return f"{self.full_name} ({self.ticket_type}) - {self.booking.booking_id}"


class Invoice(models.Model):
    invoice_id = models.CharField(max_length=50, unique=True)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='invoice')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    convenience_fee = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    gst = models.DecimalField(max_digits=10, decimal_places=2)
    promo_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.invoice_id} for {self.booking.booking_id}"


class BookingPayment(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
        ('Refunded', 'Refunded'),
    )
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='booking_payments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='booking_payments_history')
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    raw_response_json = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    promo_code = models.ForeignKey(PromoCode, on_delete=models.SET_NULL, blank=True, null=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    transaction_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.razorpay_order_id} - {self.total_paid} ({self.payment_status})"


class Restaurant(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('maintenance', 'Under Maintenance'),
    )
    name = models.CharField(max_length=100, unique=True)
    cuisine = models.CharField(max_length=50)
    tagline = models.CharField(max_length=150, blank=True, default="")
    location = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10)
    color = models.CharField(max_length=7)
    bg = models.CharField(max_length=7)
    img = models.URLField(max_length=500, null=True, blank=True)
    menu_img = models.URLField(max_length=500, null=True, blank=True)
    desc = models.TextField(blank=True, default="")
    opening_time = models.TimeField(default="10:00:00")
    closing_time = models.TimeField(default="22:00:00")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=100)
    price = models.PositiveIntegerField()
    tag = models.CharField(max_length=50, blank=True, default="")
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"


class RestaurantOrder(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    item_name = models.CharField(max_length=100)
    price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name} x {self.quantity} ({self.restaurant.name})"


class TicketType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    base_price = models.PositiveIntegerField()
    is_enabled = models.BooleanField(default=True)
    seasonal_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)

    def __str__(self):
        return f"{self.name} (₹{self.base_price})"


class SystemConfig(models.Model):
    key = models.CharField(max_length=50, unique=True)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.key}: {self.value}"
