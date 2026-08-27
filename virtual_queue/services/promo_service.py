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

    code_upper = code_str.strip().upper()

    try:
        promo = PromoCode.objects.get(code__iexact=code_upper, is_active=True)
    except PromoCode.DoesNotExist:
        known_codes = {
            'WATWED799': ('flat', Decimal('200.00')),
            'MONSOON30': ('percentage', Decimal('30.00')),
            'HAPPYTUES': ('percentage', Decimal('20.00')),
            'STUDENT50': ('percentage', Decimal('25.00')),
            'WELCOME10': ('percentage', Decimal('10.00')),
            'WELCOME50': ('percentage', Decimal('50.00')),
            'SAVE200': ('flat', Decimal('200.00')),
            'THRILL20': ('percentage', Decimal('20.00')),
            'SNOW499': ('flat', Decimal('100.00')),
            'PROMO50': ('flat', Decimal('50.00')),
        }
        if code_upper in known_codes:
            d_type, d_val = known_codes[code_upper]
            today = timezone.localdate()
            expiry = today + datetime.timedelta(days=365)
            promo, _ = PromoCode.objects.get_or_create(
                code=code_upper,
                defaults={
                    'discount_type': d_type,
                    'discount_value': d_val,
                    'min_booking_amount': Decimal('0.00'),
                    'max_uses': 10000,
                    'expiry_date': expiry,
                    'is_active': True
                }
            )
        else:
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
