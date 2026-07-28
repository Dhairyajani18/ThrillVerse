import base64
import qrcode
from io import BytesIO
from django.core import signing

def generate_secure_booking_token(booking_id, visit_date, visitor_count, user_id):
    """
    Generates a secure cryptographically signed token representing the booking details.
    """
    token_data = {
        "booking_id": booking_id,
        "visit_date": str(visit_date),
        "visitor_count": int(visitor_count),
        "user_id": int(user_id),
        "verified_by": "ThrillVerse Park Entry System"
    }
    # django.core.signing uses the SECRET_KEY to sign the payload securely
    signed_token = signing.dumps(token_data)
    return signed_token


def verify_secure_booking_token(signed_token):
    """
    Verifies the secure signed token.
    Returns:
        dict: The original token data if valid.
        None: If signature is invalid or tampered.
    """
    try:
        data = signing.loads(signed_token)
        return data
    except signing.BadSignature:
        return None


def generate_qr_code_base64(signed_token):
    """
    Generates a QR code image representing the signed token and returns it as a base64 data URI.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=4,
    )
    qr.add_data(signed_token)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    stream = BytesIO()
    img.save(stream, format="PNG")
    qr_base64 = base64.b64encode(stream.getvalue()).decode("utf-8")
    
    return f"data:image/png;base64,{qr_base64}"
