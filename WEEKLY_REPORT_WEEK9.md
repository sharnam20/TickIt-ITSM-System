# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 9 |
| **Reporting Period** | 16-03-26 to 23-03-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Implement an Automatic SLA-breach Escalation background worker.
- **Objective 2:** Combine Auto-Reassignment logic into the SLA-breach workflow.
- **Objective 3:** Deploy Offline Data Export functions for Manager auditing.

---

## Tasks Completed (3 Marks)

- **Task 1:** Developed a revolutionary Automatic SLA monitoring script (`check_sla_and_auto_escalate`). Hooked into the main GET `/tickets` handler, the system automatically sweeps the DB for active tickets where `sla_due_at < utcnow()`. It transparently flags them as `ESCALATED`, changes `sla_status` to 'BREACHED', and elevates priority to 'HIGH'.
- **Task 2:** Connected the Intelligent Routing algorithm to the SLA Breach worker with a strict Accountability Penalty. When a ticket breaches, it is taken from the failing agent, and their `failed_sla_tickets` database tally is permanently incremented. The ticket is then passed back through the smart routing algorithm (now utilizing an `exclude_user_id` parameter to ensure the failing agent is never re-assigned that same ticket).
- **Task 3:** Integrated Historical Penalties into the Agent Performance Leaderboard. Rewrote the `/api/stats/agent-performance` aggregation to ensure historical SLA breaches permanently drag down an agent's "SLA Compliance %", allowing managers to visually identify degrading staff members. Made the CSV Export capability function fully via an Axios blob download to dump schema-compliant operational history.

---

## Work Progress (3 Marks)

- **Current Status:** 97% completed

- **Milestones Achieved:**
  - ✅ Automated Compliance Check: System perfectly monitors its own metrics without human oversight.
  - ✅ Self-Healing Ticket Queue: Deadlocked tickets jump to active agents automatically.
  - ✅ Accountable Benchmarking: Degrading employee performance is explicitly caught and visually exposed on the Leaderboard.

- **Challenges Faced:**
  - **Challenge 1:** Exported CSV files failed to download securely, generating unauthorized errors because normal HTML `<a href>` links don't carry the JWT headers.
  - **Resolution:** Re-wrote the frontend to handle CSV exports using `axios` with an explicit `{ responseType: 'blob' }` directive and a programmatic javascript DOM link click.
  - **Challenge 2:** The auto-escalation algorithm created an infinite loop by randomly re-assigning breached tickets straight back to the original agents, and failing randomly when agents shared identical load counts.
  - **Resolution:** Refactored the backend algorithm to explicitly block the original agent's `ObjectId` from candidacy, and introduced a secondary `order_by('id')` tie-breaker to ensure round-robin fairness when workloads match perfectly.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - Advanced Blob data handling in Javascript/React for triggering file downloads securely.
  - Writing background execution logic tied to HTTP lifecycle events in Flask.
- **Soft Skills:**
  - Closing the IT Service loop: ensuring tickets don't sit unresolved indefinitely by designing a self-repairing queue architecture.

---

## Plan for Next Week

- **Task 1:** Run final End-to-End lifecycle tests on recent automation logic.
- **Task 2:** Resolve any last remaining infrastructure/port configuration bugs.
- **Task 3:** Lock the codebase, compile the presentation demo scripts, and submit the final project.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
