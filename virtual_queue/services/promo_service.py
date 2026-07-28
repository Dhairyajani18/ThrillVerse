import datetime
from decimal import Decimal
from django.utils import timezone
from virtual_queue.models import PromoCode, Offer

def validate_promo_code(code_str, offer_id, booking_amount):
    """
    Validates a promo code for a given offer and booking amount.
    Returns:
        dict: {"valid": bool, "promo": PromoCode or None, "discount": Decimal, "error": str or None}
    """
    if not code_str:
        return {"valid": False, "promo": None, "discount": Decimal('0.00'), "error": "No promo code provided"}

    try:
        promo = PromoCode.objects.get(code__iexact=code_str, is_active=True)
    except PromoCode.DoesNotExist:
        return {"valid": False, "promo": None, "discount": Decimal('0.00'), "error": "Invalid promo code"}

    # Expiry Check
    today = timezone.localdate()
    if promo.expiry_date < today:
        return {"valid": False, "promo": None, "discount": Decimal('0.00'), "error": "Promo code has expired"}

    # Usage Check
    if promo.current_uses >= promo.max_uses:
        return {"valid": False, "promo": None, "discount": Decimal('0.00'), "error": "Promo code usage limit reached"}

    # Min Booking Amount Check
    booking_amt_dec = Decimal(str(booking_amount))
    if booking_amt_dec < promo.min_booking_amount:
        return {
            "valid": False,
            "promo": None,
            "discount": Decimal('0.00'),
            "error": f"Minimum booking amount for this promo is INR {promo.min_booking_amount}"
        }

    # Offer Specific Check
    if promo.applicable_offers.exists():
        if not promo.applicable_offers.filter(id=offer_id).exists():
            return {
                "valid": False,
                "promo": None,
                "discount": Decimal('0.00'),
                "error": "Promo code is not applicable for this offer"
            }

    # Calculate Discount
    discount = Decimal('0.00')
    if promo.discount_type == 'flat':
        discount = promo.discount_value
    elif promo.discount_type == 'percentage':
        discount = (promo.discount_value / Decimal('100.00')) * booking_amt_dec
    
    # Cap discount at booking amount
    if discount > booking_amt_dec:
        discount = booking_amt_dec

    # Round to 2 decimal places
    discount = discount.quantize(Decimal('0.01'))

    return {
        "valid": True,
        "promo": promo,
        "discount": discount,
        "error": None
    }
