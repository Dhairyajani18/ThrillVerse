import datetime
import json
import uuid
import os
import requests
import random
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db import models
from django.db.models import F, Sum, Avg, Count, Q
from django.db.models.functions import ExtractHour
from django.db import transaction

from .models import (
    Ride, VirtualQueue, QueueSlot, UserQueueStats, Ticket, Payment,
    Offer, PromoCode, Booking, Visitor, Invoice, BookingPayment,
    TicketType, SystemConfig, Restaurant, MenuItem, RestaurantOrder
)
from .serializers import (
    RideSerializer, VirtualQueueSerializer, JoinQueueSerializer,
    QueueDetailSerializer, QueueHistorySerializer, UserQueueStatsSerializer,
    TicketSerializer, PaymentSerializer
)
from .permissions import IsAdminOrStaff, IsQueueOwner
from .views_helper import get_ai_wait_time, calculate_xp, recalculate_positions

# Services
from .services.promo_service import validate_promo_code
from .services.booking_service import create_ticket_booking
from .services.payment_service import verify_razorpay_signature
from .services.qr_service import generate_secure_booking_token, verify_secure_booking_token, generate_qr_code_base64
from .services.email_service import trigger_booking_confirmation_email

# 1. GET /queue/rides/
@api_view(['GET'])
@permission_classes([AllowAny])
def ride_list(request):
    from .queue_engine import get_ride_snapshot
    rides = Ride.objects.all().order_by('id')
    user = request.user if request and request.user.is_authenticated else None
    snapshots = [get_ride_snapshot(ride, user=user) for ride in rides]
    return Response(snapshots)

# 2. GET /queue/rides/<id>/
@api_view(['GET'])
@permission_classes([AllowAny])
def ride_detail(request, pk):
    from .queue_engine import get_ride_snapshot
    try:
        ride = Ride.objects.get(pk=pk)
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
    
    user = request.user if request and request.user.is_authenticated else None
    snapshot = get_ride_snapshot(ride, user=user)
    ride_data = RideSerializer(ride, context={'request': request}).data
    
    return Response({
        "ride": ride_data,
        "queue_snapshot": snapshot
    })

# 3. POST /queue/join/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_queue(request):
    from .queue_engine import assign_next_queue, get_ride_snapshot
    ride_id = request.data.get('ride_id')
    if not ride_id:
        return Response({"error": "ride_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        ride = Ride.objects.get(id=ride_id)
    except Ride.DoesNotExist:
        return Response({"error": "Ride does not exist."}, status=status.HTTP_404_NOT_FOUND)

    queue_entry, err = assign_next_queue(ride, request.user)
    if err:
        return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)

    snapshot = get_ride_snapshot(ride, user=request.user)

    return Response({
        "message": "Queue joined successfully",
        "queue": {
            "id": queue_entry.id,
            "token": queue_entry.token,
            "position": queue_entry.position,
            "batch_number": queue_entry.batch_number,
            "status": queue_entry.status,
            "estimated_wait": queue_entry.estimated_wait,
            "boarding_time": queue_entry.boarding_time.isoformat() if queue_entry.boarding_time else None,
            "ride": {
                "id": ride.id,
                "name": ride.name,
                "emoji": ride.emoji
            },
            "snapshot": snapshot,
            "joined_at": queue_entry.joined_at.isoformat()
        }
    }, status=status.HTTP_201_CREATED)

# 4. GET /queue/my-queue/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_queue(request):
    from .queue_engine import sync_ride_state
    try:
        queue_entry = VirtualQueue.objects.filter(
            user=request.user,
            status__in=['waiting', 'boarding']
        ).first()
        
        if not queue_entry:
            return Response({"error": "No active queue found"}, status=status.HTTP_404_NOT_FOUND)
            
        sync_ride_state(queue_entry.ride)
        serializer = QueueDetailSerializer(queue_entry, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# SSE Stream endpoint GET /queue/stream/
from django.http import StreamingHttpResponse
import time

@api_view(['GET'])
@permission_classes([AllowAny])
def stream_queue_updates(request):
    def event_stream():
        from .queue_engine import get_ride_snapshot
        while True:
            try:
                rides = Ride.objects.all().order_by('id')
                user = request.user if request and request.user.is_authenticated else None
                snapshots = [get_ride_snapshot(ride, user=user) for ride in rides]
                
                payload = json.dumps({"rides": snapshots, "timestamp": timezone.now().isoformat()})
                yield f"data: {payload}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
            time.sleep(1.0)

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response

# 5. DELETE /queue/leave/
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def leave_queue(request):
    queue_entry = VirtualQueue.objects.filter(
        user=request.user,
        status__in=['waiting', 'boarding']
    ).first()
    
    if not queue_entry:
        return Response({"error": "No active queue found"}, status=status.HTTP_404_NOT_FOUND)
        
    old_position = queue_entry.position
    ride = queue_entry.ride
    
    # Cancel queue entry
    queue_entry.status = 'cancelled'
    queue_entry.cancelled_at = timezone.now()
    queue_entry.save()
    
    # Increment user queue stats cancelled_count
    stats, _ = UserQueueStats.objects.get_or_create(user=request.user)
    stats.cancelled_count += 1
    stats.save()
    
    # Recalculate positions for all waiting entries with higher position
    recalculate_positions(ride, old_position)
    
    return Response({"message": "Left queue successfully"}, status=status.HTTP_200_OK)

# 6. POST /queue/complete/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_queue(request):
    queue_id = request.data.get('queue_id')
    
    if queue_id:
        try:
            queue_entry = VirtualQueue.objects.get(pk=queue_id)
        except VirtualQueue.DoesNotExist:
            return Response({"error": "Queue entry not found"}, status=status.HTTP_404_NOT_FOUND)
            
        is_staff = hasattr(request.user, 'profile') and request.user.profile.role in ['Admin', 'Staff']
        if not is_staff and queue_entry.user != request.user:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    else:
        queue_entry = VirtualQueue.objects.filter(
            user=request.user,
            status__in=['waiting', 'boarding']
        ).first()
        if not queue_entry:
            return Response({"error": "No active queue found"}, status=status.HTTP_404_NOT_FOUND)

    if queue_entry.status not in ['waiting', 'boarding']:
        return Response({"error": f"Cannot complete queue with status {queue_entry.status}"}, status=status.HTTP_400_BAD_REQUEST)

    old_position = queue_entry.position
    ride = queue_entry.ride
    user = queue_entry.user
    
    now = timezone.now()
    queue_entry.status = 'completed'
    queue_entry.completed_at = now
    
    # Calculate XP
    xp_earned = calculate_xp(ride, user)
    queue_entry.save()
    
    # Update stats
    stats, _ = UserQueueStats.objects.get_or_create(user=user)
    stats.total_rides += 1
    stats.xp_points += xp_earned
    
    # Wait minutes actual calculation
    wait_time_sec = (now - queue_entry.joined_at).total_seconds()
    wait_time_min = max(1, int(wait_time_sec / 60))
    stats.total_wait_min += wait_time_min
    stats.save()
    
    # Recalculate positions
    recalculate_positions(ride, old_position)
    
    return Response({
        "message": "Boarding confirmed! Enjoy your ride!",
        "xp_earned": xp_earned,
        "total_xp": stats.xp_points
    }, status=status.HTTP_200_OK)

# 9. GET /queue/history/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def queue_history(request):
    status_filter = request.query_params.get('status', 'all')
    limit = int(request.query_params.get('limit', 20))
    
    qs = VirtualQueue.objects.filter(user=request.user)
    if status_filter == 'completed':
        qs = qs.filter(status='completed')
    elif status_filter == 'cancelled':
        qs = qs.filter(status='cancelled')
    
    qs = qs.order_by('-joined_at')[:limit]
    serializer = QueueHistorySerializer(qs, many=True)
    return Response(serializer.data)

# 8. GET /queue/stats/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def queue_stats(request):
    user = request.user
    today_val = timezone.now().date()

    user_tickets = Ticket.objects.filter(user=user)
    total_tickets = user_tickets.count()
    active_tickets = user_tickets.filter(status__in=['active', 'valid']).count()
    upcoming_visits = user_tickets.filter(status__in=['active', 'valid'], valid_date__gte=today_val).count()
    completed_visits = user_tickets.filter(models.Q(status__in=['used', 'completed']) | models.Q(valid_date__lt=today_val, status__in=['active', 'valid'])).count()
    cancelled_tickets = user_tickets.filter(status='cancelled').count()
    total_amount_spent = user_tickets.aggregate(total=models.Sum('price'))['total'] or 0

    user_queues = VirtualQueue.objects.filter(user=user)
    total_ride_bookings = user_queues.count()
    completed_rides = user_queues.filter(status='completed').count()

    stats, _ = UserQueueStats.objects.get_or_create(user=user)
    data = {
        "total_tickets": total_tickets,
        "active_tickets": active_tickets,
        "upcoming_visits": upcoming_visits,
        "completed_visits": completed_visits,
        "total_ride_bookings": total_ride_bookings,
        "completed_rides": completed_rides,
        "cancelled_tickets": cancelled_tickets,
        "total_amount_spent": float(total_amount_spent),
        "total_rides": stats.total_rides,
        "total_wait_min": stats.total_wait_min,
        "average_wait": stats.average_wait,
        "level": stats.level,
        "xp_points": stats.xp_points
    }
    return Response(data)


# --- ADMIN ENDPOINTS (/queue/admin/) ---

# GET /queue/admin/live/
@api_view(['GET'])
@permission_classes([IsAdminOrStaff])
def admin_live_view(request):
    rides = Ride.objects.all()
    data = []
    
    for r in rides:
        queues = VirtualQueue.objects.filter(ride=r, status__in=['waiting', 'boarding']).order_by('position')
        positions_list = []
        for q in queues:
            waited_sec = (timezone.now() - q.joined_at).total_seconds()
            waited_min = max(0, int(waited_sec / 60))
            positions_list.append({
                "user_name": q.user.username,
                "token": q.token,
                "position": q.position,
                "batch_number": q.batch_number,
                "status": q.status,
                "waited_min": waited_min
            })
            
        data.append({
            "ride_id": r.id,
            "ride_name": r.name,
            "ride_emoji": r.emoji,
            "current_batch_number": r.current_batch_number,
            "active_count": len(positions_list),
            "positions": positions_list
        })
        
    return Response(data)

# POST /queue/admin/pause/<ride_id>/
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def admin_pause(request, pk):
    try:
        ride = Ride.objects.get(pk=pk)
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
        
    ride.queue_enabled = False
    ride.save()
    return Response({"message": f"Queue paused for {ride.name}"}, status=status.HTTP_200_OK)

# POST /queue/admin/resume/<ride_id>/
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def admin_resume(request, pk):
    try:
        ride = Ride.objects.get(pk=pk)
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
        
    ride.queue_enabled = True
    ride.save()
    return Response({"message": f"Queue resumed for {ride.name}"}, status=status.HTTP_200_OK)

# POST /queue/admin/clear/<ride_id>/
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def admin_clear(request, pk):
    try:
        ride = Ride.objects.get(pk=pk)
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
        
    waiting_queues = VirtualQueue.objects.filter(ride=ride, status='waiting')
    count = waiting_queues.count()
    
    # Cancel all waiting entries
    waiting_queues.update(status='cancelled', cancelled_at=timezone.now())
    
    # Increment user queue stats cancelled_count for each user
    for q in waiting_queues:
        stats, _ = UserQueueStats.objects.get_or_create(user=q.user)
        stats.cancelled_count += 1
        stats.save()
        
    return Response({"message": f"Queue cleared. {count} entries cancelled."}, status=status.HTTP_200_OK)

# POST /queue/admin/board/<queue_id>/
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def admin_board(request, pk):
    try:
        queue_entry = VirtualQueue.objects.get(pk=pk)
    except VirtualQueue.DoesNotExist:
        return Response({"error": "Queue entry not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if queue_entry.status != 'waiting':
        return Response({"error": f"Queue entry is in {queue_entry.status} status, cannot board"}, status=status.HTTP_400_BAD_REQUEST)
        
    queue_entry.status = 'boarding'
    queue_entry.boarding_time = timezone.now()
    queue_entry.save()
    
    serializer = VirtualQueueSerializer(queue_entry)
    return Response({
        "message": f"Queue token {queue_entry.token} is now boarding",
        "details": serializer.data
    }, status=status.HTTP_200_OK)


import uuid
import datetime
from .models import Ticket, Payment
from .serializers import TicketSerializer, PaymentSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tickets(request):
    tickets = Ticket.objects.filter(user=request.user).order_by('-created_at')
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request):
    ticket_type = request.data.get('ticket_type', 'Full Day Pass')
    price = request.data.get('price', 999)
    payment_method = request.data.get('payment_method', 'UPI')
    holder_name = request.data.get('holder_name', 'Rohan Sharma')
    
    # Parse valid_date from request payload
    valid_date_str = request.data.get('valid_date')
    valid_date = datetime.date.today()
    if valid_date_str:
        try:
            valid_date = datetime.datetime.strptime(valid_date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    # Generate unique ticket ID
    ticket_id = f"TV-2026-{uuid.uuid4().hex[:6].upper()}"
    while Ticket.objects.filter(ticket_id=ticket_id).exists():
        ticket_id = f"TV-2026-{uuid.uuid4().hex[:6].upper()}"
        
    # Generate unique payment ID
    payment_id = f"PAY-{uuid.uuid4().hex[:8].upper()}"
    while Payment.objects.filter(payment_id=payment_id).exists():
        payment_id = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        
    # Create Ticket
    ticket = Ticket.objects.create(
        user=request.user,
        ticket_id=ticket_id,
        ticket_type=ticket_type,
        valid_date=valid_date,
        holder_name=holder_name,
        zones="Water Zone B" if "water" in ticket_type.lower() else "All Zones",
        rides="Unlimited Access",
        price=price,
        status='active'
    )
    
    # Create Payment
    Payment.objects.create(
        user=request.user,
        ticket=ticket,
        payment_id=payment_id,
        amount=price,
        payment_method=payment_method,
        status='success'
    )
    
    serializer = TicketSerializer(ticket)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# GET /queue/notifications/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_list(request):
    notifications = [
        {
            "id": 1,
            "title": "Welcome to ThrillVerse!",
            "desc": "Your ThrillVerse profile is active. Enjoy fast QR ticket entry & virtual queuing.",
            "time": "Just now",
            "tag": "INFO"
        },
        {
            "id": 2,
            "title": "Monsoon Magic Special Discount",
            "desc": "Get 25% off on Weekend Family Passes with code MONSOON25.",
            "time": "Today",
            "tag": "OFFER"
        }
    ]
    return Response(notifications)


# POST /queue/tickets/<int:pk>/cancel/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_ticket(request, pk):
    try:
        ticket = Ticket.objects.get(pk=pk, user=request.user)
    except Ticket.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if ticket.status == 'cancelled':
        return Response({"error": "Ticket is already cancelled"}, status=status.HTTP_400_BAD_REQUEST)
        
    ticket.status = 'cancelled'
    ticket.save()
    return Response({"message": "Ticket cancelled successfully", "ticket_id": ticket.ticket_id})


# --- SEED HELPERS ---
def seed_offers_and_promos():
    # Only seed initial default offers if database has no offers at all
    if Offer.objects.exists():
        return

    # Seed Offers with images and details
    offers = [
        {
            "name": "Monsoon Magic at ThrillVerse",
            "promo_code": "MONSOON30",
            "discount_percentage": 30,
            "banner_image": "https://images.unsplash.com/photo-1562874662-050427780b20?w=600&h=380&fit=crop&auto=format",
            "description": "Experience the magic of the monsoon at ThrillVerse! Enjoy thrilling rides, water slides, F&B.",
            "adult_price": 999, "child_price": 699, "senior_price": 799
        },
        {
            "name": "Happy Tuesday",
            "promo_code": "HAPPYTUES",
            "discount_percentage": 20,
            "banner_image": "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=600&h=380&fit=crop&auto=format",
            "description": "Mega Thrills, Mini Bills! Flat discounted price on Tuesdays for all theme park rides.",
            "adult_price": 999, "child_price": 699, "senior_price": 799
        },
        {
            "name": "Wat-A-Wednesday",
            "promo_code": "WATWED799",
            "discount_percentage": 25,
            "banner_image": "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=600&h=380&fit=crop&auto=format",
            "description": "Soak the fun this summer with special water park access starting @ ₹799/- only.",
            "adult_price": 799, "child_price": 599, "senior_price": 649
        },
        {
            "name": "Bye Bye Exams",
            "promo_code": "STUDENT50",
            "discount_percentage": 25,
            "banner_image": "https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=600&h=380&fit=crop&auto=format",
            "description": "Exams gone, Life's On! Flat 25% Off for Students with valid student ID card.",
            "adult_price": 749, "child_price": 549, "senior_price": 599
        },
        {
            "name": "Adventure & Savings",
            "promo_code": "BUY4GET1",
            "discount_percentage": 20,
            "banner_image": "https://images.unsplash.com/photo-1601930113377-729966035f34?w=600&h=380&fit=crop&auto=format",
            "description": "Buy 4 tickets get 1 FREE for all theme park and water park zones.",
            "adult_price": 899, "child_price": 649, "senior_price": 699
        },
        {
            "name": "Friends and Family Offer",
            "promo_code": "THRILL20",
            "discount_percentage": 10,
            "banner_image": "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=600&h=380&fit=crop&auto=format",
            "description": "Get extra 10% discount when visiting with friends and family.",
            "adult_price": 999, "child_price": 699, "senior_price": 799
        },
        {
            "name": "Snow Park Ticket",
            "promo_code": "SNOW499",
            "discount_percentage": 15,
            "banner_image": "https://images.unsplash.com/photo-1764422474375-97b032a5190d?w=600&h=380&fit=crop&auto=format",
            "description": "Sub-zero snow park entry starting @ ₹499/- with snow gear included.",
            "adult_price": 499, "child_price": 399, "senior_price": 449
        },
    ]
    for o in offers:
        obj, created = Offer.objects.get_or_create(
            name=o["name"],
            defaults={
                "promo_code": o["promo_code"],
                "discount_percentage": o["discount_percentage"],
                "banner_image": o["banner_image"],
                "description": o["description"],
                "adult_price": o["adult_price"],
                "child_price": o["child_price"],
                "senior_price": o["senior_price"],
                "is_active": True
            }
        )
        if not created:
            if not obj.banner_image:
                obj.banner_image = o["banner_image"]
            if not obj.promo_code:
                obj.promo_code = o["promo_code"]
            if not obj.description:
                obj.description = o["description"]
            if not obj.discount_percentage:
                obj.discount_percentage = o["discount_percentage"]
            obj.save()
    
    # Seed Promo Codes
    all_promos = [
        {"code": "WELCOME10", "type": "percentage", "val": 10.00, "min_amt": 0.00},
        {"code": "SAVE200", "type": "flat", "val": 200.00, "min_amt": 500.00},
        {"code": "MONSOON30", "type": "percentage", "val": 30.00, "min_amt": 0.00},
        {"code": "HAPPYTUES", "type": "percentage", "val": 20.00, "min_amt": 0.00},
        {"code": "WATWED799", "type": "flat", "val": 200.00, "min_amt": 0.00},
        {"code": "STUDENT50", "type": "percentage", "val": 25.00, "min_amt": 0.00},
        {"code": "BUY4GET1", "type": "percentage", "val": 20.00, "min_amt": 0.00},
        {"code": "SNOW499", "type": "flat", "val": 100.00, "min_amt": 0.00},
        {"code": "THRILL20", "type": "percentage", "val": 20.00, "min_amt": 0.00},
        {"code": "FOOD50", "type": "flat", "val": 50.00, "min_amt": 0.00},
        {"code": "MERCH15", "type": "percentage", "val": 15.00, "min_amt": 0.00},
        {"code": "SPECIAL15", "type": "percentage", "val": 15.00, "min_amt": 0.00},
    ]

    for p in all_promos:
        PromoCode.objects.get_or_create(
            code=p["code"],
            defaults={
                "discount_type": p["type"],
                "value": p["val"],
                "min_order_amount": p["min_amt"],
                "max_uses": 1000,
                "expiry_date": datetime.date(2027, 12, 31),
                "is_active": True
            }
        )

    # Seed Fixed Admin User
    from django.contrib.auth.models import User
    from authentication.models import UserProfile

    admin_username = "admin#1"
    admin_password = "admin@123$"
    admin_email = "admin@thrillversepark.com"

    admin_user = User.objects.filter(username=admin_username).first()
    if not admin_user:
        admin_user = User.objects.create_user(
            username=admin_username,
            email=admin_email,
            password=admin_password
        )
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()
    else:
        # Reset password to keep it consistent
        admin_user.set_password(admin_password)
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()

    # Ensure profile role is 'Admin'
    profile, _ = UserProfile.objects.get_or_create(user=admin_user)
    profile.role = 'Admin'
    profile.save()


# --- BOOKING & PAYMENTS VIEWS ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_promo(request):
    """
    POST /queue/promo/validate/
    Validates a promo code.
    """
    seed_offers_and_promos()
    code = request.data.get('code')
    offer_id = request.data.get('offer_id')
    booking_amount = request.data.get('booking_amount')

    if not code or not offer_id or booking_amount is None:
        return Response({"error": "Missing code, offer_id, or booking_amount"}, status=status.HTTP_400_BAD_REQUEST)

    res = validate_promo_code(code, offer_id, booking_amount)
    if res["valid"]:
        return Response({
            "valid": True,
            "code": res["promo"].code,
            "discount": str(res["discount"]),
            "discount_type": res["promo"].discount_type,
            "discount_value": str(res["promo"].discount_value)
        }, status=status.HTTP_200_OK)
    
    return Response({
        "valid": False,
        "error": res["error"]
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_offers(request):
    """
    GET /queue/offers/
    Returns list of all active offers with full metadata, banner images & promo codes.
    """
    seed_offers_and_promos()
    offers = Offer.objects.filter(is_active=True).order_by('id')
    data = [{
        "id": o.id,
        "name": o.name,
        "title": o.name,
        "promo_code": o.promo_code,
        "code": o.promo_code,
        "discount_percentage": o.discount_percentage,
        "banner_image": o.banner_image,
        "image": o.banner_image,
        "description": o.description,
        "start_date": str(o.start_date) if o.start_date else None,
        "expiry_date": str(o.expiry_date) if o.expiry_date else None,
        "adult_price": o.adult_price,
        "child_price": o.child_price,
        "senior_price": o.senior_price
    } for o in offers]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking_order(request):
    """
    POST /queue/booking/create/
    Creates the booking in database (Pending) and creates Razorpay Order.
    """
    seed_offers_and_promos()
    offer_id = request.data.get('offer_id')
    visit_date_str = request.data.get('visit_date')
    primary_visitor = request.data.get('primary_visitor')
    additional_visitors = request.data.get('additional_visitors', [])
    promo_code = request.data.get('promo_code')

    if not offer_id or not visit_date_str or not primary_visitor:
        return Response({"error": "Missing offer_id, visit_date, or primary_visitor info"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        visit_date = datetime.datetime.strptime(visit_date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        res = create_ticket_booking(
            user=request.user,
            offer_id=offer_id,
            visit_date=visit_date,
            primary_visitor_data=primary_visitor,
            additional_visitors_data=additional_visitors,
            promo_code_str=promo_code
        )

        if isinstance(res, dict) and "error" in res:
            return Response({"error": res["error"]}, status=status.HTTP_400_BAD_REQUEST)

        return Response(res, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": f"Booking Order Creation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_booking_payment(request):
    """
    POST /queue/booking/verify/
    Verifies signature and finalizes booking/invoice/payment state,
    generates secure signed QR, triggers Node email confirmation.
    """
    booking_id = request.data.get('booking_id')
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')
    raw_response = request.data.get('raw_response', {})

    if not booking_id or not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
        return Response({"error": "Missing required signature verification fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        booking = Booking.objects.get(booking_id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    # 1. Verify Payment Signature
    is_valid = verify_razorpay_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if not is_valid:
        booking.status = 'payment_pending' # keep pending or mark failed
        booking.save()
        
        # Mark payment failed
        payment = BookingPayment.objects.filter(booking=booking, razorpay_order_id=razorpay_order_id).first()
        if payment:
            payment.payment_status = 'Failed'
            payment.raw_response_json = json.dumps(raw_response)
            payment.save()
            
        return Response({"error": "Payment signature verification failed"}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Update states to paid
    with transaction.atomic():
        booking.status = 'payment_successful'
        booking.save()

        # Update BookingPayment
        payment = BookingPayment.objects.filter(booking=booking, razorpay_order_id=razorpay_order_id).first()
        if payment:
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.payment_status = 'Paid'
            payment.raw_response_json = json.dumps(raw_response)
            payment.save()
            
            # Increment promo code uses if applicable
            if payment.promo_code:
                pc = payment.promo_code
                pc.current_uses += 1
                pc.save()

        # 3. Generate Secure QR Ticket
        signed_token = generate_secure_booking_token(
            booking_id=booking.booking_id,
            visit_date=booking.visit_date,
            visitor_count=booking.visitor_count,
            user_id=request.user.id
        )
        qr_image_base64 = generate_qr_code_base64(signed_token)
        booking.qr_ticket = qr_image_base64
        booking.status = 'qr_generated'
        booking.save()

        # 4. Automatically create Ticket model records so they show in "My Booked Passes"
        invoice = booking.invoice
        ticket_id = f"TV-2026-{uuid.uuid4().hex[:6].upper()}"
        while Ticket.objects.filter(ticket_id=ticket_id).exists():
            ticket_id = f"TV-2026-{uuid.uuid4().hex[:6].upper()}"
            
        Ticket.objects.create(
            user=request.user,
            ticket_id=ticket_id,
            ticket_type=booking.offer.name,
            valid_date=booking.visit_date,
            holder_name=booking.primary_visitor_name,
            zones="All Zones",
            rides="Unlimited Access",
            price=int(invoice.grand_total),
            status='active'
        )

    # 5. Trigger Node Email Service asynchronously (or in backend)
    email_res = trigger_booking_confirmation_email(booking, razorpay_payment_id, invoice.invoice_id)
    if email_res:
        booking.status = 'email_sent'
        booking.save()

    return Response({
        "status": "success",
        "message": "Payment verified and booking completed successfully",
        "booking_id": booking.booking_id,
        "invoice_id": invoice.invoice_id,
        "payment_id": razorpay_payment_id,
        "visit_date": str(booking.visit_date),
        "visitor_count": booking.visitor_count,
        "amount_paid": str(invoice.grand_total)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def scan_qr_checkin(request):
    """
    POST /queue/booking/check-in/
    Scans secure signed token at park entrance.
    Checks in the booking. Prevents duplicate checks.
    """
    signed_token = request.data.get('signed_token')
    if not signed_token:
        return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

    data = verify_secure_booking_token(signed_token)
    if not data:
        return Response({"error": "Invalid ticket token / signature verification failed"}, status=status.HTTP_400_BAD_REQUEST)

    booking_id = data.get('booking_id')
    
    # 1. Try to find a Booking
    booking = Booking.objects.filter(booking_id=booking_id).first()
    if booking:
        if booking.is_checked_in:
            return Response({
                "error": "Ticket Already Used",
                "checked_in_at": booking.checked_in_at.isoformat() if booking.checked_in_at else ""
            }, status=status.HTTP_400_BAD_REQUEST)

        # Perform checkin
        booking.is_checked_in = True
        booking.checked_in_at = timezone.now()
        booking.status = 'checked_in'
        booking.save()

        # Update any corresponding ticket model status to used
        Ticket.objects.filter(user=booking.user, valid_date=booking.visit_date).update(status='used')

        return Response({
            "message": "Check-in Successful! Welcome to ThrillVerse!",
            "booking_id": booking.booking_id,
            "visit_date": str(booking.visit_date),
            "visitor_count": booking.visitor_count,
            "checked_in_at": booking.checked_in_at.isoformat()
        }, status=status.HTTP_200_OK)

    # 2. Try to find a Ticket
    ticket = Ticket.objects.filter(ticket_id=booking_id).first()
    if ticket:
        if ticket.status == 'used':
            return Response({
                "error": "Ticket Already Used",
                "checked_in_at": ticket.valid_date.isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)

        ticket.status = 'used'
        ticket.save()

        return Response({
            "message": "Check-in Successful! Welcome to ThrillVerse!",
            "booking_id": ticket.ticket_id,
            "visit_date": str(ticket.valid_date),
            "visitor_count": 1,
            "checked_in_at": timezone.now().isoformat()
        }, status=status.HTTP_200_OK)

    return Response({"error": "Booking or Ticket not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_booking_email(request, booking_id):
    """
    POST /queue/bookings/<booking_id>/resend-email/
    Resends confirmation email.
    """
    try:
        booking = Booking.objects.get(booking_id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status not in ['qr_generated', 'email_sent', 'checked_in', 'completed']:
        return Response({"error": "Booking payment has not been successfully verified yet"}, status=status.HTTP_400_BAD_REQUEST)

    payment = BookingPayment.objects.filter(booking=booking, payment_status='Paid').first()
    payment_id = payment.razorpay_payment_id if payment else "RESEND_N_A"

    email_res = trigger_booking_confirmation_email(booking, payment_id, booking.invoice.invoice_id)
    if email_res:
        booking.status = 'email_sent'
        booking.save()
        return Response({"message": "Booking confirmation email resent successfully"}, status=status.HTTP_200_OK)
    
    return Response({"error": "Email dispatch failed. Please check SMTP settings or try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bookings(request):
    """
    GET /queue/bookings/
    Returns booking history details for current authenticated user.
    """
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    data = []
    for b in bookings:
        invoice = getattr(b, 'invoice', None)
        payment = BookingPayment.objects.filter(booking=b).order_by('-transaction_time').first()
        
        visitors = [{
            "full_name": v.full_name,
            "age": v.age,
            "gender": v.gender,
            "relationship": v.relationship,
            "ticket_type": v.ticket_type
        } for v in b.visitors.all()]
        
        data.append({
            "booking_id": b.booking_id,
            "offer": b.offer.name,
            "visit_date": str(b.visit_date),
            "visitor_count": b.visitor_count,
            "primary_visitor_name": b.primary_visitor_name,
            "primary_visitor_email": b.primary_visitor_email,
            "primary_visitor_phone": b.primary_visitor_phone,
            "status": b.status,
            "is_checked_in": b.is_checked_in,
            "checked_in_at": b.checked_in_at.isoformat() if b.checked_in_at else None,
            "qr_ticket": b.qr_ticket,
            "visitors": visitors,
            "invoice": {
                "invoice_id": invoice.invoice_id if invoice else "",
                "subtotal": str(invoice.subtotal) if invoice else "0.00",
                "convenience_fee": str(invoice.convenience_fee) if invoice else "50.00",
                "gst": str(invoice.gst) if invoice else "0.00",
                "promo_discount": str(invoice.promo_discount) if invoice else "0.00",
                "grand_total": str(invoice.grand_total) if invoice else "0.00"
            } if invoice else None,
            "payment": {
                "payment_status": payment.payment_status if payment else "Pending",
                "razorpay_payment_id": payment.razorpay_payment_id if payment else None,
                "transaction_time": payment.transaction_time.isoformat() if payment else None
            } if payment else None
        })
    return Response(data)


# --- ADMIN PAYMENT ANALYTICS ---

@api_view(['GET'])
@permission_classes([IsAdminOrStaff])
def admin_payment_analytics(request):
    """
    GET /queue/admin/payment-analytics/
    Returns dashboard metrics and aggregate charts data.
    """
    today = timezone.localdate()
    start_of_week = today - datetime.timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)
    
    # 1. Totals Metrics
    total_rev_agg = BookingPayment.objects.filter(payment_status='Paid').aggregate(total=Sum('amount'))
    total_revenue = float(total_rev_agg['total'] or 0.0)
    
    today_rev_agg = BookingPayment.objects.filter(payment_status='Paid', transaction_time__date=today).aggregate(total=Sum('amount'))
    today_revenue = float(today_rev_agg['total'] or 0.0)
    
    weekly_rev_agg = BookingPayment.objects.filter(payment_status='Paid', transaction_time__date__gte=start_of_week).aggregate(total=Sum('amount'))
    weekly_revenue = float(weekly_rev_agg['total'] or 0.0)
    
    monthly_rev_agg = BookingPayment.objects.filter(payment_status='Paid', transaction_time__date__gte=start_of_month).aggregate(total=Sum('amount'))
    monthly_revenue = float(monthly_rev_agg['total'] or 0.0)
    
    # Successful, failed, pending counts
    successful_payments = BookingPayment.objects.filter(payment_status='Paid').count()
    failed_payments = BookingPayment.objects.filter(payment_status='Failed').count()
    pending_payments = BookingPayment.objects.filter(payment_status='Pending').count()
    refund_count = BookingPayment.objects.filter(payment_status='Refunded').count()
    
    today_visitors_agg = Booking.objects.filter(status__in=['qr_generated', 'email_sent', 'checked_in', 'completed'], visit_date=today).aggregate(visitors=Sum('visitor_count'))
    today_visitors = today_visitors_agg['visitors'] or 0
    
    today_bookings = Booking.objects.filter(status__in=['qr_generated', 'email_sent', 'checked_in', 'completed'], created_at__date=today).count()
    
    # Average Ticket Value
    avg_val_agg = BookingPayment.objects.filter(payment_status='Paid').aggregate(avg=Avg('amount'))
    average_ticket_value = float(avg_val_agg['avg'] or 0.0)
    
    # 2. Charts Data
    # Revenue by Offer
    revenue_by_offer = []
    offers = Offer.objects.all()
    for o in offers:
        rev = BookingPayment.objects.filter(payment_status='Paid', booking__offer=o).aggregate(total=Sum('amount'))['total'] or 0
        if rev > 0:
            revenue_by_offer.append({
                "offer_name": o.name,
                "revenue": float(rev)
            })
            
    # Revenue by Month (current year)
    revenue_by_month = []
    for month in range(1, 13):
        m_rev = BookingPayment.objects.filter(payment_status='Paid', transaction_time__year=2026, transaction_time__month=month).aggregate(total=Sum('amount'))['total'] or 0
        month_name = datetime.date(2026, month, 1).strftime('%B')
        revenue_by_month.append({
            "month": month_name,
            "revenue": float(m_rev)
        })
        
    # Popular Offers (visitor count share)
    popular_offers = []
    for o in offers:
        visitors = Booking.objects.filter(status__in=['qr_generated', 'email_sent', 'checked_in', 'completed'], offer=o).aggregate(total=Sum('visitor_count'))['total'] or 0
        if visitors > 0:
            popular_offers.append({
                "offer_name": o.name,
                "visitors": int(visitors)
            })
            
    # Payment Success Rate
    total_payment_attempts = successful_payments + failed_payments
    success_rate = 100.0
    if total_payment_attempts > 0:
        success_rate = round((successful_payments / total_payment_attempts) * 100.0, 2)
        
    # Peak Booking Hours (Hour of Day)
    peak_booking_hours = []
    hour_stats = Booking.objects.filter(status__in=['qr_generated', 'email_sent', 'checked_in', 'completed']).annotate(hour=ExtractHour('created_at')).values('hour').annotate(count=Count('id')).order_by('hour')
    for h in hour_stats:
        peak_booking_hours.append({
            "hour": f"{h['hour']:02d}:00",
            "count": h['count']
        })
        
    # Peak Visit Dates (Upcoming Week)
    peak_visit_dates = []
    date_stats = Booking.objects.filter(status__in=['qr_generated', 'email_sent', 'checked_in', 'completed'], visit_date__gte=today).values('visit_date').annotate(visitors=Sum('visitor_count')).order_by('visit_date')[:7]
    for d in date_stats:
        peak_visit_dates.append({
            "date": d['visit_date'].strftime('%d %b'),
            "visitors": int(d['visitors'])
        })
        
    # Cancelled / Failed Bookings
    cancelled_bookings = Booking.objects.filter(status='cancelled').count()
    
    # Promo code usage metrics
    promo_usage = []
    promos = PromoCode.objects.all()
    for p in promos:
        if p.current_uses > 0:
            promo_usage.append({
                "code": p.code,
                "uses": p.current_uses
            })

    # Additional Analytics:
    # 1. Ride Popularity
    ride_popularity = []
    for ride in Ride.objects.all():
        count = VirtualQueue.objects.filter(ride=ride, status='completed').count()
        ride_popularity.append({
            "ride_name": ride.name,
            "completed_queues": count
        })
    ride_popularity = sorted(ride_popularity, key=lambda x: x["completed_queues"], reverse=True)[:6]

    # 2. Zone distribution
    zone_distribution = []
    cat_map = {
        'thrill': 'Thriller Zone',
        'water': 'Water Zone',
        'family': 'Family Zone',
        'kids': 'Kids Zone',
        'vr': 'VR Zone'
    }
    for cat_code, cat_name in cat_map.items():
        v_count = VirtualQueue.objects.filter(ride__category=cat_code, status__in=['waiting', 'boarding']).count()
        zone_distribution.append({
            "zone_name": cat_name,
            "visitors_count": max(10, v_count * 12 + random.randint(5, 30))
        })

    # 3. Restaurant Revenue
    restaurant_revenue = []
    for rest in Restaurant.objects.all():
        rev = RestaurantOrder.objects.filter(restaurant=rest).aggregate(total=Sum(F('price') * F('quantity')))['total'] or 0
        orders_count = RestaurantOrder.objects.filter(restaurant=rest).count()
        restaurant_revenue.append({
            "restaurant_name": rest.name,
            "revenue": float(rev),
            "orders": orders_count
        })

    # 4. Daily Revenue
    daily_revenue = []
    for i in range(7):
        day_date = today - datetime.timedelta(days=i)
        rev = BookingPayment.objects.filter(payment_status='Paid', transaction_time__date=day_date).aggregate(total=Sum('amount'))['total'] or 0
        daily_revenue.append({
            "date": day_date.strftime('%a, %d %b'),
            "revenue": float(rev)
        })
    daily_revenue.reverse()
    
    # 5. Live Activity Feed
    activity_feed = []
    recent_bookings = Booking.objects.all().order_by('-created_at')[:8]
    for b in recent_bookings:
        activity_feed.append({
            "id": f"act-b-{b.booking_id}",
            "type": "ticket_purchased",
            "message": f"Ticket purchased by {b.primary_visitor_name} ({b.visitor_count} visitors)",
            "timestamp": b.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    recent_checkins = Booking.objects.filter(status='checked_in').order_by('-checked_in_at')[:5]
    for b in recent_checkins:
        activity_feed.append({
            "id": f"act-c-{b.booking_id}",
            "type": "visitor_checked_in",
            "message": f"Visitor checked in: {b.primary_visitor_name} at entrance gate",
            "timestamp": b.checked_in_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    activity_feed = sorted(activity_feed, key=lambda x: x["timestamp"], reverse=True)[:10]
            
    return Response({
        "totals": {
            "total_revenue": total_revenue,
            "today_revenue": today_revenue,
            "weekly_revenue": weekly_revenue,
            "monthly_revenue": monthly_revenue,
            "successful_payments": successful_payments,
            "failed_payments": failed_payments,
            "pending_payments": pending_payments,
            "refund_count": refund_count,
            "today_visitors": today_visitors,
            "today_bookings": today_bookings,
            "average_ticket_value": average_ticket_value,
            "success_rate": success_rate,
            "cancelled_bookings": cancelled_bookings
        },
        "charts": {
            "revenue_by_offer": revenue_by_offer,
            "revenue_by_month": revenue_by_month,
            "popular_offers": popular_offers,
            "peak_booking_hours": peak_booking_hours,
            "peak_visit_dates": peak_visit_dates,
            "promo_usage": promo_usage,
            "ride_popularity": ride_popularity,
            "zone_distribution": zone_distribution,
            "restaurant_revenue": restaurant_revenue,
            "daily_revenue": daily_revenue,
            "activity_feed": activity_feed
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminOrStaff])
def admin_transactions(request):
    """
    GET /queue/admin/transactions/
    Returns list of all payment transactions for tabular view.
    """
    payments = BookingPayment.objects.all().order_by('-transaction_time')
    data = []
    for p in payments:
        data.append({
            "booking_id": p.booking.booking_id,
            "invoice_id": p.booking.invoice.invoice_id if hasattr(p.booking, 'invoice') else "",
            "user_name": p.user.username,
            "visitor_count": p.booking.visitor_count,
            "offer_name": p.booking.offer.name,
            "visit_date": str(p.booking.visit_date),
            "amount": float(p.amount),
            "promo_code": p.promo_code.code if p.promo_code else "None",
            "discount": float(p.discount_amount),
            "gst": float(p.gst_amount),
            "total_paid": float(p.total_paid),
            "payment_status": p.payment_status,
            "razorpay_payment_id": p.razorpay_payment_id or "N/A",
            "razorpay_order_id": p.razorpay_order_id,
            "transaction_date": p.transaction_time.strftime('%Y-%m-%d %H:%M:%S')
        })
    return Response(data)


# --- ADDITIONAL ADMIN VIEWS & SERIALIZERS ---
from rest_framework import serializers

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    class Meta:
        model = Restaurant
        fields = '__all__'

class AdminOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

# 1. Update Ride Details
@api_view(['PUT'])
@permission_classes([IsAdminOrStaff])
def admin_update_ride(request, pk):
    try:
        ride = Ride.objects.get(pk=pk)
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

    for field in ['status', 'opening_time', 'closing_time', 'min_height_cm', 'capacity', 
                  'duration_minutes', 'safety_instructions', 'maintenance_notes', 
                  'expected_reopening_date', 'img', 'queue_enabled']:
        if field in request.data:
            val = request.data.get(field)
            if val == "":
                val = None
            setattr(ride, field, val)
    
    if request.data.get('status') == 'maintenance':
        waiting_queues = VirtualQueue.objects.filter(ride=ride, status='waiting')
        count = waiting_queues.count()
        waiting_queues.update(status='cancelled', cancelled_at=timezone.now())
        
        for q in waiting_queues:
            stats, _ = UserQueueStats.objects.get_or_create(user=q.user)
            stats.cancelled_count += 1
            stats.save()

    ride.save()
    return Response({"message": "Ride updated successfully", "ride": RideSerializer(ride).data})


# 2. Restaurants list & details
@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_list(request):
    restaurants = Restaurant.objects.all().order_by('id')
    data = []
    for r in restaurants:
        r_data = RestaurantSerializer(r).data
        today_orders = RestaurantOrder.objects.filter(restaurant=r, created_at__date=timezone.localdate()).count()
        today_rev = RestaurantOrder.objects.filter(restaurant=r, created_at__date=timezone.localdate()).aggregate(total=Sum(F('price') * F('quantity')))['total'] or 0
        most_ordered = RestaurantOrder.objects.filter(restaurant=r).values('item_name').annotate(count=Count('id')).order_by('-count').first()
        
        # Calculate wait time
        wait_map = {
            "Spice Arena": "12 min",
            "Burger Bay": "5 min",
            "Pizza Palace": "15 min",
            "Splash Café": "8 min"
        }
        wait_val = wait_map.get(r.name, "10 min")
        if today_orders > 10:
            try:
                base_mins = int(wait_val.split(' ')[0])
                wait_val = f"{base_mins + 5} min"
            except Exception:
                pass

        # Calculate user-friendly hours string
        hours_str = f"{r.opening_time.strftime('%I:%M %p')} – {r.closing_time.strftime('%I:%M %p')}" if r.opening_time else "10:00 AM – 10:00 PM"
        
        # Price range mapping
        price_map = {
            "Spice Arena": "₹150 – ₹400",
            "Burger Bay": "₹80 – ₹350",
            "Pizza Palace": "₹180 – ₹500",
            "Splash Café": "₹60 – ₹250"
        }
        price_range = price_map.get(r.name, "₹100 – ₹300")

        r_data.update({
            "today_orders": today_orders,
            "today_revenue": float(today_rev),
            "most_ordered_food": most_ordered['item_name'] if most_ordered else "None",
            "wait": wait_val,
            "hours": hours_str,
            "priceRange": price_range
        })
        data.append(r_data)
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAdminOrStaff])
def admin_update_restaurant(request, pk):
    try:
        res = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    for field in ['desc', 'opening_time', 'closing_time', 'status', 'is_featured', 'img', 'menu_img', 'cuisine', 'tagline']:
        if field in request.data:
            setattr(res, field, request.data.get(field))
    
    if 'menu_items' in request.data:
        menu_items_data = request.data.get('menu_items')
        if isinstance(menu_items_data, list):
            for item_data in menu_items_data:
                item_id = item_data.get('id')
                if item_id:
                    try:
                        m_item = MenuItem.objects.get(id=item_id, restaurant=res)
                        m_item.name = item_data.get('name', m_item.name)
                        m_item.price = item_data.get('price', m_item.price)
                        m_item.tag = item_data.get('tag', m_item.tag)
                        m_item.is_available = item_data.get('is_available', m_item.is_available)
                        m_item.save()
                    except MenuItem.DoesNotExist:
                        pass
                else:
                    MenuItem.objects.create(
                        restaurant=res,
                        name=item_data['name'],
                        price=item_data['price'],
                        tag=item_data.get('tag', ''),
                        is_available=item_data.get('is_available', True)
                    )

    res.save()
    return Response({"message": "Restaurant updated successfully", "restaurant": RestaurantSerializer(res).data})


# 3. Ticket Types & System Config
@api_view(['GET'])
@permission_classes([IsAdminOrStaff])
def admin_ticket_types(request):
    tts = TicketType.objects.all().order_by('id')
    serializer = TicketTypeSerializer(tts, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminOrStaff])
def admin_update_ticket_type(request, pk):
    try:
        tt = TicketType.objects.get(pk=pk)
    except TicketType.DoesNotExist:
        return Response({"error": "Ticket type not found"}, status=status.HTTP_404_NOT_FOUND)

    for field in ['base_price', 'is_enabled', 'seasonal_multiplier']:
        if field in request.data:
            setattr(tt, field, request.data.get(field))
    
    tt.save()
    return Response({"message": "Ticket type updated successfully", "ticket_type": TicketTypeSerializer(tt).data})

@api_view(['GET', 'PUT'])
@permission_classes([IsAdminOrStaff])
def admin_system_config(request):
    if request.method == 'GET':
        configs = SystemConfig.objects.all()
        data = {c.key: c.value for c in configs}
        if 'gst_percentage' not in data:
            c, _ = SystemConfig.objects.get_or_create(key='gst_percentage', defaults={'value': '18'})
            data['gst_percentage'] = c.value
        return Response(data)
        
    elif request.method == 'PUT':
        for key, val in request.data.items():
            c, _ = SystemConfig.objects.get_or_create(key=key)
            c.value = str(val)
            c.save()
        configs = SystemConfig.objects.all()
        return Response({c.key: c.value for c in configs})


# 4. Offers Operations
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def admin_create_offer(request):
    data = request.data.copy()
    if 'adult_price' not in data or data['adult_price'] is None or data['adult_price'] == '':
        data['adult_price'] = 999
    if 'child_price' not in data or data['child_price'] is None or data['child_price'] == '':
        data['child_price'] = 699
    if 'senior_price' not in data or data['senior_price'] is None or data['senior_price'] == '':
        data['senior_price'] = 799

    for date_field in ['start_date', 'expiry_date']:
        if date_field in data and (data[date_field] is None or data[date_field] == ''):
            data[date_field] = None

    serializer = AdminOfferSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminOrStaff])
def admin_manage_offer(request, pk):
    try:
        offer = Offer.objects.get(pk=pk)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AdminOfferSerializer(offer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        offer.delete()
        return Response({"message": "Offer deleted successfully"})


# 5. Broadcast Email Trigger
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def admin_broadcast_email(request):
    template = request.data.get('template_name')
    subject = request.data.get('subject', 'ThrillVerse Update')
    custom_message = request.data.get('custom_message', '')
    
    users = User.objects.all()
    emails = list(users.values_list('email', flat=True))
    emails = [e for e in emails if e]
    
    if not emails:
        return Response({"error": "No recipient emails found"}, status=status.HTTP_400_BAD_REQUEST)
        
    port = os.getenv('PORT', '5000')
    url = f"http://127.0.0.1:{port}/send-broadcast"
    
    payload = {
        "template": template,
        "subject": subject,
        "message": custom_message,
        "recipients": emails
    }
    
    try:
        res = requests.post(url, json=payload, timeout=15)
        if res.status_code == 200:
            return Response({"message": f"Broadcast successfully sent to {len(emails)} users."})
        else:
            return Response({"error": f"Email service error: {res.text}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"error": f"Failed to contact email service: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

