import datetime
import uuid
import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from authentication.models import UserProfile
from virtual_queue.models import (
    Ride, Restaurant, MenuItem, RestaurantOrder, TicketType,
    SystemConfig, Offer, PromoCode, Booking, Visitor, Invoice, BookingPayment, VirtualQueue
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

        admin_user = User.objects.filter(username=admin_username).first() or User.objects.filter(email=admin_email).first()
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
            admin_user.email = admin_email
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
            location="ThrillVerse Castle", emoji="🍛", color="#f97316", bg="#fff7f0",
            img="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format",
            desc="Authentic Indian street food, thalis and refreshing drinks. Located at ThrillVerse Castle.",
            opening_time="10:00:00", closing_time="21:30:00", status="open", is_featured=True
        )
        
        r_burger = Restaurant.objects.create(
            name="Burger Bay", cuisine="Fast Food", tagline="Quick & Tasty Bites",
            location="Family Zone", emoji="🍔", color="#f59e0b", bg="#fffbeb",
            img="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
            desc="Park's fastest quick-service spot. Juicy burgers, crispy fries and cold shakes — located in the Family Zone.",
            opening_time="09:00:00", closing_time="22:00:00", status="open", is_featured=True
        )

        r_pizza = Restaurant.objects.create(
            name="Pizza Palace", cuisine="Italian", tagline="Wood-Fired Perfection",
            location="Water Zone", emoji="🍕", color="#ef4444", bg="#fff5f5",
            img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
            desc="Wood-fired pizzas and fresh pastas in a cozy Italian-themed setting located in the Water Zone.",
            opening_time="11:00:00", closing_time="21:00:00", status="open", is_featured=False
        )

        r_cafe = Restaurant.objects.create(
            name="Splash Café", cuisine="Café & Beverages", tagline="Cool Drinks & Snacks",
            location="Kids Zone", emoji="☕", color="#06b6d4", bg="#f0fbfe",
            img="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format",
            desc="Refreshing cold drinks, ice creams and light snacks located in the Kids Zone.",
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
                "banner_image": "https://images.unsplash.com/photo-1562874662-050427780b20?w=600&h=380&fit=crop&auto=format",
                "description": "Experience the magic of the monsoon at ThrillVerse! Enjoy thrilling rides, water slides, F&B.",
                "discount_percentage": 30, "promo_code": "MONSOON30",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=90),
                "applicable_ticket": "All",
                "terms_conditions": "Valid only during standard operating hours. Cannot be combined with other offers."
            },
            {
                "name": "Happy Tuesday",
                "adult_price": 899, "child_price": 599, "senior_price": 699,
                "banner_image": "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=600&h=380&fit=crop&auto=format",
                "description": "Mega Thrills, Mini Bills! Flat discounted price on Tuesdays for all theme park rides.",
                "discount_percentage": 20, "promo_code": "HAPPYTUES",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=180),
                "applicable_ticket": "Adult, Child",
                "terms_conditions": "Valid only on Tuesdays. Not valid on public holidays."
            },
            {
                "name": "Wat-A-Wednesday",
                "adult_price": 799, "child_price": 599, "senior_price": 649,
                "banner_image": "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=600&h=380&fit=crop&auto=format",
                "description": "Soak the fun this summer with special water park access starting @ ₹799/- only.",
                "discount_percentage": 25, "promo_code": "WATWED799",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=180),
                "applicable_ticket": "Water Park Access",
                "terms_conditions": "Valid only on Wednesdays. Costume rentals available separately."
            },
            {
                "name": "Bye Bye Exams",
                "adult_price": 749, "child_price": 549, "senior_price": 599,
                "banner_image": "https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=600&h=380&fit=crop&auto=format",
                "description": "Exams gone, Life's On! Flat 25% Off for Students with valid student ID card.",
                "discount_percentage": 25, "promo_code": "STUDENT50",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=60),
                "applicable_ticket": "Child, Adult",
                "terms_conditions": "Valid physical Student ID card required at entry gate."
            },
            {
                "name": "Adventure & Savings",
                "adult_price": 899, "child_price": 649, "senior_price": 699,
                "banner_image": "https://images.unsplash.com/photo-1601930113377-729966035f34?w=600&h=380&fit=crop&auto=format",
                "description": "Buy 4 tickets get 1 FREE for all theme park and water park zones.",
                "discount_percentage": 20, "promo_code": "BUY4GET1",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=150),
                "applicable_ticket": "All",
                "terms_conditions": "Get one free ticket for every 4 tickets purchased in a single booking."
            },
            {
                "name": "Golden Hour Pass",
                "adult_price": 599, "child_price": 399, "senior_price": 499,
                "banner_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&auto=format",
                "description": "Experience evening rides under golden sunset skies! Entry from 4:00 PM to park closing.",
                "discount_percentage": 20, "promo_code": "GOLDEN599",
                "start_date": datetime.date.today(),
                "expiry_date": datetime.date.today() + datetime.timedelta(days=120),
                "applicable_ticket": "Evening Pass",
                "terms_conditions": "Valid for entry starting at 4:00 PM until 10:00 PM."
            }
        ]

        seeded_offers = []
        for off in offers_list:
            o_obj = Offer.objects.create(**off)
            seeded_offers.append(o_obj)

        promos_data = [
            {'code': 'HAPPYTUES', 'discount_type': 'percentage', 'discount_value': 20.00, 'min_booking_amount': 0.00},
            {'code': 'WATWED799', 'discount_type': 'flat', 'discount_value': 200.00, 'min_booking_amount': 0.00},
            {'code': 'MONSOON30', 'discount_type': 'percentage', 'discount_value': 30.00, 'min_booking_amount': 0.00},
            {'code': 'MONSOON25', 'discount_type': 'percentage', 'discount_value': 25.00, 'min_booking_amount': 0.00},
            {'code': 'STUDENT50', 'discount_type': 'percentage', 'discount_value': 25.00, 'min_booking_amount': 0.00},
            {'code': 'THRILL20', 'discount_type': 'percentage', 'discount_value': 20.00, 'min_booking_amount': 0.00},
            {'code': 'THRILL50', 'discount_type': 'flat', 'discount_value': 200.00, 'min_booking_amount': 0.00},
            {'code': 'SNOW499', 'discount_type': 'flat', 'discount_value': 100.00, 'min_booking_amount': 0.00},
            {'code': 'BUY4GET1', 'discount_type': 'percentage', 'discount_value': 20.00, 'min_booking_amount': 0.00},
            {'code': 'GOLDEN599', 'discount_type': 'flat', 'discount_value': 150.00, 'min_booking_amount': 0.00},
            {'code': 'WELCOME10', 'discount_type': 'percentage', 'discount_value': 10.00, 'min_booking_amount': 0.00},
            {'code': 'SAVE200', 'discount_type': 'flat', 'discount_value': 200.00, 'min_booking_amount': 0.00},
        ]
        for p in promos_data:
            PromoCode.objects.get_or_create(
                code=p['code'],
                defaults={
                    'discount_type': p['discount_type'],
                    'discount_value': p['discount_value'],
                    'min_booking_amount': p['min_booking_amount'],
                    'max_uses': 1000,
                    'current_uses': 5,
                    'expiry_date': datetime.date(2027, 12, 31),
                    'is_active': True
                }
            )

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
                
        first_promo = PromoCode.objects.filter(code='WELCOME10').first() or PromoCode.objects.first()
        all_users = list(User.objects.all())
        admin_user = User.objects.filter(username='admin').first() or (all_users[0] if all_users else None)
        # Seed ticket booking payments for analytics
        for idx in range(35):
            days_ago = random.randint(0, 14)
            txn_date = today_dt - datetime.timedelta(days=days_ago, hours=random.randint(1, 10))
            offer = random.choice(seeded_offers) if seeded_offers else None
            sub = random.choice([799, 999, 1499, 2199])
            disc = 200 if random.random() > 0.6 else 0
            gst = round((sub - disc) * 0.18, 2)
            total = round(sub - disc + gst + 50, 2)
            
            customer_user = random.choice(all_users) if all_users else admin_user
            
            booking = Booking.objects.create(
                booking_id=f"TV-{uuid.uuid4().hex[:8].upper()}",
                user=customer_user,
                offer=offer,
                visit_date=txn_date.date(),
                primary_visitor_name=customer_user.first_name or customer_user.username,
                primary_visitor_email=customer_user.email,
                primary_visitor_phone="9876543210",
                status="payment_successful"
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
                promo_code=first_promo if disc > 0 else None,
                discount_amount=disc,
                gst_amount=gst,
                transaction_time=booking.created_at
            )

        # Enqueue 25 dummy users into Nitro ride queue
        nitro_ride = Ride.objects.filter(name='Nitro').first()
        if nitro_ride:
            VirtualQueue.objects.filter(ride=nitro_ride).delete()
            for i in range(1, 26):
                u, _ = User.objects.get_or_create(
                    username=f"nitro_rider_{i}",
                    defaults={
                        'email': f"nitro_rider_{i}@example.com",
                        'first_name': f"Rider",
                        'last_name': f"#{i}"
                    }
                )
                u.set_password("nitro123")
                u.save()
                VirtualQueue.objects.create(
                    user=u,
                    ride=nitro_ride,
                    position=i,
                    estimated_wait=i * 2,
                    status="in_queue",
                    email_sent=True
                )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully! All metrics, rides, restaurants, tickets, and analytics seeded."))
