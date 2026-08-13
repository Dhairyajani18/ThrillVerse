import datetime
import math
from django.utils import timezone
from django.db import models, transaction
from .models import Ride, VirtualQueue, UserQueueStats

import threading

def _dispatch_async_email(user, queue_entry):
    try:
        from .services.email_service import trigger_boarding_pass_email
        trigger_boarding_pass_email(user, queue_entry)
        queue_entry.email_sent = True
        queue_entry.save(update_fields=['email_sent'])
    except Exception as e:
        print(f"Async boarding email error: {e}")

def sync_ride_state(ride):
    """
    Synchronizes ride cycle state based on continuous UTC timestamp.
    Advances completed batches, transitions waiting queues into boarding,
    and updates completed rides for past batch users.
    """
    now = timezone.now()
    
    if ride.status in ['maintenance', 'closed']:
        return {
            "phase": ride.status,
            "phase_remaining_seconds": 0,
            "cycle_remaining_seconds": 0,
            "completed_cycles": 0
        }

    duration = ride.duration_seconds or 180
    loading = ride.loading_seconds or 120
    cycle_time = duration + loading

    if not ride.current_cycle_start_time:
        ride.current_cycle_start_time = now

    elapsed = (now - ride.current_cycle_start_time).total_seconds()
    completed_cycles = int(elapsed // cycle_time)

    if completed_cycles > 0:
        with transaction.atomic():
            old_batch = ride.current_batch_number
            ride.current_batch_number += completed_cycles
            ride.current_cycle_start_time += datetime.timedelta(seconds=completed_cycles * cycle_time)
            
            # 1. Mark queues from past batches as completed
            past_queues = VirtualQueue.objects.filter(
                ride=ride,
                batch_number__lt=ride.current_batch_number,
                status__in=['waiting', 'boarding']
            )
            for q in past_queues:
                q.status = 'completed'
                q.completed_at = now
                q.save(update_fields=['status', 'completed_at'])
                
                # Update user stats
                stats, _ = UserQueueStats.objects.get_or_create(user=q.user)
                stats.total_rides += 1
                stats.total_wait_min += q.estimated_wait or 5
                stats.xp_points += 50
                stats.save()

            # 2. Mark current batch queues as boarding & dispatch Boarding Pass email asynchronously
            current_queues = VirtualQueue.objects.filter(
                ride=ride,
                batch_number=ride.current_batch_number,
                status='waiting'
            )
            for q in current_queues:
                q.status = 'boarding'
                q.boarding_time = now
                q.save(update_fields=['status', 'boarding_time'])
                if not q.email_sent:
                    threading.Thread(target=_dispatch_async_email, args=(q.user, q), daemon=True).start()
            
            elapsed = (now - ride.current_cycle_start_time).total_seconds()

    time_in_cycle = elapsed % cycle_time
    if time_in_cycle < loading:
        phase = 'boarding'
        phase_remaining_seconds = int(loading - time_in_cycle)
    else:
        phase = 'riding'
        phase_remaining_seconds = int(cycle_time - time_in_cycle)

    cycle_remaining_seconds = int(cycle_time - time_in_cycle)
    
    if ride.current_phase != phase:
        ride.current_phase = phase

    ride.save(update_fields=['current_batch_number', 'current_cycle_start_time', 'current_phase'])

    return {
        "phase": phase,
        "phase_remaining_seconds": max(0, phase_remaining_seconds),
        "cycle_remaining_seconds": max(0, cycle_remaining_seconds),
        "completed_cycles": completed_cycles
    }


def calculate_wait_time(ride, user_batch):
    """
    Formula:
    Estimated Wait Time = Current Ride Remaining Time + (Number of Full Batches Ahead * Ride Cycle Time)
    """
    sync_ride_state(ride)
    current_batch = ride.current_batch_number
    duration = ride.duration_seconds or 180
    loading = ride.loading_seconds or 120
    cycle_time = duration + loading

    now = timezone.now()
    if not ride.current_cycle_start_time:
        ride.current_cycle_start_time = now

    elapsed = (now - ride.current_cycle_start_time).total_seconds()
    cycle_remaining_seconds = max(0, int(cycle_time - (elapsed % cycle_time)))

    if user_batch <= current_batch:
        return {
            "wait_minutes": 0,
            "wait_seconds": 0,
            "batches_ahead": 0
        }

    batches_ahead = user_batch - current_batch - 1
    wait_seconds = cycle_remaining_seconds + (batches_ahead * cycle_time)
    wait_minutes = max(1, math.ceil(wait_seconds / 60.0))

    return {
        "wait_minutes": wait_minutes,
        "wait_seconds": wait_seconds,
        "batches_ahead": batches_ahead
    }


def get_ride_snapshot(ride, user=None):
    """
    Returns full ride operational snapshot with backend batch parameters.
    """
    timing = sync_ride_state(ride)
    capacity = ride.capacity or 24
    
    active_queues = VirtualQueue.objects.filter(
        ride=ride,
        status__in=['waiting', 'boarding']
    )
    
    current_batch_count = active_queues.filter(batch_number=ride.current_batch_number).count()
    remaining_seats = max(0, capacity - current_batch_count)
    total_queue_count = active_queues.count()

    # Determine status message / badge
    if ride.status == 'maintenance':
        status_code = 'maintenance'
        status_label = 'Under Maintenance'
    elif ride.status == 'closed':
        status_code = 'closed'
        status_label = 'Closed'
    elif timing['phase'] == 'riding':
        status_code = 'riding'
        status_label = 'Ride in Progress'
    elif remaining_seats == 0:
        status_code = 'batch_full'
        status_label = 'Batch Full'
    elif remaining_seats < capacity:
        status_code = 'seats_left'
        status_label = f'Only {remaining_seats} Seats Left'
    else:
        status_code = 'boarding'
        status_label = 'Boarding Now'

    # Determine next boarding batch and wait time for new joiners
    if current_batch_count < capacity:
        next_join_batch = ride.current_batch_number
    else:
        highest_batch = active_queues.aggregate(m=models.Max('batch_number'))['m'] or ride.current_batch_number
        if highest_batch > ride.current_batch_number:
            in_highest = active_queues.filter(batch_number=highest_batch).count()
            if in_highest < capacity:
                next_join_batch = highest_batch
            else:
                next_join_batch = highest_batch + 1
        else:
            next_join_batch = ride.current_batch_number + 1

    next_wait = calculate_wait_time(ride, next_join_batch)

    user_info = None
    if user and user.is_authenticated:
        user_queue = active_queues.filter(user=user).first()
        if user_queue:
            u_wait = calculate_wait_time(ride, user_queue.batch_number)
            people_ahead = active_queues.filter(position__lt=user_queue.position).count()
            user_info = {
                "id": user_queue.id,
                "token": user_queue.token,
                "position": people_ahead + 1,
                "global_position": user_queue.position,
                "batch_number": user_queue.batch_number,
                "status": user_queue.status,
                "people_ahead": people_ahead,
                "batches_ahead": u_wait['batches_ahead'],
                "estimated_wait_minutes": u_wait['wait_minutes'],
                "estimated_wait_seconds": u_wait['wait_seconds'],
                "boarding_time": user_queue.boarding_time.isoformat() if user_queue.boarding_time else None,
                "joined_at": user_queue.joined_at.isoformat()
            }

    is_admin = bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))

    # Build list of active batches for Admin Dashboard
    active_batches = []
    if total_queue_count > 0:
        cycle_seconds = (ride.duration_seconds or 180) + (ride.loading_seconds or 120)
        cycle_minutes = max(1, math.ceil(cycle_seconds / 60))

        batch_stats = active_queues.values('batch_number').annotate(
            passengers=models.Count('id'),
            min_pos=models.Min('position'),
            max_pos=models.Max('position')
        ).order_by('batch_number')

        for b in batch_stats:
            b_num = b['batch_number']
            passengers = b['passengers']
            min_p = b['min_pos']
            max_p = b['max_pos']
            pos_range = f"#{min_p} - #{max_p}" if min_p is not None and max_p is not None else "—"

            b_offset = max(0, b_num - ride.current_batch_number)

            if b_num == ride.current_batch_number:
                b_status = 'Boarding' if timing['phase'] == 'loading' else 'Riding'
                start_str = "Now (0m)"
                end_str = f"In {cycle_minutes}m"
            elif b_num < ride.current_batch_number:
                b_status = 'Completed'
                start_str = "Completed"
                end_str = "Completed"
            else:
                b_status = 'Waiting'
                start_m = b_offset * cycle_minutes
                end_m = (b_offset + 1) * cycle_minutes
                start_str = f"In {start_m}m"
                end_str = f"In {end_m}m"

            b_wait = calculate_wait_time(ride, b_num)
            active_batches.append({
                "batch_number": b_num,
                "passengers": passengers,
                "capacity": capacity,
                "occupancy_display": f"{passengers}/{capacity}",
                "position_range": pos_range,
                "status": b_status,
                "estimated_start_time": start_str,
                "estimated_end_time": end_str,
                "estimated_wait_minutes": b_wait['wait_minutes'],
                "batches_ahead": b_offset
            })

    zone_map = {
        'thrill': 'Zone A',
        'water': 'Zone B',
        'family': 'Zone C',
        'kids': 'Zone D',
        'vr': 'Zone E'
    }
    cat_lower = (ride.category or '').lower()
    calculated_zone = zone_map.get(cat_lower, 'Zone A')
    calculated_duration = f"{ride.duration_minutes or 2} min"
    calculated_height = f"{ride.min_height_cm} cm" if ride.min_height_cm else "None"

    return {
        "id": ride.id,
        "name": ride.name,
        "emoji": ride.emoji,
        "category": ride.category,
        "thrill_level": ride.thrill_level,
        "capacity": capacity,
        "duration_minutes": ride.duration_minutes,
        "duration": calculated_duration,
        "zone": calculated_zone,
        "height": calculated_height,
        "min_height_cm": ride.min_height_cm,
        "rating": float(ride.rating) if ride.rating is not None else 4.50,
        "status": ride.status,
        "queue_enabled": ride.queue_enabled,
        "max_queue_size": ride.max_queue_size,
        "img": ride.img,
        "duration_seconds": ride.duration_seconds or 180,
        "loading_seconds": ride.loading_seconds or 120,
        "cycle_time_seconds": ride.cycle_time_seconds,
        "current_phase": timing['phase'],
        "current_batch_number": ride.current_batch_number,
        "current_batch_occupancy": current_batch_count,
        "remaining_seats_in_batch": remaining_seats,
        "total_queue_count": total_queue_count,
        "total_active_batches": len(active_batches),
        "active_batches": active_batches,
        "current_wait_time": next_wait['wait_minutes'],
        "status_code": status_code,
        "status_label": status_label,
        "phase_remaining_seconds": timing['phase_remaining_seconds'],
        "cycle_remaining_seconds": timing['cycle_remaining_seconds'],
        "next_boarding_batch": next_join_batch,
        "next_batch_wait_minutes": next_wait['wait_minutes'],
        "user_queue": user_info
    }


def assign_next_queue(ride, user):
    """
    Assigns user to the virtual queue according to batch capacity rules.
    If current boarding batch has open seats, user joins current batch.
    Otherwise, user joins next available batch.
    """
    timing = sync_ride_state(ride)
    capacity = ride.capacity or 24
    
    # User cannot already be in active queue
    if VirtualQueue.objects.filter(user=user, status__in=['waiting', 'boarding']).exists():
        return None, "You already have an active queue reservation."

    if not ride.is_joinable:
        return None, "Ride is currently not accepting queue entries."

    with transaction.atomic():
        active_queues = VirtualQueue.objects.filter(ride=ride, status__in=['waiting', 'boarding'])
        current_batch_count = active_queues.filter(batch_number=ride.current_batch_number).count()

        if current_batch_count < capacity:
            # User joins current boarding batch!
            target_batch = ride.current_batch_number
            last_pos = active_queues.filter(batch_number=target_batch).aggregate(m=models.Max('position'))['m']
            if last_pos:
                new_position = last_pos + 1
            else:
                new_position = (target_batch - 1) * capacity + current_batch_count + 1
        else:
            # Current boarding batch is full, user joins next available batch
            highest_pos = active_queues.aggregate(m=models.Max('position'))['m']
            if highest_pos and highest_pos >= ride.current_batch_number * capacity:
                new_position = highest_pos + 1
            else:
                new_position = ride.current_batch_number * capacity + 1
                
            target_batch = ((new_position - 1) // capacity) + 1

        wait_info = calculate_wait_time(ride, target_batch)
        est_minutes = wait_info['wait_minutes']
        boarding_dt = timezone.now() + datetime.timedelta(seconds=wait_info['wait_seconds'])

        q_status = 'boarding' if (target_batch == ride.current_batch_number and timing['phase'] == 'boarding') else 'waiting'

        queue_entry = VirtualQueue.objects.create(
            user=user,
            ride=ride,
            position=new_position,
            batch_number=target_batch,
            status=q_status,
            estimated_wait=est_minutes,
            boarding_time=boarding_dt,
            email_sent=False
        )
        
        if q_status == 'boarding':
            threading.Thread(target=_dispatch_async_email, args=(user, queue_entry), daemon=True).start()

        return queue_entry, None
