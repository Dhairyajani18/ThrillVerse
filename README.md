# 🎢 ThrillVerse — Next-Gen Amusement Park & Virtual Queue System

> ThrillVerse is a smart amusement park management system designed to reduce long ride queues and improve park navigation. It provides online ticket booking, virtual queues, QR-based e-tickets, real-time ride updates, smart navigation using Dijkstra’s algorithm, and AI-based crowd prediction for a faster, smarter, and better park experience.


---

## 🌟 Key Features

* 🎟️ **Virtual Queue System** — Skip physical lines with real-time digital pass booking & queue position updates.
* 🔮 **AI Wait Time & Crowd Prediction** — Machine learning models predicting park density and ride wait times.
* 🗺️ **Interactive Park Map** — Live GIS map (powered by Leaflet) showing ride status, restaurants, and amenities.
* 📊 **Admin Analytics Dashboard** — Live operator controls to pause/resume queues and track financial revenue.
* 💳 **Seamless Ticketing & Payments** — Online booking integrated with Razorpay payment gateway.
* ✉️ **Email Notification Microservice** — Instant QR ticket receipts and queue updates powered by Node.js & Nodemailer.

---

## 🚀 Quick Start Guide

### 1️⃣ Install Dependencies

Run the following commands from the project root (`sem-4_p1`):

```powershell
# Install React Frontend dependencies
npm run install:frontend

# Install Node.js Email Service dependencies
npm run install:email

# Install Python Backend dependencies (Django & ML libraries)
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv psycopg2-binary scikit-learn pandas numpy joblib
```

---

### 2️⃣ Database Setup & Migrations

Make sure PostgreSQL is running and database `thrillverse` is created:

```powershell
# Run Django database migrations
python manage.py migrate

# (Optional) Create superuser admin
python manage.py createsuperuser
```

---

### 3️⃣ Start the Services (In 3 Parallel Terminals)

> ⚡ **Quick Shortcut**: Run `npm run dev` (or `npm start`) from the root folder to start the frontend application!

#### 📱 Terminal 1: React Frontend (Vite)
```powershell
npm run dev
# (or npm run dev:frontend)
```
🌐 **URL:** `http://localhost:5173`

#### 🖥️ Terminal 2: Django REST API Backend
```powershell
npm run dev:backend
```
🌐 **URL:** `http://127.0.0.1:8000`

#### ✉️ Terminal 3: Node.js Email Microservice
```powershell
npm run dev:email
```
🌐 **URL:** `http://127.0.0.1:5000`

---

### 📜 NPM Scripts Quick Reference

All services can be launched directly from the root workspace folder using npm scripts:

| Command | Description | Target Service / URL |
| :--- | :--- | :--- |
| ⚡ `npm run dev` | Starts the React Frontend dev server | `http://localhost:5173` |
| 🚀 `npm start` | Alias for starting the React Frontend | `http://localhost:5173` |
| 📱 `npm run dev:frontend` | Starts Frontend dev server directly | `http://localhost:5173` |
| 🖥️ `npm run dev:backend` | Starts Django Backend Python server | `http://127.0.0.1:8000` |
| ✉️ `npm run dev:email` | Starts Node.js Email Microservice | `http://127.0.0.1:5000` |
| 📦 `npm run install:frontend` | Installs frontend dependencies | — |
| 📦 `npm run install:email` | Installs email microservice dependencies | — |

---

## 🔐 Credentials & Admin Access

* 👤 **Admin Portal:** Access via Profile menu on the frontend landing page.
* 📧 **Email:** `admin@thrillverse.com`
* 🔑 **Password:** `admin@123`

---

## 📡 API Endpoints Reference

### 🔮 Machine Learning Predictions

#### 📊 Predict Park Crowd Density
* **Endpoint:** `POST /api/predict-crowd`
* **Request:**
  ```json
  {
      "hour": 14,
      "day_of_week": 5,
      "weather": "Sunny"
  }
  ```
* **Response:**
  ```json
  {
      "status": "success",
      "predicted_crowd_count": 563
  }
  ```

#### ⏱️ Predict Ride Wait Time
* **Endpoint:** `POST /api/predict-wait-time`
* **Request:**
  ```json
  {
      "ride_id": 3,
      "current_crowd": 2200,
      "day_of_week": 6
  }
  ```
* **Response:**
  ```json
  {
      "status": "success",
      "ride_id": 3,
      "predicted_wait_time_minutes": 16
  }
  ```

---

### 🎡 Virtual Queue & Ride Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/queue/rides/` | List all park rides & live statuses |
| `POST` | `/queue/join/` | Join virtual queue for a ride |
| `GET` | `/queue/my-queue/` | View current user's active queue passes |
| `POST` | `/queue/leave/` | Cancel / leave virtual queue |
| `GET` | `/queue/tickets/` | Retrieve booked tickets |
| `POST` | `/queue/booking/create/` | Create ticket booking order (Razorpay) |
| `POST` | `/queue/booking/check-in/` | QR Code scan check-in at ride |

---

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login/` | Obtain JWT Access & Refresh Tokens |
| `POST` | `/auth/register/` | Register new visitor account |
| `POST` | `/auth/token/refresh/` | Refresh JWT Token |
| `GET` | `/auth/profile/` | Get user profile details |

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root folder with the following variables:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:7878@127.0.0.1:5432/thrillverse?schema=public"

JWT_SECRET="your_jwt_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
JWT_EXPIRATION="24h"
JWT_REFRESH_EXPIRATION="7d"

RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_email_app_password"
SMTP_FROM="your_email@gmail.com"

ML_SERVICE_URL="http://127.0.0.1:8000"
```

---

## 🛠️ Tech Stack Overview

* **Frontend:** React 18, Vite, Tailwind CSS, Leaflet Maps, Lucide Icons, Recharts
* **Backend:** Python 3.10+, Django 5.2, Django REST Framework, SimpleJWT
* **Microservices:** Node.js, Express, Nodemailer
* **Machine Learning:** Scikit-Learn, Pandas, NumPy, Joblib
* **Database:** PostgreSQL

---
