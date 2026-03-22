# 🚀 Intelligent Ticket Assignment & SLA-Based Workload Management System

## 📋 Project Overview

An enterprise-grade **IT Service Management (ITSM)** platform that automates support operations through intelligent ticket routing, SLA compliance monitoring, and self-service knowledge management. Built with a modern full-stack architecture supporting three distinct user roles — **Customers**, **Employees**, and **Managers** — each with tailored dashboards and capabilities.

### 👨‍💻 Team
| Name | Roll No |
|---|---|
| Sharnam Shah | 23CS089 |
| Het Soni | 23CS097 |



---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS 3, Framer Motion, Recharts, Lucide Icons, Axios |
| **Backend** | Python Flask, Flask-JWT-Extended, Flask-Mail, Flask-CORS |
| **Database** | MongoDB with MongoEngine ODM |
| **Auth** | JWT Tokens (1-day expiry) + Role-Based Access Control |
| **Email** | Gmail SMTP with App Passwords |
| **Config** | python-dotenv for environment variable management |

---

## 🌟 Key Features

### 🧠 1. Intelligent Auto-Assignment Engine
- **4-Tier Cascading Algorithm:**
  1. **Team-Based Routing** — Match ticket category to team skills
  2. **Skill-Based Routing** — Match to individual employee skills
  3. **General Pool** — Fallback to any available agent
  4. **Emergency Fallback** — Least-loaded agent regardless
- **Load Balancing** — Distributes tickets to the least busy qualified agent
- **Availability Awareness** — Skips offline/on-leave agents

### ⏱️ 2. SLA Management System
- **Auto-Calculated Deadlines:** HIGH = 8h, MEDIUM = 24h, LOW = 48h
- **Real-Time Visual Indicators:** Green (On Track) → Amber (At Risk) → Red (Breached)
- **SVG Progress Rings** on every ticket with countdown timers
- **Breach Acknowledgment** for managers

### 👥 3. Role-Based Workspaces (RBAC)
| Role | Capabilities |
|---|---|
| **Customer** | Create tickets, track status, rate resolutions, browse Knowledge Base, reset password |
| **Employee** | View assigned queue, update ticket status, set availability, workload tracking |
| **Manager** | Global oversight, team management, create staff, analytics, SLA monitoring, Knowledge Base CRUD |

### 🔐 4. Complete Authentication System
- JWT token-based authentication
- Email verification for new registrations (Gmail SMTP)
- Forgot Password / Reset Password with secure UUID tokens (1-hour expiry)
- Password hashing (Werkzeug)

### 💬 5. Communication & Collaboration
- **Chat-Style Conversation Thread** on each ticket
- **Internal Notes** — Private staff-only comments (🔒)
- **Public Replies** — Visible to customers
- **Quick Reply Templates** for faster responses
- **Role Badges** on each message

### 📚 6. Knowledge Base (Self-Service)
- Article CRUD with Markdown support, categories, and tags
- Publish/Draft toggle for content workflow
- Full-text search across titles, content, and tags
- View count tracking and category filtering
- **Smart Suggestions** during ticket creation
- **Recommended Solutions** widget on Customer Dashboard

### 📊 7. Analytics Dashboards
- **Customer:** Service Pulse, Satisfaction Score, Issue Type Donut Chart, Resolution Speed Trend
- **Employee:** Workload Stats, Assigned Queue, SLA Progress Rings
- **Manager:** 4 KPI Cards, Ticket Volume Bar Chart, Priority Distribution Pie Chart, Team Performance Table
- **Risk Control Panel:** SLA Risk Matrix donut chart
- **Governance Analytics:** 4-dimension compliance scoring

### 🔔 8. Notification System
- Bell icon with unread count badge
- Auto-generated alerts for: ticket assigned, status changed, SLA warning
- Mark as read (individual + bulk)

### ⭐ 9. Customer Feedback
- Star rating (1-5) on resolved tickets
- Feedback comments for detailed reviews

### 🎨 10. Enterprise UI/UX
- **Light/Dark Theme** toggle with localStorage persistence
- Framer Motion animations (page transitions, modals, hover effects)
- Glassmorphism effects and gradient accents
- Responsive design (desktop, tablet, mobile)
- Collapsible sidebar navigation
- Color-coded status & priority badges

---

## 📂 Project Structure

```
tickit-assignment-and-sla/
├── backend/                    # Flask REST API Server
│   ├── app.py                  # Application entry point
│   ├── config.py               # Configuration (DB, JWT, Email)
│   ├── models.py               # 9 MongoDB document models
│   ├── database.py             # Database connection
│   ├── requirements.txt        # Python dependencies
│   ├── seed_manager.py         # Seed default admin user
│   ├── seed_sla.py             # Seed SLA rules
│   ├── .env                    # Environment secrets
│   ├── routes/
│   │   ├── auth.py             # Login, Register, Forgot/Reset Password
│   │   ├── tickets.py          # Ticket CRUD + Auto-Assignment
│   │   ├── teams.py            # Team management
│   │   ├── solutions.py        # Knowledge Base articles
│   │   ├── stats.py            # Dashboard statistics
│   │   ├── notifications.py    # Notification system
│   │   ├── users.py            # User management + availability
│   │   └── customer_actions.py # Customer feedback
│   └── utils/
│       ├── email_service.py    # Gmail SMTP email sending
│       └── rbac.py             # @role_required() decorator
│
├── frontend/                   # React + Vite Client
│   ├── src/
│   │   ├── App.jsx             # Main app with routing
│   │   ├── index.css           # Global styles + theme overrides
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state + JWT management
│   │   │   └── ThemeContext.jsx # Light/Dark theme
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── KnowledgeBase.jsx
│   │   │   └── dashboard/
│   │   │       ├── ManagerDashboard.jsx
│   │   │       ├── EmployeeDashboard.jsx
│   │   │       └── CustomerDashboard.jsx
│   │   ├── components/
│   │   │   ├── layout/ (Sidebar, TopBar, DashboardLayout)
│   │   │   ├── dashboard/ (7 dashboard panels)
│   │   │   ├── tickets/ (TicketCard, TicketDetailsModal)
│   │   │   └── ui/ (Button, Card, Input, SlaProgressRing, NotificationBell)
│   │   └── services/ (6 API service files)
│   └── package.json

            # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+, Python 3.10+, MongoDB 7.0+

### 1. Start MongoDB
```bash
mongod
```

### 2. Backend
```bash
cd "tickit assignment and sla"
pip install -r backend/requirements.txt
python backend/seed_manager.py
python backend/seed_sla.py
python backend/app.py
```
Backend runs on **http://localhost:5001**

### 3. Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```
Frontend runs on **http://localhost:5173**

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Manager** | `23cs089@charusat.edu.in` | `admin123` |
| **Employee** | Created by Manager via Team page | Set during creation |
| **Customer** | Self-registration via Register page | Self-defined |

---

## 📊 Database Models (9 Documents)

| Model | Purpose |
|---|---|
| `User` | All users (name, email, password_hash, role, verification/reset tokens) |
| `Employee` | Extended staff info (skills, availability, ticket load, shifts) |
| `Team` | Team structure (name, lead, members, skills) |
| `Ticket` | Support tickets (title, desc, priority, status, SLA, feedback) |
| `TicketHistory` | Audit trail (action, performer, timestamp) |
| `SLARule` | Priority-based deadlines (LOW=48h, MEDIUM=24h, HIGH=8h) |
| `Notification` | User alerts (title, message, read status) |
| `Comment` | Ticket conversations (public + internal notes) |
| `Article` | Knowledge Base articles (markdown, category, tags, views) |

---

## 📅 Development Timeline

| Week | Theme | Progress |
|---|---|---|
| Week 1 | Foundation & Infrastructure | 20% |
| Week 2 | Core Ticket Logic & RBAC | 35% |
| Week 3 | Team Management & Feedback | 50% |
| Week 4 | Knowledge Base & SLA Engine | 65% |
| Week 5 | Forgot Password & Themes | 80% |
| Week 6 | Bug Fixes & Documentation | 85% |
| Week 7 | Analytics & End-to-End Testing | 95% |

---

*Developed as part of the Software Engineering curriculum at CHARUSAT.*
