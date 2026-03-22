# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 8 |
| **Reporting Period** | 09-03-26 to 16-03-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Create an interactive graphical interface for Agent Performance analytics.
- **Objective 2:** Introduce a Customer-initiated "Escalation" workflow.
- **Objective 3:** Incorporate visual UI Badging to alert staff of escalated priorities.

---

## Tasks Completed (3 Marks)

- **Task 1:** Enhanced the Manager Dashboard by creating an interactive Recharts BarChart visualizing "SLA Success Rate vs Ticket Volume". This chart sits alongside the Leaderboard and automatically pulls from the `getAgentPerformance` API, giving a rapid graphical view of workforce efficiency.
- **Task 2:** Implemented Customer Manual Escalation. Modified the `TicketDetailsModal.jsx` to render an "Escalate to Management" button exclusively for un-escalated, open tickets belonging to the authenticated customer. Connected this to a new `POST` API endpoint that sets `is_escalated = True`.
- **Task 3:** Upgraded the system's visual awareness. When a ticket is escalated, a flashing red `ESCALATED` badge dynamically injects itself into the `TicketList.jsx` rendering engine and the Ticket Details Header. The Manager's Operational Panel "Watchlist" was also rewritten to securely filter exclusively for escalated items.

---

## Work Progress (3 Marks)

- **Current Status:** 92% completed

- **Milestones Achieved:**
  - ✅ Performance Visualization: Agent analytical charts deployed.
  - ✅ Customer Empowerment: Customers can flag stagnant tickets directly to management.
  - ✅ Attention Badging: UI instantly reacts to priority changes, minimizing missed alerts.

- **Challenges Faced:**
  - **Challenge 1:** The Manager's Escalation Watchlist was originally using static mocked placeholders that didn't sync with the new backend fields.
  - **Resolution:** Rewrote `OperationalPanel.jsx` properties to dynamically parse `tickets.filter(t => t.is_escalated)`, establishing a real-time tracking list.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - Conditional rendering in React based on complex compound boolean matrices (`isCustomer && status !== 'RESOLVED' && !is_escalated`).
  - Rendering advanced SVG graphing elements interactively using `Recharts`.
- **Soft Skills:**
  - Understanding Service Level UI priorities—bringing critical data out of tables and into highlighted badge components.

---

## Plan for Next Week

- **Task 1:** Implement an Automatic SLA-breach Escalation background worker.
- **Task 2:** Combine Auto-Reassignment logic into the SLA-breach workflow.
- **Task 3:** Deploy Offline Data Export functions for Manager auditing.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
