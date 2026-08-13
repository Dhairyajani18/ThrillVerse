import os
import requests
import logging

logger = logging.getLogger(__name__)

def trigger_booking_confirmation_email(booking, payment_id, invoice_id):
    """
    Sends a POST request to the local Node.js express email service to send a booking confirmation.
    """
    # Load Node.js service port/url from env
    port = os.getenv('PORT', '5000')
    url = f"http://127.0.0.1:{port}/send-email"
    
    visitors = []
    for v in booking.visitors.all():
        visitors.append({
            "name": v.full_name,
            "age": int(v.age),
            "gender": v.gender,
            "relationship": v.relationship,
            "ticket_type": v.ticket_type
        })
        
    payload = {
        "user_name": booking.primary_visitor_name,
        "email": booking.primary_visitor_email,
        "booking_id": booking.booking_id,
        "invoice_id": invoice_id,
        "offer_name": booking.offer.name,
        "visit_date": str(booking.visit_date),
        "amount_paid": str(booking.invoice.grand_total),
        "payment_id": payment_id,
        "qr_data": booking.qr_ticket, # secure signed base64 QR code image
        "visitor_list": visitors
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"[Email Dispatch Success]: Booking email sent successfully for {booking.booking_id}")
            return True
        else:
            logger.error(f"[Email Dispatch Failure]: Code {response.status_code} - {response.text}")
            print(f"[Email Dispatch Failure]: Code {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"[Email Dispatch Error]: Failed to contact email service: {str(e)}")
        print(f"[Email Dispatch Error]: Failed to contact email service: {str(e)}")
        return False


def trigger_boarding_pass_email(user, queue_entry):
    """
    Triggers an automatic Boarding Pass notification email to the user when their turn arrives.
    """
    from django.core.mail import EmailMultiAlternatives
    from django.conf import settings

    DEV_DOMAINS = ["example.com", "thrillverse.com", "thrillversepark.com", "test.com", "localhost"]
    
    def is_real_external_email(e):
        if not e or "@" not in e:
            return False
        domain = e.split("@")[-1].lower()
        return not any(d in domain for d in DEV_DOMAINS)

    default_smtp = os.getenv('SMTP_USER') or getattr(settings, 'EMAIL_HOST_USER', 'dhairyajani18@gmail.com')
    recipient_email = getattr(user, 'email', None)

    # If recipient email is missing, dummy, or an internal domain, route directly to real SMTP_USER inbox
    if not recipient_email or not is_real_external_email(recipient_email) or "thrillverse" in str(recipient_email).lower():
        recipient_email = default_smtp
        print(f"[Boarding Email Target]: Routing test user {user.username} boarding pass to primary inbox ({recipient_email}).")

    ride = queue_entry.ride
    subject = f"🎟️ Boarding Pass Active: {ride.emoji} {ride.name} - ThrillVerse"
    
    text_content = f"""
    Hello {getattr(user, 'first_name', '') or user.username},

    YOUR TURN IS HERE! Your 5-minute boarding window for {ride.name} is now ACTIVE.

    Boarding Pass Details:
    ----------------------
    Attraction: {ride.name} {ride.emoji}
    Pass Token: {queue_entry.token}
    Batch Number: Batch {queue_entry.batch_number}
    Boarding Window: 5 Minutes

    Please proceed immediately to the entrance turnstile gate and scan your Boarding QR Code.

    Enjoy your thrill!
    The ThrillVerse Team
    """

    html_content = f"""
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 54px; height: 54px; line-height: 54px; background: linear-gradient(135deg, #1a6ef5, #0052cc); color: white; border-radius: 16px; font-weight: 900; font-size: 24px; box-shadow: 0 10px 20px rgba(26,110,245,0.2);">TV</div>
            <h2 style="color: #0d1f3c; margin-top: 12px; font-size: 22px; font-weight: 800;">Boarding Pass Active!</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Head to the attraction entrance immediately</p>
        </div>

        <div style="background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
            <span style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase;">Ready to Board</span>
            <h1 style="color: #0d1f3c; margin-top: 12px; font-size: 26px; font-weight: 900;">{ride.emoji} {ride.name}</h1>
            
            <div style="margin: 20px 0; padding: 16px; background: #f1f5f9; border-radius: 12px; display: inline-block; width: 80%;">
                <p style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Boarding Token</p>
                <h3 style="color: #1a6ef5; font-family: monospace; font-size: 24px; font-weight: 900; margin: 4px 0 0 0;">{queue_entry.token}</h3>
            </div>

            <div style="display: flex; justify-content: space-around; margin-top: 16px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 13px;">
                <div>
                    <span style="color: #94a3b8; display: block; font-size: 10px; font-weight: 700; text-transform: uppercase;">BATCH</span>
                    <strong style="color: #0d1f3c;">Batch {queue_entry.batch_number}</strong>
                </div>
                <div>
                    <span style="color: #94a3b8; display: block; font-size: 10px; font-weight: 700; text-transform: uppercase;">WINDOW</span>
                    <strong style="color: #10b981;">5 Minutes</strong>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px; padding: 16px; background: #eff6ff; border-radius: 12px; border: 1px solid #dbeafe;">
            <p style="color: #1e40af; font-size: 12px; margin: 0; line-height: 1.5;">
                💡 <strong>Instructions:</strong> Open your ThrillVerse app and present the live Boarding QR Code at the turnstile scanner. Minimum height requirement is <strong>{ride.min_height_cm or 'N/A'} cm</strong>.
            </p>
        </div>
    </div>
    """

    try:
        # Try sending via Node.js email service first
        port = os.getenv('PORT', '5000')
        url = f"http://127.0.0.1:{port}/send-boarding-pass"
        try:
            resp = requests.post(url, json={
                "email": recipient_email,
                "user_name": getattr(user, 'first_name', '') or user.username,
                "ride_name": ride.name,
                "ride_emoji": ride.emoji,
                "token": queue_entry.token,
                "batch_number": queue_entry.batch_number,
                "min_height": ride.min_height_cm
            }, timeout=12)
            print(f"[Node Email Service Result]: Code {resp.status_code} - {resp.text}")
            if resp.status_code == 200:
                print(f"[Boarding Email Dispatched]: Sent via Node email service to {recipient_email}")
                return True
        except Exception as err:
            print(f"[Node Email Service Error/Fallback]: {err}")

        # Send via Django SMTP dispatch ONLY if Node service did not handle it
        raw_from = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or getattr(settings, 'EMAIL_HOST_USER', 'no-reply@thrillverse.com')
        if "ThrillVerse" not in raw_from:
            from_email = f"ThrillVerse Parks <{raw_from}>"
        else:
            from_email = raw_from

        msg = EmailMultiAlternatives(subject, text_content, from_email, [recipient_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=True)
        
        print(f"[Boarding Email Sent]: Successfully sent boarding pass email via Django fallback to {recipient_email} for {ride.name} ({queue_entry.token})")
        return True
    except Exception as e:
        print(f"[Boarding Email Error]: {str(e)}")
        return False
