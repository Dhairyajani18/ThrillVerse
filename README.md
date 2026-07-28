
python ml_model.py
python manage.py runserver

http://127.0.0.1:8000/api/predict-crowd
{
    "hour": 14,
    "day_of_week": 5,
    "weather": "Sunny"
}
=======Answer========
"status": "success",
"predicted_crowd_count": 563




http://127.0.0.1:8000/api/predict-wait-time
{
    "ride_id": 3,
    "current_crowd": 2200,
    "day_of_week": 6
}
=======Answer========
{
    "status": "success",
    "ride_id": 3,
    "predicted_wait_time_minutes": 16
}


http://127.0.0.1:8000/api/recommend-rides
{
    "user_age": 22,
    "thrill_preference": 3
}
=======Answer========
{
    "status": "success",
    "recommended_ride": "Mega Rollercoaster"
}

🔐 Credentials Reminder
Admin Email: admin@thrillverse.com
Admin Password: admin@123



Edited README.md
Viewed README.md:28-45

I will read the root `package.json` to see if there are scripts defined to launch all services.

Viewed package.json:1-12

To run the **ThrillVerse** project, you need to start three services in parallel. 

Here are the commands you can run from the root directory of your workspace (`sem-4_p1`):

### 1. Install Dependencies (First-time run only)
If you haven't installed dependencies yet, run these commands in your terminal:
```powershell
# Install React Frontend dependencies
npm run install:frontend

# Install Node.js Email Microservice dependencies
npm run install:email
```

---

### 2. Start the Services (In 3 separate terminal tabs/windows)

#### Tab A: Start the Django Backend
This starts the Django web server (running on `http://127.0.0.1:8000`):
```powershell
npm run dev:backend
```

#### Tab B: Start the React Frontend
This starts the Vite React development server (running on `http://localhost:5173` or similar):
```powershell
npm run dev:frontend
```

#### Tab C: Start the Node.js Email Service
This starts the Nodemailer mail transport service (running on `http://127.0.0.1:5000`):
```powershell
npm run dev:email
```

---

### 🔑 Admin Credentials
Once the frontend and backend are running, navigate to the **Profile** section of the landing page, click the Admin portal option (or directly access the admin panel route), and log in with:
* **Email:** `admin@thrillverse.com`
* **Password:** `admin@123`