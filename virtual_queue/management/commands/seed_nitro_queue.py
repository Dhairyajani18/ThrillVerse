import datetime
import math
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from virtual_queue.models import Ride, VirtualQueue, generate_queue_token
from authentication.models import UserProfile

class Command(BaseCommand):
    help = 'Cleans up existing active entries and seeds 200 queue entries for Nitro and 100 queue entries for Scream Machine.'

    def handle(self, *args, **kwargs):
        # List of preserved usernames
        PRESERVED_USERNAMES = {'jay', 'vruti', 'grency', 'dhairya', 'shiv', 'ravi', 'admin'}

        self.stdout.write("Preserving core users: " + ", ".join(sorted(list(PRESERVED_USERNAMES))))

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

        now = timezone.now()

        targets = [
            ("Nitro", 200),
            ("Scream Machine", 150)
        ]

        for ride_search_name, target_count in targets:
            ride = Ride.objects.filter(name__icontains=ride_search_name).first()
            if not ride:
                self.stderr.write(f"{ride_search_name} ride not found in database!")
                continue

            self.stdout.write(f"\nFound ride: {ride.name} (Capacity: {ride.capacity}, Max Queue: {ride.max_queue_size})")

            # Reset ride cycle start time to now so background cycle sync starts fresh
            ride.current_cycle_start_time = now
            ride.save(update_fields=['current_cycle_start_time'])

            # Clear existing active queues for this ride
            deleted_count, _ = VirtualQueue.objects.filter(ride=ride, status__in=['waiting', 'boarding']).delete()
            self.stdout.write(f"Cleared {deleted_count} existing active queue entries for {ride.name}.")

            capacity = ride.capacity or 24
            cycle_seconds = (ride.duration_seconds or 180) + (ride.loading_seconds or 120)
            cycle_minutes = max(1, math.ceil(cycle_seconds / 60))
            ride_slug = ride.name.lower().replace(' ', '_').replace(':', '').replace('-', '')

            self.stdout.write(f"Seeding {target_count} queue entries for {ride.name}...")

            for i in range(1, target_count + 1):
                uname = f"rider_{ride_slug}_{i}"
                user, _ = User.objects.get_or_create(
                    username=uname,
                    defaults={
                        "email": f"{uname}@thrillverse.com",
                        "first_name": "Dummy",
                        "last_name": f"Rider {i}"
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

            self.stdout.write(self.style.SUCCESS(f"Successfully seeded {target_count} active entries into {ride.name}!"))

        self.stdout.write(self.style.SUCCESS("\nSeeding complete! Preserved core users and created 200 Nitro entries & 100 Scream Machine entries."))

