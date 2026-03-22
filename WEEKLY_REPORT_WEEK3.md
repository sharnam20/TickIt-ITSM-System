# WEEKLY REPORT

## Project Details

| Field | Details |
|---|---|
| **Project Title** | Intelligent Ticket Assignment & SLA-Based Workload Management System |
| **Student Names and Roll No** | Sharnam Shah (23CS089), Het Soni (23CS097) |
| **Project Mentor(s)** | Dr. Jigar Sarda, Srushti Gajjar |
| **Academic Mentor** | Dr. Jigar Sarda |
| **Week Number** | Week 3 |
| **Reporting Period** | 02-02-26 to 09-02-26 |

---

## Weekly Objectives (2 Marks)

- **Objective 1:** Implement Team Management module for Managers to create teams and assign staff members.
- **Objective 2:** Enhance the "Create Ticket" workflow with integrated Knowledge Base suggestions.
- **Objective 3:** Build the Customer Feedback system (Ratings & Comments) for resolved tickets.

---

## Tasks Completed (3 Marks)

- **Task 1:** Developed the full Team Management feature (`Team.jsx`, `routes/teams.py`) allowing Managers to create teams with names, descriptions, skills, and assigned members. Built a Teams API with CRUD operations and a `Team` MongoDB model with lead, members, and skill fields.

- **Task 2:** Integrated a real-time "Suggested Solutions" engine into the ticket creation flow (`solutionService.js`, `CreateTicketModal.jsx`). As the user types a ticket description, the system queries the backend's keyword-matching algorithm (`/api/solutions/suggest`) and displays relevant help articles before submission.

- **Task 3:** Implemented Customer Feedback on resolved tickets by adding `rating` (1–5 stars) and `feedback_comment` fields to the Ticket model. Built the feedback submission API (`/api/cx/`) and added star-rating UI components on the Customer Dashboard for completed tickets.

---

## Work Progress (3 Marks)

- **Current Status:** 50% completed

- **Milestones Achieved:**
  - ✅ Team Management Module Live: Managers can now create and manage cross-functional teams.
  - ✅ Smart Ticket Creation: Customers receive AI-suggested solutions before submitting, potentially reducing ticket volume.
  - ✅ Feedback Loop Completed: End-to-end customer satisfaction tracking from ticket creation to resolution review.

- **Challenges Faced:**

  - **Challenge 1:** MongoEngine `ReferenceField` causing cascading deletion issues when removing team members from a team.
  - **Resolution:** Configured `reverse_delete_rule=db.PULL` for team member references, allowing safe member removal without deleting the user document.

  - **Challenge 2:** The Solution suggestion API returning duplicate results when matching both title and keyword fields.
  - **Resolution:** Added deduplication logic in `suggest_solutions()` to filter unique suggestions and cap results at 5 items.

---

## Learnings and Skills Acquired (2 Marks)

- **Technical Skills:**
  - MongoDB document relationships and referencing patterns (ReferenceField, ListField).
  - Real-time search/suggestion APIs with keyword-based matching algorithms.
  - Star-rating UI component design with interactive hover states.

- **Soft Skills:**
  - Understanding the importance of feedback loops in ITSM workflows.
  - Designing manager-level vs customer-level feature hierarchies.

---

## Plan for Next Week

- **Task 1:** Build the Knowledge Base (Articles CRUD) for Managers to publish help guides and FAQs.
- **Task 2:** Implement SLA Rules Engine for automated deadline calculation based on ticket priority.
- **Task 3:** Develop the Notification system for real-time alerts on ticket status changes.

---

## Remarks from Mentors

- **Academic Mentor's Feedback:**
