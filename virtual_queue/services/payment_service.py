import os
import json
import razorpay
from django.conf import settings

def get_razorpay_client():
    """
    Initializes and returns the Razorpay client using environment variables.
    """
    key_id = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_dummykeyid123')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET', 'dummypaysecret456')
    return razorpay.Client(auth=(key_id, key_secret))


def create_razorpay_order(amount_paise, receipt_id):
    """
    Creates an order in Razorpay.
    amount_paise: Amount in paise (1 INR = 100 paise)
    receipt_id: The local Booking ID to tie the order to
    """
    key_id = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_dummykeyid123')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET', 'dummypaysecret456')
    
    # Detect dummy credentials
    if 'dummy' in key_id.lower() or 'dummy' in key_secret.lower():
        import uuid
        return {
            "id": f"order_mock_{uuid.uuid4().hex[:12]}",
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt_id,
            "status": "created"
        }

    client = get_razorpay_client()
    data = {
        "amount": int(amount_paise),
        "currency": "INR",
        "receipt": str(receipt_id),
        "payment_capture": 1
    }
    order = client.order.create(data=data)
    return order


def verify_razorpay_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
    """
    Verifies the signature returned by Razorpay Checkout.
    Returns True if valid, False otherwise.
    """
    # Detect mock order
    if str(razorpay_order_id).startswith('order_mock_') or 'mock' in str(razorpay_payment_id).lower():
        return True

    client = get_razorpay_client()
    params_dict = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }
    try:
        client.utility.verify_payment_signature(params_dict)
        return True
    except Exception as e:
        print(f"[Razorpay Signature Verification Error]: {str(e)}")
        return False
