# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 6 |
| **Reporting Period** | 23-02-26 to 02-03-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Implement Intelligent Ticket Auto-Assignment based on agent skills, workload, and availability.
- **Objective 2:** Build the Risk Control Panel and Governance Analytics for Manager-level operational oversight.
- **Objective 3:** Ensure accurate alignment of new features with the proposed roadmap.

---

## Tasks Completed (3 Marks)

- **Task 1:** Implemented the core 4-tier Intelligent Ticket Auto-Assignment algorithm. The backend `auto_assign_ticket()` pipeline now sequentially evaluates: (1) Team-Based matching, (2) Individual Skill-Based matching, (3) General Pool availability, and (4) Emergency Fallback, assigning tickets accurately based on `current_ticket_load`.
- **Task 2:** Built the Risk Control Panel on the Manager Dashboard (`RiskControlPanel.jsx`). The panel visualizes an SLA Risk Matrix using Recharts pie charts (Compliant, At Risk, Breached) and displays daily creation vs resolution volume trends derived dynamically from live API data.
- **Task 3:** Developed the Governance Analytics infrastructure. Four compliance dimension cards (Security, Privacy, Timeliness, Accuracy) were created with responsive progress bars and color-coded pass/fail threshold indicators for high-level management audits.

---

## Work Progress (3 Marks)

- **Current Status:** 85% completed

- **Milestones Achieved:**
  - ✅ Auto-Assignment Live: Tickets are now systematically routed without manual manager intervention.
  - ✅ Risk Control Deployed: Managers have instant visual oversight of system-wide SLA risk.
  - ✅ Governance Panel UI: Audit-ready compliance scoring is embedded in the Enterprise Dashboard.

- **Challenges Faced:**
  - **Challenge 1:** Routing algorithm failed when multiple agents shared the exact same workload count.
  - **Resolution:** Added secondary sorting by `last_assigned_time` (simulated via standard order_by) to ensure fair round-robin distribution when load counts are identical.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - Complex database querying and multi-tier algorithmic routing in Python/Flask.
  - Data visualization utilizing the `Recharts` library for analytics components.
- **Soft Skills:**
  - Translating abstract business requirements ("intelligent assignment") into a logical programmatic flowchart.

---

## Plan for Next Week

- **Task 1:** Refactor Employee Skills management based on professor feedback to be fully Manager-controlled.
- **Task 2:** Implement the Agent Performance Leaderboard to monitor individual resolution times and active workload.
- **Task 3:** Resolve backend workload increment/decrement synchronization bugs.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
