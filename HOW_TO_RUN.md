# 🚀 PROJECT SETUP & RUN GUIDE
## Intelligent Ticket Assignment & SLA-Based Workload Management System

---

## 📋 Prerequisites

Make sure the following are installed on your system before starting:

| Software | Version | Download Link |
|---|---|---|
| **Node.js** | v18+ | https://nodejs.org/ |
| **Python** | 3.10+ | https://www.python.org/downloads/ |
| **MongoDB** | 7.0+ | https://www.mongodb.com/try/download/community |
| **Git** | Latest | https://git-scm.com/ |

> ⚠️ **MongoDB must be running locally** on port `27017` before starting the backend.

---

## 📁 Project Structure

```
tickit assignment and sla/
├── backend/                 # Flask REST API
│   ├── app.py               # Main Flask application
│   ├── config.py            # Configuration (DB, JWT, Email)
│   ├── models.py            # MongoDB models (User, Ticket, etc.)
│   ├── database.py          # Database connection
│   ├── requirements.txt     # Python dependencies
│   ├── seed_manager.py      # Seed script for admin user
│   ├── seed_sla.py          # Seed script for SLA rules
│   ├── .env                 # Environment variables (secrets)
│   ├── routes/
│   │   ├── auth.py          # Login, Register, Forgot Password
│   │   ├── tickets.py       # Ticket CRUD & assignment
│   │   ├── teams.py         # Team management
│   │   ├── solutions.py     # Knowledge Base articles
│   │   ├── stats.py         # Dashboard statistics
│   │   ├── notifications.py # Notifications
│   │   ├── users.py         # User management
│   │   └── customer_actions.py  # Customer feedback
│   └── utils/
│       ├── email_service.py # Email sending (Gmail SMTP)
│       └── rbac.py          # Role-based access control
│
├── frontend/                # React + Vite Frontend
│   ├── package.json         # Node.js dependencies
│   ├── index.html           # Entry HTML
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── src/
│       ├── App.jsx           # Main app with routing
│       ├── index.css         # Global styles + theme
│       ├── context/          # Auth & Theme providers
│       ├── pages/            # All page components
│       ├── components/       # Reusable UI components
│       └── services/         # API service functions
│
├── WEEKLY_REPORT_WEEK1.md
├── WEEKLY_REPORT_WEEK2.md
├── WEEKLY_REPORT_WEEK3.md
├── WEEKLY_REPORT_WEEK4.md
└── WEEKLY_REPORT_WEEK5.md
```

---

## ⚡ QUICK START (All Commands)

### Step 1: Start MongoDB

Open a terminal and run:

```bash
mongod
```

> If MongoDB is installed as a Windows Service, it may already be running.
> Verify by opening another terminal and running: `mongosh`

---

### Step 2: Setup & Run Backend (Flask API)

Open a **new terminal** in the project root folder:

```bash
# Navigate to project root
cd "tickit assignment and sla"

# Install Python dependencies
pip install -r backend/requirements.txt

# Seed the database with default Manager account & SLA rules
python backend/seed_manager.py
python backend/seed_sla.py

# Start the Flask backend server
python backend/app.py
```

✅ Backend will start at: **http://localhost:5000**

You should see:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

---

### Step 3: Setup & Run Frontend (React + Vite)

Open a **second terminal**:

```bash
# Navigate to frontend folder
cd "tickit assignment and sla/frontend"

# Install Node.js dependencies
npm install

# Start the Vite dev server
npm run dev -- --host
```

✅ Frontend will start at: **http://localhost:5173**

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

### Step 4: Open the Application

Open your browser and go to:

```
http://localhost:5173
```

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Manager** (Admin) | `admin@tickit.com` | `admin123` |

> Customers register themselves via the Register page.
> Employees/Staff are created by the Manager from the Team page.

---

## 📧 Email Configuration

The project uses **Gmail SMTP** for:
- Email verification during registration
- Forgot Password reset links

The `.env` file is already configured at `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/itsm_db
SECRET_KEY=dev_secret_key_itsm_2024
JWT_SECRET_KEY=jwt_secret_key_itsm_2024

# Gmail Configuration
MAIL_USERNAME=sharnamshah2006@gmail.com
MAIL_PASSWORD=dcflunflodztupmp
MAIL_DEFAULT_SENDER=sharnamshah2006@gmail.com
FRONTEND_URL=http://localhost:5173
```

> If emails don't send, the reset/verification link is printed in the **backend terminal** as a fallback.

---

## 🛠️ All Commands Summary

| Action | Command | Terminal |
|---|---|---|
| Start MongoDB | `mongod` | Terminal 1 |
| Install Python deps | `pip install -r backend/requirements.txt` | Terminal 2 |
| Seed admin user | `python backend/seed_manager.py` | Terminal 2 |
| Seed SLA rules | `python backend/seed_sla.py` | Terminal 2 |
| **Start Backend** | `python backend/app.py` | Terminal 2 |
| Install Node deps | `cd frontend && npm install` | Terminal 3 |
| **Start Frontend** | `npm run dev -- --host` | Terminal 3 |

---

## 🌐 Application URLs

| Service | URL |
|---|---|
| Frontend (UI) | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/ |
| MongoDB | mongodb://localhost:27017 |

---

## 👥 User Roles & Capabilities

| Role | Capabilities |
|---|---|
| **Manager** | Dashboard analytics, Team management, Create staff, Knowledge Base CRUD, View all tickets, SLA monitoring |
| **Employee** | View assigned tickets, Update ticket status, Workload tracking, SLA progress |
| **Customer** | Raise tickets, Track ticket status, View recommended solutions, Rate resolved tickets, Forgot password |

---

## 🎨 Features Implemented

1. ✅ JWT Authentication with Role-Based Access Control (RBAC)
2. ✅ Email Verification for new registrations
3. ✅ Forgot Password / Reset Password via email
4. ✅ Customer Dashboard (Service Hub, My Requests, Feedback)
5. ✅ Employee Dashboard (Assigned Tickets, Workload, SLA Ring)
6. ✅ Manager Dashboard (Analytics, Charts, Risk Panel, Team Table)
7. ✅ Ticket CRUD with SLA auto-calculation
8. ✅ Team Management (Create teams, assign members)
9. ✅ Knowledge Base (Articles CRUD, search, categories)
10. ✅ Recommended Solutions with interactive modal viewing
11. ✅ Notification System
12. ✅ Light / Dark Theme toggle
13. ✅ Smart Ticket Suggestions during creation
14. ✅ Customer Feedback (Star ratings & comments)
15. ✅ Responsive, enterprise-grade UI with Tailwind CSS

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `ModuleNotFoundError` in Python | Run `pip install -r backend/requirements.txt` |
| `npm ERR! missing dependencies` | Run `cd frontend && npm install` |
| MongoDB connection refused | Make sure `mongod` is running |
| Port 5000 already in use | Kill the process: `taskkill /F /IM python.exe` then restart |
| Port 5173 already in use | Kill Vite or use `npm run dev -- --port 5174` |
| Emails not sending | Check backend terminal — the link is printed as fallback |
| Login fails | Run `python backend/seed_manager.py` to create default admin |
| Blank page after login | Clear browser localStorage: `localStorage.clear()` in console |

---

## 📝 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| Backend | Python Flask, Flask-JWT-Extended, Flask-Mail, Flask-CORS |
| Database | MongoDB with MongoEngine ODM |
| Auth | JWT Tokens + Role-Based Access Control |
| Email | Gmail SMTP with App Passwords |
| Styling | Tailwind CSS v3 + Custom CSS Variables |

---

*Last updated: 23 February 2026*
