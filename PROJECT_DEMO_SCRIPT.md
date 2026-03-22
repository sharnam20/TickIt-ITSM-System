# 🎯 PROJECT DEMO SCRIPT & COMPLETE FEATURE LIST
## Intelligent Ticket Assignment & SLA-Based Workload Management System
### By: Sharnam Shah (23CS089) & Het Soni (23CS097)

---

# PART 1: COMPLETE FEATURE LIST (Small → Big)

---

## 🔐 A. AUTHENTICATION & SECURITY (7 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| A1 | **Password Hashing** | Small | All passwords stored using Werkzeug's `generate_password_hash()` — never stored in plain text |
| A2 | **JWT Token Authentication** | Medium | Stateless authentication using JSON Web Tokens with 1-day expiry |
| A3 | **Role-Based Access Control (RBAC)** | Medium | 3 roles — CUSTOMER, EMPLOYEE, MANAGER — each with unique permissions enforced via `@role_required()` decorator |
| A4 | **User Registration** | Medium | Self-service signup with name, email, password + automatic role assignment (CUSTOMER) |
| A5 | **Email Verification** | Big | SMTP-based email verification flow: Register → Receive email → Click link → Account activated. Unverified users cannot access the system |
| A6 | **Forgot Password** | Big | Complete password reset flow: Enter email → Receive email with secure token (1-hour expiry) → Reset password page → New password saved |
| A7 | **Private Route Protection** | Small | All dashboard routes wrapped in `PrivateRoute` — unauthenticated users are automatically redirected to Login |

---

## 🎫 B. TICKET MANAGEMENT (12 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| B1 | **Create Ticket** | Medium | Modal form with title, description, category, priority selection |
| B2 | **AI Category Auto-Detection** | Medium | As user types the description, the system auto-detects the category (Network, Software, Hardware, etc.) using keyword matching |
| B3 | **Smart Solution Suggestions** | Medium | During ticket creation, real-time suggestions appear from the Knowledge Base, potentially resolving the issue before submission |
| B4 | **Ticket List with Filters** | Medium | Searchable, filterable list with status badges, priority indicators, and SLA rings |
| B5 | **Ticket Detail Modal** | Big | Full-screen modal showing: ticket info, status timeline, SLA countdown, comments thread, assignment panel, and edit capabilities |
| B6 | **Status Workflow** | Medium | Tickets follow a lifecycle: OPEN → IN_PROGRESS → RESOLVED → CLOSED, with history logging at each transition |
| B7 | **Priority Levels** | Small | Three priority levels: LOW (green), MEDIUM (amber), HIGH (red) — each visually distinct with color-coded badges |
| B8 | **Ticket History/Audit Trail** | Medium | Every action (create, assign, status change, comment) is logged with timestamp and performer in `TicketHistory` model |
| B9 | **Ticket Context Panel** | Medium | Side panel showing SLA progress ring, ticket timeline, and quick details without leaving the ticket list |
| B10 | **Role-Based Ticket Views** | Medium | Customers see their own tickets; Employees see assigned tickets; Managers see all tickets across the system |
| B11 | **Ticket Deletion** | Small | Managers can delete tickets (with confirmation); deletion cascades to history and comments |
| B12 | **Ticket Editing** | Small | Title, description, priority, category can be updated with changes logged to history |

---

## 🤖 C. INTELLIGENT AUTO-ASSIGNMENT (4 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| C1 | **Team-Based Routing** | Big | When a ticket is created, the system finds a Team whose skills match the ticket category, then picks the member with lowest workload |
| C2 | **Skill-Based Routing** | Medium | If no team matches, the system finds individual employees with matching skills and assigns to the least-loaded one |
| C3 | **General Pool Fallback** | Small | If no skill match found, ticket goes to any available agent with lowest load |
| C4 | **Load Balancing** | Medium | `current_ticket_load` field tracks each employee's active tickets, ensuring even distribution |

---

## ⏱️ D. SLA MANAGEMENT (5 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| D1 | **SLA Rules Engine** | Big | Priority-based auto-calculated deadlines: HIGH = 8 hours, MEDIUM = 24 hours, LOW = 48 hours |
| D2 | **SLA Status Tracking** | Medium | Three states: ON_TRACK (green), AT_RISK (amber), BREACHED (red) — updated dynamically based on remaining time |
| D3 | **SLA Progress Ring** | Medium | Custom SVG circular progress indicator showing remaining time with color interpolation (green → amber → red) |
| D4 | **SLA Countdown Timer** | Small | Real-time countdown showing hours/minutes remaining until breach |
| D5 | **Breach Acknowledgment** | Small | Managers can acknowledge breached tickets, preventing repeated alerts |

---

## 💬 E. COMMUNICATION (4 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| E1 | **Ticket Comments** | Medium | Full conversation thread on each ticket — customers, employees, and managers can communicate |
| E2 | **Internal Notes** | Medium | Staff can add private notes (🔒 locked icon) visible only to employees and managers, not to customers |
| E3 | **Quick Reply Templates** | Small | Pre-built reply templates like "I'm looking into this now" and "Could you provide more details?" for faster responses |
| E4 | **Role Badges in Chat** | Small | Each message shows the author's role (CUSTOMER, EMPLOYEE, MANAGER) with distinct badge colors |

---

## 🔔 F. NOTIFICATIONS (3 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| F1 | **Notification Bell** | Medium | TopBar notification bell with unread count badge, dropdown showing recent notifications |
| F2 | **Auto-Generated Notifications** | Medium | System creates notifications for: ticket assigned, status changed, SLA breach warning |
| F3 | **Mark as Read** | Small | Individual and bulk mark-as-read functionality |

---

## 👥 G. TEAM MANAGEMENT (6 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| G1 | **Create Staff Accounts** | Medium | Managers can create Employee accounts directly (no registration needed), with email, name, password, skills |
| G2 | **Create Teams** | Medium | Managers create teams with name, description, skill specializations, and assigned members |
| G3 | **Assign Members to Teams** | Small | Add or remove staff from teams dynamically |
| G4 | **Team Lead Assignment** | Small | Designate a team lead for each team |
| G5 | **Staff Availability Control** | Small | Toggle employee status: AVAILABLE, ON_LEAVE, OFFLINE |
| G6 | **Staff Directory** | Medium | Searchable list of all staff members with status indicators, skill badges, and ticket load |

---

## 📚 H. KNOWLEDGE BASE (6 Features)

| # | Feature | Size | Description |
|---|---|---|---|
| H1 | **Article CRUD** | Big | Managers can create, edit, and delete knowledge base articles with title, content, category, and tags |
| H2 | **Publish/Draft Toggle** | Small | Articles can be saved as drafts (manager-only) or published (visible to all users) |
| H3 | **Category Filtering** | Small | Filter articles by category using category chips |
| H4 | **Search** | Medium | Full-text search across article titles, content, and tags using regex matching |
| H5 | **View Count Tracking** | Small | Each article view increments a counter, showing popularity |
| H6 | **Recommended Solutions Widget** | Medium | Customer dashboard shows top KB articles in a card grid; clicking opens a detail modal with full content |

---

## 📊 I. DASHBOARDS & ANALYTICS (15 Features)

### Customer Dashboard
| # | Feature | Description |
|---|---|---|
| I1 | **Service Pulse** | Total requests, resolved count, average resolution speed |
| I2 | **Satisfaction Score** | Star-rating display with score out of 5 |
| I3 | **Issue Type Breakdown** | Donut chart showing ticket category distribution |
| I4 | **Resolution Speed Trend** | Area chart tracking resolution time across recent tickets |
| I5 | **Raise New Ticket CTA** | Prominent call-to-action card for quick ticket creation |

### Employee Dashboard
| # | Feature | Description |
|---|---|---|
| I6 | **Workload Stats** | Active tickets, resolved today, SLA compliance percentage |
| I7 | **Assigned Ticket Queue** | List of currently assigned tickets with priority and SLA indicators |
| I8 | **SLA Progress Rings** | Visual ring components per ticket showing time remaining |

### Manager Dashboard
| # | Feature | Description |
|---|---|---|
| I9 | **Metrics Grid** | 4 KPI cards: Total Tickets, Open Issues, Avg Resolution Time, SLA Compliance Rate with sparkline trends |
| I10 | **Ticket Volume Chart** | Bar chart showing daily/weekly ticket creation volume |
| I11 | **Priority Distribution** | Pie chart showing LOW/MEDIUM/HIGH ticket mix |
| I12 | **Team Performance Table** | Table showing each team member's stats, resolution metrics |
| I13 | **Risk Control Panel** | Daily ticket creation vs resolution rate chart, escalated tickets list |
| I14 | **Governance Analytics** | Resolution time metrics, compliance percentages |
| I15 | **SLA Breach Alerts** | Highlighted section showing tickets that have breached SLA |

---

## ⭐ J. CUSTOMER FEEDBACK (2 Features)

| # | Feature | Description |
|---|---|---|
| J1 | **Star Rating** | Customers can rate resolved tickets 1-5 stars |
| J2 | **Feedback Comment** | Text comment field for detailed feedback on resolution quality |

---

## 🎨 K. UI/UX FEATURES (10 Features)

| # | Feature | Description |
|---|---|---|
| K1 | **Light/Dark Theme Toggle** | Full dual-theme system with localStorage persistence, accessible from sidebar |
| K2 | **Glassmorphism UI** | Modern frosted-glass card effects on login, register, and dashboard panels |
| K3 | **Framer Motion Animations** | Page transitions, modal opens/closes, list item animations, hover effects |
| K4 | **Responsive Design** | Works on desktop, tablet, and mobile screen sizes |
| K5 | **Collapsible Sidebar** | Sidebar can minimize to icon-only mode for more workspace |
| K6 | **Color-Coded Status Badges** | OPEN (slate), IN_PROGRESS (blue), RESOLVED (green), CLOSED (purple) |
| K7 | **Priority Color System** | LOW (green), MEDIUM (amber), HIGH (red) with consistent usage throughout |
| K8 | **Loading States** | Skeleton/spinner loading indicators on all API calls |
| K9 | **Error Handling** | User-friendly error messages for form validation, API failures, and network issues |
| K10 | **Lucide Icon System** | Consistent iconography throughout using Lucide React icon library |

---

## 🏗️ L. ARCHITECTURE & INFRASTRUCTURE (6 Features)

| # | Feature | Description |
|---|---|---|
| L1 | **REST API Architecture** | Clean, modular Flask Blueprint routes: auth, tickets, teams, solutions, stats, notifications, users, customer_actions |
| L2 | **MongoDB with MongoEngine ODM** | 8 document models: User, Employee, Team, Ticket, TicketHistory, SLARule, Notification, Comment, Article |
| L3 | **Service Layer Pattern** | Frontend organized into dedicated service files for each API domain |
| L4 | **Context API State Management** | AuthContext for user state, ThemeContext for theme state |
| L5 | **Environment Configuration** | `.env` file for secrets, `python-dotenv` for auto-loading |
| L6 | **CORS Configuration** | Cross-origin enabled for frontend-backend communication |

---

# TOTAL FEATURE COUNT: **80+ Features**

---

---

# PART 2: DEMO SCRIPT (Step-by-Step)

> ⏱️ **Estimated Demo Time: 15-20 minutes**
> 
> **Prerequisites:** Backend running on port 5001, Frontend running on port 5173

---

## 🎬 SCENE 1: LOGIN PAGE (2 min)
**What to show:** The entry point of the application

**Script:**
> "Good morning, Professor. Today I'll demonstrate our **Intelligent Ticket Assignment and SLA-Based Workload Management System**. This is an ITSM (IT Service Management) platform that automates ticket routing and monitors SLA compliance.
>
> Let's start with the **Login Page**. As you can see, we have a modern, enterprise-grade interface with a brand panel on the left showing key system features, and the login form on the right.
>
> The system supports **three user roles**: Customer, Employee, and Manager — each with their own dashboard and permissions."

**Actions:**
1. Show the Login page UI — point out the branding side and the form
2. Point out the **"Forgot password?"** link and **"Create Account"** link
3. Mention JWT-based authentication and password hashing

---

## 🎬 SCENE 2: REGISTRATION & EMAIL VERIFICATION (3 min)
**What to show:** Account creation flow

**Script:**
> "Let me demonstrate the **registration flow**. A new customer can sign up by providing their name, email, and password."

**Actions:**
1. Click **"Create Account"** → show the Register page
2. Point out form validation (password length, required fields)
3. Explain: *"After registration, the system sends a **verification email** via Gmail SMTP with a unique token. The user must click the verification link to activate their account."*
4. (Optional) If time permits, register a new account and show the verification email
5. Navigate back to Login

---

## 🎬 SCENE 3: FORGOT PASSWORD FLOW (2 min)
**What to show:** Password recovery feature

**Script:**
> "If a user forgets their password, they can use the **Forgot Password** feature."

**Actions:**
1. Click **"Forgot password?"** on Login page
2. Show the ForgotPassword page — enter an email
3. Explain: *"The backend generates a **secure UUID reset token** with a **1-hour expiry**, stores it in the database, and sends a styled HTML email with a reset link."*
4. Explain: *"Clicking the link opens the Reset Password page where the user sets a new password with confirmation matching."*
5. Navigate back to Login

---

## 🎬 SCENE 4: MANAGER DASHBOARD (4 min)
**What to show:** The Manager's command center

**Script:**
> "Let me log in as the **Manager**. The Manager has the highest level of access and oversight."

**Actions:**
1. Login with Manager credentials (`23cs089@charusat.edu.in` / `admin123`)
2. **Dashboard Overview:**
   - Point out **4 KPI metric cards** at the top (Total Tickets, Open Issues, Avg Resolution Time, SLA Compliance)
   - Show the **Ticket Volume Chart** (bar chart) — *"This shows ticket creation trends over time"*
   - Show the **Priority Distribution** (pie chart) — *"Breakdown of LOW, MEDIUM, HIGH tickets"*
   - Show the **Team Performance Table** — *"Each staff member's stats"*
   - Show the **Risk Control Panel** — *"Ticket creation vs resolution rate, escalated tickets"*
3. **Dark/Light Theme:**
   - Toggle the theme using the **sun/moon icon** in the sidebar
   - *"We implemented a complete dual-theme system with 70+ CSS override rules and localStorage persistence"*
4. **Sidebar Navigation:**
   - Point out: Dashboard, All Tickets, Team, Knowledge Base, and Logout
   - Show sidebar collapse/expand

---

## 🎬 SCENE 5: TEAM MANAGEMENT (3 min)
**What to show:** How managers build and manage teams

**Script:**
> "The **Team Management** module allows managers to organize staff into functional teams."

**Actions:**
1. Navigate to **Team** page from sidebar
2. **Create Staff Member:**
   - Click **"+ Add Member"**
   - Fill in name, email, password, skills (e.g., Network, Software)
   - *"This creates an Employee account — no registration needed. The manager assigns skills that are used for intelligent ticket routing."*
3. **Create Team:**
   - Click **"+ Create Team"**
   - Fill in team name (e.g., "Network Support"), description, select members
   - *"Teams can have specialized skills. When a ticket matching these skills comes in, it's automatically routed to this team."*
4. Show the team list with member cards, status badges, and skill tags

---

## 🎬 SCENE 6: KNOWLEDGE BASE (2 min)
**What to show:** Self-service help articles

**Script:**
> "The **Knowledge Base** is a self-service support channel where managers publish articles to help users resolve common issues."

**Actions:**
1. Navigate to **Knowledge Base** from sidebar
2. **Create Article:**
   - Click **"+ New Article"**
   - Fill in title (e.g., "How to Reset VPN Password"), category, tags, content
   - Toggle **Published** status
   - *"Articles support categories and tags for search. Managers can save drafts or publish immediately."*
3. Show the article card grid with view counts, category badges
4. Click an article to show the detail view
5. Demonstrate the **search functionality**

---

## 🎬 SCENE 7: CUSTOMER DASHBOARD — TICKET CREATION (4 min)
**What to show:** The core ticket workflow from customer perspective

**Script:**
> "Now let me switch to a **Customer** account to show the ticket creation flow."

**Actions:**
1. Logout → Login as Customer
2. **Customer Dashboard:**
   - Show **Service Pulse** (total requests, resolved, speed)
   - Show **Satisfaction Score** (star rating)
   - Show **Issue Types** donut chart and **Resolution Speed** area chart
   - Show **Recommended Solutions** section — *"These fetch real articles from the Knowledge Base. Clicking opens the full article in a modal — this is the self-service component."*
3. **Create Ticket:**
   - Click **"+ New Request"**
   - Enter title: "VPN not connecting from home"
   - Start typing description → *"Notice how the system **auto-detects the category** as 'Network' based on keywords"*
   - Set priority to HIGH
   - *"Behind the scenes, the system also searches for **relevant Knowledge Base articles** and shows them as suggestions — potentially resolving the issue without creating a ticket."*
   - Submit the ticket
4. **View Ticket:**
   - Switch to **"My Requests"** tab
   - Click the ticket → Show the **Ticket Detail Modal**
   - Point out: Status badge, Priority badge, SLA countdown, assigned agent
   - *"The ticket was **automatically assigned** to the best-fit employee using our intelligent assignment algorithm"*
   - Show the **Comments section** — add a comment

---

## 🎬 SCENE 8: INTELLIGENT AUTO-ASSIGNMENT (2 min)
**What to show:** How the assignment algorithm works

**Script:**
> "Let me explain our **Intelligent Auto-Assignment** algorithm. This is the core innovation of the system."

**Actions:**
1. Open the backend terminal to show the auto-assign log
2. Explain the 4-tier algorithm:
   - *"**Tier 1 — Team-Based Routing:** The system checks if any team's skills match the ticket category. If yes, it picks the team member with the **lowest current workload**."*
   - *"**Tier 2 — Skill-Based Routing:** If no team matches, it looks for individual employees with matching skills."*
   - *"**Tier 3 — General Pool:** If no skill match, any available agent gets it."*
   - *"**Tier 4 — Emergency Fallback:** If everyone is busy, it goes to the least-loaded agent regardless of availability."*
3. *"This ensures **zero unassigned tickets** and **balanced workload distribution** across the team."*

---

## 🎬 SCENE 9: EMPLOYEE DASHBOARD — TICKET RESOLUTION (2 min)
**What to show:** How staff handle tickets

**Script:**
> "Now let me switch to an **Employee** account to show how agents handle tickets."

**Actions:**
1. Logout → Login as Employee
2. **Employee Dashboard:**
   - Show workload stats (Active tickets, Resolved today, SLA compliance)
   - Show the **assigned ticket queue** with SLA progress rings
   - *"Each ticket shows a **circular SLA progress ring** — green means on track, amber means at risk, red means breached"*
3. **Resolve a Ticket:**
   - Click a ticket → Open detail modal
   - Change status: IN_PROGRESS → RESOLVED
   - Add an **internal note** (🔒 visible only to staff)
   - Add a comment (visible to customer too)
   - *"Every status change is logged in the ticket history for audit compliance"*
4. Show the **Ticket Lifecycle Timeline** inside the detail modal

---

## 🎬 SCENE 10: SLA MONITORING (2 min)
**What to show:** How SLA compliance is tracked

**Script:**
> "Our **SLA engine** automatically calculates deadlines based on priority."

**Actions:**
1. Point out SLA indicators on any ticket list:
   - *"**ON_TRACK (green):** Plenty of time remaining"*
   - *"**AT_RISK (amber):** Less than 25% time remaining"*
   - *"**BREACHED (red):** Deadline has passed"*
2. Show the SLA rules:
   - *"HIGH priority = 8-hour deadline, MEDIUM = 24 hours, LOW = 48 hours"*
3. Return to Manager Dashboard → Show **SLA Compliance Rate** in metrics
4. *"Managers get a real-time view of how many tickets are meeting their SLA targets"*

---

## 🎬 SCENE 11: NOTIFICATIONS (1 min)
**What to show:** Real-time alert system

**Actions:**
1. Click the **🔔 notification bell** in the top bar
2. Show unread notification count badge
3. Show notification dropdown with recent alerts
4. *"Notifications are auto-generated when: a ticket is assigned, status changes, or SLA is at risk"*

---

## 🎬 SCENE 12: CLOSING (1 min)
**What to say:**

> "To summarize, our system provides:
> 1. **Complete ticket lifecycle management** from creation to resolution
> 2. **Intelligent auto-assignment** using a 4-tier algorithm based on team skills, individual skills, and workload
> 3. **Automated SLA monitoring** with visual progress indicators
> 4. **Role-based dashboards** with analytics for Customers, Employees, and Managers
> 5. **Self-service Knowledge Base** to reduce ticket volume
> 6. **Secure authentication** with email verification and password reset
> 7. **Enterprise-grade UI** with dark/light themes and responsive design
>
> The system is built with **React 19 + Vite** on the frontend, **Python Flask** as the REST API backend, and **MongoDB** for the database. Thank you. I'm happy to answer any questions."

---

---

# PART 3: QUICK REFERENCE — TECHNICAL ANSWERS

If your professor asks technical questions, here are ready answers:

---

### ❓ "How does the auto-assignment algorithm work?"
> It's a 4-tier cascading algorithm:
> 1. First checks if any Team's skill list matches the ticket's category
> 2. If found, selects the team member with the lowest `current_ticket_load`
> 3. If no team matches, falls back to individual skill matching
> 4. Then general pool, then emergency fallback
> This guarantees 100% assignment rate with balanced workload.

### ❓ "How is SLA calculated?"
> When a ticket is created, the system queries the `SLARule` collection for the matching priority. It calculates `sla_due_at = created_at + resolution_time_hours`. The status auto-updates:
> - ON_TRACK: > 25% time remaining
> - AT_RISK: < 25% time remaining
> - BREACHED: current time > sla_due_at

### ❓ "How is authentication handled?"
> JWT (JSON Web Token) with `flask-jwt-extended`. On login, server returns a signed token with 1-day expiry. The frontend stores it in `localStorage` and attaches it to every API request via `Authorization: Bearer <token>` header. Backend validates the token on every protected route.

### ❓ "What is RBAC?"
> Role-Based Access Control. We have 3 roles: CUSTOMER, EMPLOYEE, MANAGER. Each API endpoint is protected with a `@role_required()` decorator that checks the user's role from the JWT token. The frontend uses `DashboardSwitch` to render role-specific dashboards.

### ❓ "What database are you using and why?"
> MongoDB (NoSQL) with MongoEngine ODM. We chose MongoDB because:
> - Flexible schema for tickets with varying fields
> - Document references for relationships (User → Ticket → Comments)
> - Easy scaling for large ticket volumes
> - Native JSON-like storage matches our REST API format

### ❓ "How does the forgot password work?"
> 1. User submits email → Backend generates UUID token with 1-hour expiry
> 2. Token stored in User document (`reset_token`, `reset_token_expiry`)
> 3. HTML email sent via Gmail SMTP with reset link
> 4. User clicks link → Frontend extracts token from URL
> 5. User submits new password → Backend verifies token + expiry → Updates password hash → Clears token

### ❓ "What is the tech stack?"
> - **Frontend:** React 19, Vite (build tool), Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios
> - **Backend:** Python Flask, Flask-JWT-Extended, Flask-Mail, Flask-CORS
> - **Database:** MongoDB with MongoEngine ODM
> - **Email:** Gmail SMTP with App Passwords
> - **Architecture:** REST API, Service Layer Pattern, Context API for state management

### ❓ "How many database models do you have?"
> 9 models: User, Employee, Team, Ticket, TicketHistory, SLARule, Notification, Comment, Article

### ❓ "How does the Knowledge Base reduce ticket volume?"
> Two ways:
> 1. **Proactive:** During ticket creation, the system searches the KB and shows relevant articles as suggestions — the user might find their answer and cancel the ticket
> 2. **Self-service:** The Customer Dashboard shows "Recommended Solutions" that link to published articles

### ❓ "How is the theme implemented?"
> Using React Context (`ThemeContext`). The theme preference is saved to `localStorage`. We apply `html.light` / `body.light` CSS classes and have 70+ CSS override rules that remap dark-mode Tailwind classes to light-mode equivalents.

---

*Prepared: 24 February 2026 — Good luck with your demo! 🚀*
