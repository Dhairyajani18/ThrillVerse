from virtual_queue.models import Visitor

def get_ticket_type_by_age(age):
    """
    Categorizes the ticket type automatically based on the visitor's age:
    - Age below 12 -> Child
    - Age 60 or above -> Senior Citizen
    - Otherwise -> Adult
    """
    try:
        age_int = int(age)
    except (ValueError, TypeError):
        return 'Adult'

    if age_int < 12:
        return 'Child'
    elif age_int >= 60:
        return 'Senior Citizen'
    else:
        return 'Adult'


def create_visitors_for_booking(booking, visitors_data):
    """
    Creates individual Visitor records for a Booking.
    visitors_data: list of dicts with: full_name, age, gender, relationship
    """
    visitor_records = []
    
    # 1. Primary visitor (the booking owner/first visitor)
    primary_age = visitors_data[0].get('age')
    primary_ticket_type = get_ticket_type_by_age(primary_age)
    
    primary_visitor = Visitor.objects.create(
        booking=booking,
        full_name=visitors_data[0].get('full_name'),
        age=primary_age,
        gender=visitors_data[0].get('gender'),
        relationship=visitors_data[0].get('relationship', 'Self'),
        ticket_type=primary_ticket_type
    )
    visitor_records.append(primary_visitor)

    # 2. Additional visitors
    for v in visitors_data[1:]:
        age = v.get('age')
        ticket_type = get_ticket_type_by_age(age)
        
        visitor = Visitor.objects.create(
            booking=booking,
            full_name=v.get('full_name'),
            age=age,
            gender=v.get('gender'),
            relationship=v.get('relationship'),
            ticket_type=ticket_type
        )
        visitor_records.append(visitor)

    return visitor_records
