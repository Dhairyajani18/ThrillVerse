import os
import datetime
from decimal import Decimal
from django.db import transaction
from virtual_queue.models import Offer, Booking, Visitor, Invoice, BookingPayment, PromoCode
from .visitor_service import get_ticket_type_by_age
from .promo_service import validate_promo_code
from .payment_service import create_razorpay_order

def generate_sequential_booking_and_invoice_ids():
    """
    Safely generates sequential Booking ID (TV-2026-XXXXXX) and Invoice ID (INV-2026-XXXXXX)
    using select_for_update() inside a transaction to prevent race conditions.
    """
    current_year = 2026 # As requested in sequential formats
    count = Booking.objects.select_for_update().count() + 1
    
    booking_id = f"TV-{current_year}-{str(count).zfill(6)}"
    invoice_id = f"INV-{current_year}-{str(count).zfill(6)}"
    
    # Ensure they are unique in database just in case
    while Booking.objects.filter(booking_id=booking_id).exists():
        count += 1
        booking_id = f"TV-{current_year}-{str(count).zfill(6)}"
        invoice_id = f"INV-{current_year}-{str(count).zfill(6)}"
        
    return booking_id, invoice_id


def create_ticket_booking(user, offer_id, visit_date, primary_visitor_data, additional_visitors_data, promo_code_str=None):
    """
    Creates a new Ticket Booking, calculates price, applies discount,
    generates sequential IDs, creates Razorpay Order, and saves everything inside an atomic transaction.
    """
    try:
        offer = Offer.objects.get(id=offer_id, is_active=True)
    except Offer.DoesNotExist:
        return {"error": "Selected offer is invalid or inactive"}

    # Complete list of visitors (primary first, then additional)
    all_visitors = [primary_visitor_data] + additional_visitors_data
    visitor_count = len(all_visitors)

    # 1. Start atomic transaction
    with transaction.atomic():
        # Get sequential Booking and Invoice IDs
        booking_id, invoice_id = generate_sequential_booking_and_invoice_ids()

        # 2. Calculate subtotal based on dynamic offer pricing
        subtotal = Decimal('0.00')
        for visitor in all_visitors:
            age = visitor.get('age')
            ticket_type = get_ticket_type_by_age(age)
            if ticket_type == 'Child':
                price = offer.child_price
            elif ticket_type == 'Senior Citizen':
                price = offer.senior_price
            else:
                price = offer.adult_price
            subtotal += Decimal(str(price))

        # 3. Handle Promo Code Discount
        discount_amount = Decimal('0.00')
        promo_obj = None
        if promo_code_str:
            val_res = validate_promo_code(promo_code_str, offer.id, subtotal)
            if val_res["valid"]:
                promo_obj = val_res["promo"]
                discount_amount = val_res["discount"]
            else:
                # If a promo code was sent but is invalid, we return the error
                return {"error": val_res["error"]}

        # 4. Calculate Taxes and Fees
        discounted_subtotal = max(Decimal('0.00'), subtotal - discount_amount)
        gst_amount = (Decimal('0.18') * discounted_subtotal).quantize(Decimal('0.01'))
        convenience_fee = Decimal('50.00') # flat fee per booking
        grand_total = discounted_subtotal + gst_amount + convenience_fee

        # 5. Create Booking record
        booking = Booking.objects.create(
            booking_id=booking_id,
            user=user,
            offer=offer,
            visit_date=visit_date,
            visitor_count=visitor_count,
            primary_visitor_name=primary_visitor_data.get('full_name'),
            primary_visitor_email=primary_visitor_data.get('email'),
            primary_visitor_phone=primary_visitor_data.get('phone_number'),
            status='payment_pending'
        )

        # 6. Create Visitor records
        for idx, visitor in enumerate(all_visitors):
            age = visitor.get('age')
            ticket_type = get_ticket_type_by_age(age)
            Visitor.objects.create(
                booking=booking,
                full_name=visitor.get('full_name'),
                age=age,
                gender=visitor.get('gender'),
                relationship='Self' if idx == 0 else visitor.get('relationship', 'Friend'),
                ticket_type=ticket_type
            )

        # 7. Create Invoice record
        Invoice.objects.create(
            invoice_id=invoice_id,
            booking=booking,
            subtotal=subtotal,
            convenience_fee=convenience_fee,
            gst=gst_amount,
            promo_discount=discount_amount,
            grand_total=grand_total
        )

        # 8. Create Razorpay Order
        # Razorpay expects amount in paise (multiply INR by 100)
        amount_paise = int(grand_total * 100)
        try:
            order = create_razorpay_order(amount_paise, booking_id)
        except Exception as e:
            # If Razorpay fails to initialize or create order, roll back
            raise Exception(f"Razorpay order creation failed: {str(e)}")

        # 9. Create BookingPayment record (Pending)
        payment = BookingPayment.objects.create(
            booking=booking,
            user=user,
            razorpay_order_id=order.get('id'),
            amount=grand_total,
            currency="INR",
            promo_code=promo_obj,
            discount_amount=discount_amount,
            gst_amount=gst_amount,
            total_paid=grand_total,
            payment_status='Pending'
        )

        return {
            "booking_id": booking.booking_id,
            "invoice_id": invoice_id,
            "razorpay_order_id": order.get('id'),
            "amount": int(order.get('amount')), # amount in paise
            "currency": order.get('currency'),
            "key_id": os.getenv('RAZORPAY_KEY_ID', 'rzp_test_dummykeyid123')
        }
