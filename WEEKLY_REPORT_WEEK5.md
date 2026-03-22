# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 5 |
| **Reporting Period** | 16-02-26 to 23-02-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Implement Forgot Password / Password Reset feature with secure email-based token verification.
- **Objective 2:** Build a comprehensive Light/Dark Theme system with enterprise-grade accessibility.
- **Objective 3:** Make the "Recommended Solutions" section interactive and connect it to the live Knowledge Base.

---

## Tasks Completed (3 Marks)

- **Task 1:** Developed the full Forgot Password flow across backend and frontend. Added `reset_token` and `reset_token_expiry` fields to the User model. Created two new API endpoints (`POST /forgot-password` and `POST /reset-password/<token>`). The backend generates a UUID token with 1-hour expiry, sends a styled HTML reset email via Gmail SMTP, and the frontend includes `ForgotPassword.jsx` (email input with success confirmation) and `ResetPassword.jsx` (new password form with confirm, show/hide toggle, and real-time match validation). Integrated `python-dotenv` to auto-load environment secrets from `.env`.

- **Task 2:** Built a dual Light/Dark Theme system using React Context (`ThemeContext.jsx`) with `localStorage` persistence. Created over 70 CSS override rules in `index.css` targeting `html.light` / `body.light` selectors to remap all hardcoded dark-mode Tailwind classes. Rewrote `Sidebar.jsx` to be fully theme-aware using conditional `isDark` styling. Added light mode variants for glass effects, badges, inputs, charts (Recharts tooltips), scrollbars, and all accent colors.

- **Task 3:** Rewrote the Customer Dashboard's "Recommended Solutions" (`FaqSection` in `CustomerEnterprise.jsx`) to fetch real published articles from the Knowledge Base API (`/api/solutions/articles`). Clicking any solution now opens an animated modal overlay displaying the full article content with category badge, author name, tags, and close functionality. Implemented fallback content for when no articles exist in the database.

---

## Work Progress (3 Marks)

- **Current Status:** 80% completed

- **Milestones Achieved:**
  - ✅ Password Recovery Flow Live: Users can securely reset passwords via email, enhancing account security.
  - ✅ Enterprise Theming Complete: Full Light/Dark mode with smooth transitions across all 15+ components.
  - ✅ Interactive Knowledge Base: Customers can browse and read help articles directly from their dashboard without navigating away.

- **Challenges Faced:**

  - **Challenge 1:** Gmail SMTP emails not sending — the `.env` file containing `MAIL_PASSWORD` was not being loaded by Flask's `os.environ.get()`.
  - **Resolution:** Installed `python-dotenv` and added `load_dotenv()` in `config.py` to automatically load the `.env` file from the backend directory at startup.

  - **Challenge 2:** Tailwind CSS arbitrary value classes (`bg-[#0B1120]`) could not be overridden using standard `[class*=]` CSS attribute selectors due to escape character conflicts.
  - **Resolution:** Adopted a strategy of overriding standard Tailwind utility classes (`bg-slate-900`, `text-white`, etc.) via `html.light` scoped CSS rules, and added inline style attribute selectors for compiled hex color values as a secondary fallback.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - Secure token-based password reset flows (UUID tokens, time-based expiry, password hashing).
  - Advanced CSS theming with specificity management (`!important`, scoped selectors, CSS custom properties).
  - Environment variable management in Python Flask using `python-dotenv`.
  - Building accessible modal overlays with Framer Motion animations and backdrop-blur effects.

- **Soft Skills:**
  - Security-first design thinking (not revealing if an email exists, token expiry, one-time use tokens).
  - Balancing visual polish with functional completeness in an ITSM product.

---

## Plan for Next Week

- **Task 1:** Implement Intelligent Ticket Auto-Assignment based on agent skills, workload, and availability.
- **Task 2:** Build the Risk Control Panel and Governance Analytics for Manager-level operational oversight.
- **Task 3:** Conduct comprehensive testing across all user roles and prepare deployment documentation.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
