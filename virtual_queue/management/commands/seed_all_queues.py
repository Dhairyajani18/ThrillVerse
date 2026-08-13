import datetime
import math
import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from virtual_queue.models import Ride, VirtualQueue, generate_queue_token
from authentication.models import UserProfile

class Command(BaseCommand):
    help = 'Seeds queue entries for all rides: Nitro (25), Scream Machine (50), and all other rides (10-15).'

    def handle(self, *args, **kwargs):
        # Fix random seed for reproducible non-Nitro / non-Scream Machine ride entries between 10-15 if needed,
        # or use random range 10-15 per ride.
        random.seed(42)

        PRESERVED_USERNAMES = {'jay', 'vruti', 'grency', 'dhairya', 'shiv', 'ravi', 'admin'}

        # Ensure core users exist
        for uname in ['jay', 'vruti', 'grency', 'dhairya', 'shiv', 'ravi']:
            user, created = User.objects.get_or_create(
                username=uname,
                defaults={
                    "email": f"{uname}@thrillverse.com",
                    "first_name": uname.capitalize(),
                    "last_name": "User"
                }
            )
            if created:
                user.set_password("Pass@123")
                user.save()
                UserProfile.objects.get_or_create(user=user, defaults={"phone_number": "9876543210"})

        # Clear existing active queues across all rides
        deleted_count, _ = VirtualQueue.objects.filter(status__in=['waiting', 'boarding']).delete()
        self.stdout.write(f"Cleared {deleted_count} existing active queue entries.")

        now = timezone.now()
        rides = Ride.objects.all()

        if not rides.exists():
            self.stderr.write("No rides found in database! Please run `python manage.py seed_rides` first.")
            return

        total_seeded = 0
        summary = []

        TARGET_17_RIDES = ["nitro", "scream", "spacex", "dare 2 drop"]

        for ride in rides:
            r_name_lower = ride.name.strip().lower()
            if "splashdown" in r_name_lower or "splash ahoy" in r_name_lower:
                target_count = 20
            elif any(t in r_name_lower for t in TARGET_17_RIDES):
                target_count = 17
            else:
                target_count = random.randint(5, 10)

            capacity = ride.capacity or 20
            cycle_seconds = (ride.duration_seconds or 180) + (ride.loading_seconds or 120)
            cycle_minutes = max(1, math.ceil(cycle_seconds / 60))

            ride_slug = (
                ride.name.lower()
                .replace(' ', '_')
                .replace(':', '')
                .replace('-', '')
                .replace('!', '')
                .replace('–', '')
                .replace('\'', '')
            )

            for i in range(1, target_count + 1):
                uname = f"rider_{ride_slug}_{i}"
                user, _ = User.objects.get_or_create(
                    username=uname,
                    defaults={
                        "email": f"{uname}@thrillverse.com",
                        "first_name": f"Rider{i}",
                        "last_name": ride.name[:10]
                    }
                )

                if i <= capacity:
                    batch_num = ride.current_batch_number
                    q_status = 'boarding'
                    est_wait = 0
                    b_time = now
                else:
                    batch_offset = (i - 1) // capacity
                    batch_num = ride.current_batch_number + batch_offset
                    q_status = 'waiting'
                    est_wait = batch_offset * cycle_minutes
                    b_time = now + datetime.timedelta(minutes=est_wait)

                token = generate_queue_token()

                VirtualQueue.objects.create(
                    user=user,
                    ride=ride,
                    token=token,
                    position=i,
                    batch_number=batch_num,
                    status=q_status,
                    estimated_wait=est_wait,
                    boarding_time=b_time,
                    joined_at=now,
                    email_sent=True
                )

            summary.append(f"  • {ride.name}: {target_count} entries")
            total_seeded += target_count

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {total_seeded} queue entries across {rides.count()} rides!\n"))
        for s in summary:
            self.stdout.write(s)
