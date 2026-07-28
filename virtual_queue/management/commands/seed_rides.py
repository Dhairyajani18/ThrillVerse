import datetime
import uuid
import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from authentication.models import UserProfile
from virtual_queue.models import (
    Ride, Restaurant, MenuItem, RestaurantOrder, TicketType,
    SystemConfig, Offer, PromoCode, Booking, Visitor, Invoice, BookingPayment
)

class Command(BaseCommand):
    help = 'Seeds complete databases for ThrillVerse amusement park'

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting existing database records...")
        
        # Keep clean tables
        RestaurantOrder.objects.all().delete()
        MenuItem.objects.all().delete()
        Restaurant.objects.all().delete()
        TicketType.objects.all().delete()
        SystemConfig.objects.all().delete()
        Ride.objects.all().delete()
        
        # Optional: Delete bookings/payments to prevent clean conflicts, 
        # but let's just delete the seeded ones later or clean them
        BookingPayment.objects.all().delete()
        Invoice.objects.all().delete()
        Visitor.objects.all().delete()
        Booking.objects.all().delete()

        # -------------------------------------------------------------
        # 1. SEED RIDES
        # -------------------------------------------------------------
        self.stdout.write("Seeding 16 Rides...")
        IMG_roller = "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=600&h=400&fit=crop&auto=format"
        IMG_water = "https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=600&h=400&fit=crop&auto=format"
        IMG_ferris = "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&h=400&fit=crop&auto=format"
        IMG_neon = "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=600&h=400&fit=crop&auto=format"
        IMG_swing = "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=600&h=400&fit=crop&auto=format"
        IMG_splash = "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=600&h=400&fit=crop&auto=format"
        IMG_coaster = "https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=600&h=400&fit=crop&auto=format"
        IMG_tower = "https://images.unsplash.com/photo-1668593107037-836e886119fc?w=600&h=400&fit=crop&auto=format"

        rides_data = [
            # Thriller
            {"id": 1, "name": "Nitro", "emoji": "🎢", "category": "thrill", "thrill_level": 5, "capacity": 24, "duration_minutes": 2, "min_height_cm": 120, "rating": 4.90, "status": "open", "img": IMG_roller},
            {"id": 2, "name": "Scream Machine", "emoji": "🎡", "category": "thrill", "thrill_level": 5, "capacity": 40, "duration_minutes": 2, "min_height_cm": 130, "rating": 4.80, "status": "open", "img": IMG_neon},
            {"id": 3, "name": "SpaceX", "emoji": "🚀", "category": "thrill", "thrill_level": 5, "capacity": 20, "duration_minutes": 1, "min_height_cm": 125, "rating": 4.70, "status": "open", "img": IMG_tower},
            {"id": 4, "name": "Dare 2 Drop", "emoji": "🪂", "category": "thrill", "thrill_level": 5, "capacity": 24, "duration_minutes": 2, "min_height_cm": 120, "rating": 4.60, "status": "open", "img": IMG_coaster},
            # Water
            {"id": 5, "name": "Dino Splashdown", "emoji": "🌊", "category": "water", "thrill_level": 4, "capacity": 24, "duration_minutes": 3, "min_height_cm": 110, "rating": 4.70, "status": "open", "img": IMG_water},
            {"id": 6, "name": "Splash Ahoy!", "emoji": "💦", "category": "water", "thrill_level": 3, "capacity": 16, "duration_minutes": 4, "min_height_cm": 100, "rating": 4.60, "status": "open", "img": IMG_splash},
            # Family
            {"id": 7, "name": "Gold Rush Express", "emoji": "🚂", "category": "family", "thrill_level": 2, "capacity": 30, "duration_minutes": 5, "min_height_cm": 90, "rating": 4.40, "status": "open", "img": IMG_swing},
            {"id": 8, "name": "Alibaba Aur Chalis Chorr", "emoji": "🕌", "category": "family", "thrill_level": 2, "capacity": 50, "duration_minutes": 8, "min_height_cm": 80, "rating": 4.50, "status": "open", "img": IMG_ferris},
            {"id": 9, "name": "Bhangarh: The Curse", "emoji": "👻", "category": "family", "thrill_level": 2, "capacity": 40, "duration_minutes": 8, "min_height_cm": None, "rating": 4.50, "status": "open", "img": IMG_swing},
            {"id": 10, "name": "Chai Spin Chaos", "emoji": "☕", "category": "family", "thrill_level": 1, "capacity": 36, "duration_minutes": 5, "min_height_cm": None, "rating": 4.30, "status": "open", "img": IMG_ferris},
            {"id": 11, "name": "Wrath of the Gods", "emoji": "🔥", "category": "family", "thrill_level": 3, "capacity": 50, "duration_minutes": 15, "min_height_cm": 100, "rating": 4.70, "status": "open", "img": IMG_swing},
            {"id": 12, "name": "Magic Carousel", "emoji": "Carousel", "category": "family", "thrill_level": 1, "capacity": 40, "duration_minutes": 6, "min_height_cm": None, "rating": 4.30, "status": "open", "img": IMG_ferris},
            # Kids
            {"id": 13, "name": "Chhota Bheem – The Ride", "emoji": "👦", "category": "kids", "thrill_level": 1, "capacity": 30, "duration_minutes": 3, "min_height_cm": None, "rating": 4.20, "status": "open", "img": IMG_swing},
            {"id": 14, "name": "Elephant Ride", "emoji": "🐘", "category": "kids", "thrill_level": 1, "capacity": 30, "duration_minutes": 5, "min_height_cm": None, "rating": 4.10, "status": "open", "img": IMG_ferris},
            {"id": 15, "name": "Mini Fall", "emoji": "⬇️", "category": "kids", "thrill_level": 2, "capacity": 30, "duration_minutes": 4, "min_height_cm": None, "rating": 4.30, "status": "open", "img": IMG_roller},
            {"id": 16, "name": "Cinema 360 – Prince of the Dark Waters", "emoji": "🎬", "category": "kids", "thrill_level": 2, "capacity": 80, "duration_minutes": 10, "min_height_cm": None, "rating": 4.50, "status": "open", "img": IMG_roller}
        ]

        for r_dict in rides_data:
            Ride.objects.create(**r_dict)

        # -------------------------------------------------------------
        # 2. SEED ADMIN USER & PROFILE
        # -------------------------------------------------------------
        self.stdout.write("Seeding Admin Credentials...")
        admin_username = "admin"
        admin_email = "admin@thrillverse.com"
        admin_password = "admin@123"

        admin_user = User.objects.filter(email=admin_email).first()
        if not admin_user:
            admin_user = User.objects.create_user(
                username=admin_username,
                email=admin_email,
                password=admin_password,
                first_name="Park",
                last_name="Administrator"
            )
        else:
            admin_user.username = admin_username
            admin_user.set_password(admin_password)
            admin_user.save()

        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()

        profile, _ = UserProfile.objects.get_or_create(user=admin_user)
        profile.role = 'Admin'
        profile.age = 30
        profile.save()

        # Seed standard customer user for mock transactions
        customer_user, _ = User.objects.get_or_create(
            username="rohan_sharma",
            defaults={"email": "rohan@gmail.com", "first_name": "Rohan", "last_name": "Sharma"}
        )
        customer_user.set_password("user@123")
        customer_user.save()

        # -------------------------------------------------------------
        # 3. SEED RESTAURANTS AND MENUS
        # -------------------------------------------------------------
        self.stdout.write("Seeding 4 Fixed Restaurants...")
        
        r_spice = Restaurant.objects.create(
            name="Spice Arena", cuisine="Indian", tagline="Authentic Desi Flavours",
            location="Near Water Zone · Zone B", emoji="🍛", color="#f97316", bg="#fff7f0",
            img="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format",
            desc="Authentic Indian street food, thalis and refreshing drinks. Perfect for families after an exciting ride in Zone B.",
            opening_time="10:00:00", closing_time="21:30:00", status="open", is_featured=True
        )
        
        r_burger = Restaurant.objects.create(
            name="Burger Bay", cuisine="Fast Food", tagline="Quick & Tasty Bites",
            location="Main Entrance · Zone A", emoji="🍔", color="#f59e0b", bg="#fffbeb",
            img="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
            desc="Park's fastest quick-service spot. Juicy burgers, crispy fries and cold shakes — the ideal fuel for thrill seekers.",
            opening_time="09:00:00", closing_time="22:00:00", status="open", is_featured=True
        )

        r_pizza = Restaurant.objects.create(
            name="Pizza Palace", cuisine="Italian", tagline="Wood-Fired Perfection",
            location="Central Plaza · Zone C", emoji="🍕", color="#ef4444", bg="#fff5f5",
            img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
            desc="Wood-fired pizzas and fresh pastas in a cozy Italian-themed setting at the heart of the park.",
            opening_time="11:00:00", closing_time="21:00:00", status="open", is_featured=False
        )

        r_cafe = Restaurant.objects.create(
            name="Splash Café", cuisine="Café & Beverages", tagline="Cool Drinks & Snacks",
            location="Water Zone Entry · Zone B", emoji="☕", color="#06b6d4", bg="#f0fbfe",
            img="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format",
            desc="Refreshing cold drinks, ice creams and light snacks right at the Water Zone entry — perfect post-ride cool down.",
            opening_time="09:00:00", closing_time="22:00:00", status="open", is_featured=False
        )

        # Seed menu items
        menu_items_data = {
            r_spice: [
                {"name": "Masala Thali", "price": 249, "tag": "Best Seller"},
                {"name": "Paneer Tikka", "price": 179, "tag": "🌶️ Spicy"},
                {"name": "Mango Lassi", "price": 89, "tag": "Refreshing"},
                {"name": "Veg Burger", "price": 129, "tag": "Quick Bite"}
            ],
            r_burger: [
                {"name": "Classic Smash Burger", "price": 199, "tag": "Fan Favourite"},
                {"name": "Cheese Fries", "price": 129, "tag": "Must Try"},
                {"name": "Chocolate Shake", "price": 149, "tag": "Bestseller"},
                {"name": "Chicken Wrap", "price": 179, "tag": "New! 🆕"}
            ],
            r_pizza: [
                {"name": "Margherita Pizza", "price": 299, "tag": "Classic"},
                {"name": "Pepperoni Blast", "price": 379, "tag": "🔥 Hot Pick"},
                {"name": "Pasta Arrabbiata", "price": 249, "tag": "Veg Friendly"},
                {"name": "Garlic Bread", "price": 99, "tag": "Best Starter"}
            ],
            r_cafe: [
                {"name": "Fresh Lemonade", "price": 79, "tag": "Park Favourite"},
                {"name": "Ice Cream Sundae", "price": 129, "tag": "Kids Love It"},
                {"name": "Cold Coffee", "price": 99, "tag": "Bestseller"},
                {"name": "Nachos & Dip", "price": 149, "tag": "Snack Attack"}
            ]
        }

        for rest, items in menu_items_data.items():
            for item in items:
                MenuItem.objects.create(restaurant=rest, **item)

        # -------------------------------------------------------------
        # 4. SEED TICKET TYPES AND GLOBAL CONFIG
        # -------------------------------------------------------------
        self.stdout.write("Seeding Ticket Types & Configurations...")
        
        ticket_types = [
            {"name": "Adult", "base_price": 999, "seasonal_multiplier": 1.00},
            {"name": "Child", "base_price": 699, "seasonal_multiplier": 1.00},
            {"name": "Senior Citizen", "base_price": 799, "seasonal_multiplier": 1.00},
            {"name": "Family Package", "base_price": 2999, "seasonal_multiplier": 0.90},
            {"name": "VIP Pass", "base_price": 1999, "seasonal_multiplier": 1.10},
            {"name": "Fast Track Pass", "base_price": 1499, "seasonal_multiplier": 1.05}
        ]

        for tt in ticket_types:
            TicketType.objects.create(**tt)

        SystemConfig.objects.create(key="gst_percentage", value="18")

        # -------------------------------------------------------------
        # 5. SEED OFFERS & PROMO CODES
        # -------------------------------------------------------------
        self.stdout.write("Seeding Offers & Promo Codes...")
        Offer.objects.all().delete()
        PromoCode.objects.all().delete()

        offers_list = [
            {
                "name": "Monsoon Magic at ThrillVerse",
                "adult_price": 999, "child_price": 699, "senior_price": 799,
                "banner_image": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&h=300&fit=crop&auto=format",
                "description": "Splash into adventure with extra discounts during rainy days!",
                "discount_percentage": 15, "promo_code": "RAINY15",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=90),
                "applicable_ticket": "All",
                "terms_conditions": "Valid only during standard operating hours. Cannot be combined with other offers."
            },
            {
                "name": "Happy Tuesday",
                "adult_price": 899, "child_price": 599, "senior_price": 699,
                "banner_image": "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=300&fit=crop&auto=format",
                "description": "Beat the weekend crowds and enjoy reduced pricing every Tuesday.",
                "discount_percentage": 10, "promo_code": "TUESDAY10",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=180),
                "applicable_ticket": "Adult, Child",
                "terms_conditions": "Valid only on Tuesdays. Not valid on public holidays."
            },
            {
                "name": "Bye Bye Exams",
                "adult_price": 749, "child_price": 549, "senior_price": 599,
                "banner_image": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=300&fit=crop&auto=format",
                "description": "Celebrate the end of exams with our student-exclusive package!",
                "discount_percentage": 20, "promo_code": "EXAMOVER",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=30),
                "applicable_ticket": "Child, Adult",
                "terms_conditions": "Valid Student ID card required at entry gate."
            }
        ]

        seeded_offers = []
        for off in offers_list:
            o_obj = Offer.objects.create(**off)
            seeded_offers.append(o_obj)

        p1 = PromoCode.objects.create(
            code="WELCOME10", discount_type="percentage", discount_value=10.00,
            min_booking_amount=0.00, max_uses=1000, current_uses=42,
            expiry_date=datetime.date(2027, 12, 31), is_active=True
        )
        p1.applicable_offers.add(*seeded_offers)

        p2 = PromoCode.objects.create(
            code="SAVE200", discount_type="flat", discount_value=200.00,
            min_booking_amount=1000.00, max_uses=500, current_uses=18,
            expiry_date=datetime.date(2027, 12, 31), is_active=True
        )
        p2.applicable_offers.add(*seeded_offers)

        # -------------------------------------------------------------
        # 6. SEED MOCK TRANSACTIONS AND ORDERS (FOR DASHBOARD DATA)
        # -------------------------------------------------------------
        self.stdout.write("Simulating Mock Orders & Payment Transactions...")
        
        # Seed restaurant orders for analytics
        today_dt = timezone.now()
        restaurants = [r_spice, r_burger, r_pizza, r_cafe]
        
        for r in restaurants:
            items = r.menu_items.all()
            # Seed orders for the past 7 days
            for d in range(7):
                order_date = today_dt - datetime.timedelta(days=d)
                num_orders = random.randint(5, 20)
                for _ in range(num_orders):
                    item = random.choice(items)
                    qty = random.randint(1, 3)
                    RestaurantOrder.objects.create(
                        restaurant=r,
                        item_name=item.name,
                        price=item.price,
                        quantity=qty,
                        created_at=order_date - datetime.timedelta(hours=random.randint(0, 10))
                    )

        # Seed ticket bookings for analytics
        offers = seeded_offers
        payment_methods = ["UPI", "Credit Card", "Netbanking", "Debit Card"]
        
        # Past 14 days booking stats
        for d in range(14):
            day_date = today_dt - datetime.timedelta(days=d)
            # Create 3-8 bookings per day
            for _ in range(random.randint(3, 8)):
                offer = random.choice(offers)
                qty = random.randint(1, 4)
                subtotal = qty * offer.adult_price
                disc = random.choice([0, 100, 200])
                net = max(0, subtotal - disc)
                gst = int(net * 0.18)
                total = net + gst + 50 # convenience fee
                
                b_id = f"TV-{day_date.strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"
                booking = Booking.objects.create(
                    booking_id=b_id,
                    user=customer_user,
                    offer=offer,
                    visit_date=day_date.date() + datetime.timedelta(days=random.randint(0, 5)),
                    visitor_count=qty,
                    primary_visitor_name="Test Visitor",
                    primary_visitor_email="visitor@example.com",
                    primary_visitor_phone="9876543210",
                    status="checked_in" if d > 0 else "qr_generated",
                    is_checked_in=True if d > 0 else False,
                    checked_in_at=day_date if d > 0 else None,
                    created_at=day_date - datetime.timedelta(hours=random.randint(1, 8))
                )
                
                Invoice.objects.create(
                    invoice_id=f"INV-{uuid.uuid4().hex[:6].upper()}",
                    booking=booking,
                    subtotal=subtotal,
                    convenience_fee=50.00,
                    gst=gst,
                    promo_discount=disc,
                    grand_total=total,
                    created_at=booking.created_at
                )
                
                BookingPayment.objects.create(
                    booking=booking,
                    user=customer_user,
                    razorpay_order_id=f"order_{uuid.uuid4().hex[:12]}",
                    razorpay_payment_id=f"pay_{uuid.uuid4().hex[:12]}",
                    razorpay_signature="sig_verified",
                    amount=total,
                    total_paid=total,
                    payment_status="Paid",
                    payment_method=random.choice(payment_methods),
                    promo_code=p2 if disc > 0 else None,
                    discount_amount=disc,
                    gst_amount=gst,
                    transaction_time=booking.created_at
                )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully! All metrics, rides, restaurants, tickets, and analytics seeded."))
