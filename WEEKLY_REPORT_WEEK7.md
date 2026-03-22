# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 7 |
| **Reporting Period** | 02-03-26 to 09-03-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Refactor Employee Skills management based on professor feedback to be fully Manager-controlled.
- **Objective 2:** Implement the Agent Performance Leaderboard to monitor individual resolution times and active workload.
- **Objective 3:** Resolve backend workload increment/decrement synchronization bugs.

---

## Tasks Completed (3 Marks)

- **Task 1:** Based on direct Professor feedback, transitioned the Employee Skills mapping from a 'Self-Service' model to a strict 'Manager-Controlled' architecture. The Manager Dashboard now includes a dedicated UI to allocate structured operational skills (Hardware, Network, etc.) to staff members, ensuring centralized authorization.
- **Task 2:** Built the Agent Performance Leaderboard in the dashboard's "Command Center" tab. It asynchronously fetches and ranks the top 10 agents, displaying their `sla_compliance` percentage and `total_tickets` resolved, replacing rigid mock data with live operational metrics.
- **Task 3:** Fixed critical workload tracking inaccuracies. Employee `current_ticket_load` counters were previously inflating because they didn't decrement correctly. Implemented strict decrement triggers across `tickets.py` that execute on status changes (RESOLVED, CLOSED), ticket deletions, and manual reassignment.

---

## Work Progress (3 Marks)

- **Current Status:** 88% completed

- **Milestones Achieved:**
  - ✅ Centralized Skill Management: Managers dictate IT capabilities, preventing unauthorized reassignment exploitation.
  - ✅ Live Leaderboard: Individual agent SLAs and ticket counts are now perfectly visible based on live data.
  - ✅ Workload Synchronization: The assignment capacity limit exactly mirrors active DB states.

- **Challenges Faced:**
  - **Challenge 1:** Manager skill assignments were not automatically invalidating cached team routing lists.
  - **Resolution:** Decoupled skill query arrays in the `auto_assign_ticket` routine so they always query the live document state on POST instead of relying on cached team properties.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - Modifying DB model relationships to centralize authorization from `User` self-edits to `Manager` Role-Based Access Controls (RBAC).
  - Building performant aggregation pipelines in MongoEngine to calculate the Leaderboard metrics efficiently.
- **Soft Skills:**
  - Adapting architectural design instantly based on stakeholder (Professor) feedback.

---

## Plan for Next Week

- **Task 1:** Create an interactive graphical interface for Agent Performance analytics.
- **Task 2:** Introduce a Customer-initiated "Escalation" workflow.
- **Task 3:** Incorporate visual UI Badging to alert staff of escalated priorities.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
