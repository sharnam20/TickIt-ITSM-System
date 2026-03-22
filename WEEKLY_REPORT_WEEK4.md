# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 4 |
| **Reporting Period** | 09-02-26 to 16-02-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Build a full Knowledge Base module with article publishing, search, and categorization.
- **Objective 2:** Implement the SLA Rules Engine for automated deadline assignment based on priority levels.
- **Objective 3:** Develop a Notification system and enhance the Employee Dashboard with workload tracking.

---

## Tasks Completed (3 Marks)

- **Task 1:** Built the complete Knowledge Base system (`KnowledgeBase.jsx`, `routes/solutions.py`) with an `Article` MongoDB model supporting title, content (Markdown), category, tags, author, published status, and view count. Managers get a full CRUD interface (Create, Edit, Delete, Publish/Draft toggle), while Customers and Employees see only published articles with search and category filtering.

- **Task 2:** Implemented the SLA Rules Engine (`SLARule` model, `seed_sla.py`) that automatically calculates `sla_due_at` deadlines when tickets are created. LOW priority tickets get 48-hour SLA, MEDIUM gets 24 hours, and HIGH priority gets 8 hours. The system continuously monitors and updates the `sla_status` field (ON_TRACK → AT_RISK → BREACHED) based on remaining time.

- **Task 3:** Developed the Notification system (`routes/notifications.py`, `Notification` model) that generates real-time alerts for ticket status changes, SLA breach warnings, and new assignments. Built the Employee Dashboard (`EmployeeDashboard.jsx`) with workload statistics, assigned ticket queue, and SLA progress indicators using a custom `SlaProgressRing.jsx` component.

---

## Work Progress (3 Marks)

- **Current Status:** 65% completed

- **Milestones Achieved:**
  - ✅ Knowledge Base Published: Self-service support channel established to deflect common tickets.
  - ✅ SLA Automation Active: Priority-based deadlines are auto-calculated, removing manual tracking.
  - ✅ Employee Workflow Complete: Agents can view, manage, and resolve assigned tickets with SLA visibility.

- **Challenges Faced:**

  - **Challenge 1:** MongoEngine text search not supporting full-text queries natively for the Knowledge Base search.
  - **Resolution:** Implemented a regex-based search across title, content, and tags using `$or` with `$regex` and `$options: 'i'` for case-insensitive matching.

  - **Challenge 2:** SLA progress ring component not updating correctly when ticket data refreshed.
  - **Resolution:** Added proper `useEffect` dependency tracking and memoized the time-remaining calculation in `SlaProgressRing.jsx` to prevent stale renders.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - Markdown content rendering and rich-text article management in React.
  - Time-based automation logic (SLA deadline calculation, cron-like status monitoring).
  - SVG-based progress ring animations with dynamic color interpolation (green → amber → red).

- **Soft Skills:**
  - Designing self-service support systems that reduce operational burden.
  - Understanding ITIL/ITSM best practices for SLA management and escalation workflows.

---

## Plan for Next Week

- **Task 1:** Implement Forgot Password / Password Reset functionality with email-based secure token flow.
- **Task 2:** Build a dual Light/Dark Theme system for enterprise accessibility.
- **Task 3:** Polish UI components and add interactive article viewing for Customer dashboard recommendations.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
