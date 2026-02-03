# Data Flow Diagrams (DFD)

**Project:** University Management System (UMS)

This file contains DFD Level 0 (Context), Level 1 (Module decomposition), and Level 2 (detailed flows for Routine creation and Research workflow).

---

## DFD Level 0 (Context Diagram)

**Summary:** A user interacts with the University Management System through the web UI. The UMS processes requests via backend APIs and reads/writes data to the database. Responses are returned to the user.

```mermaid
flowchart LR
  User[User (Student/Faculty/Admin)]
  UMS((University Management System))
  DB[(Database
MySQL (XAMPP) / SQLite)]

  User -->|Login/Register,
View/Submit/Manage data| UMS
  UMS -->|Responses (JSON/UI)| User

  UMS <--> |Read/Write| DB
```

**External Entity:** User (Student/Faculty/Admin)  
**System:** University Management System (UMS)  
**Data Store:** Database (MySQL via XAMPP or SQLite)

---

## DFD Level 1 (System Decomposition)

**Summary:** The UMS is decomposed into major processes/modules. Each module reads/writes to the database and returns module-specific responses.

```mermaid
flowchart TB
  User[User (Student/Faculty/Admin)]
  DB[(Database)]

  subgraph UMS[University Management System]
    P1((1.0 Authentication & Authorization))
    P2((2.0 Routine Management))
    P3((3.0 Research Paper Management))
    P4((4.0 Hostel Management))
    P5((5.0 Dashboard & Reporting))
    P6((6.0 Department & Teacher Directory))
    P7((7.0 Activity Logging / Audit))
  end

  User -->|Register/Login/OTP| P1
  P1 <--> DB

  User -->|Create/View/Update Routines| P2
  P2 <--> DB
  P2 -->|Log actions| P7

  User -->|Submit/View/Update Papers| P3
  P3 <--> DB
  P3 -->|Log actions| P7

  User -->|Allocate/View Hostel| P4
  P4 <--> DB
  P4 -->|Log actions| P7

  User -->|View Stats/Accounts/Results| P5
  P5 <--> DB

  User -->|Browse Departments/Teachers| P6
  P6 <--> DB

  User -->|View Logs (Admin)| P7
  P7 <--> DB
```

**Key Data Stores Used (examples):**
- `users`, `login_attempts`
- `routines`
- `research_papers`
- `hostel_students`
- `student_results`, `student_accounts`, `payment_history` (dashboard)
- `departments`, `teachers`
- `activity_logs`

---

## DFD Level 2 (Detailed Flows)

### 2.1 Routine Creation Flow (Faculty/Admin)

**Goal:** Faculty/Admin creates a class routine that students can later view by batch/department.

```mermaid
flowchart TD
  Actor[Faculty/Admin] -->|1. Submit routine form| FE[Frontend (React)]
  FE -->|2. POST /api/routines
Authorization: Bearer JWT| API[Backend API (Express)]

  API -->|3. Verify JWT| Auth[Auth Middleware]
  Auth -->|4. Check role
(faculty/admin)| RBAC[Role Check]

  RBAC -->|5. Validate fields
(department,batch,semester,shift,courses,time_slots)| Val[Validation]
  Val -->|6. Insert routine| DB[(Database: routines)]

  API -->|7. Write audit entry| LogDB[(Database: activity_logs)]

  DB -->|8. Return created routine (id)| API
  API -->|9. JSON response| FE
  FE -->|10. UI success message| Actor
```

**Inputs:** routine form data + JWT token  
**Outputs:** created routine record + audit log entry

---

### 2.2 Research Paper Workflow (Submit + Status Update)

**Goal:** Faculty submits a paper; Admin can update its status (Draft → Under Review → Published/Rejected).

```mermaid
flowchart TD
  Faculty[Faculty] -->|1. Submit paper details| FE1[Frontend (React)]
  FE1 -->|2. POST /api/research-papers
Authorization: Bearer JWT| API1[Backend API]

  API1 -->|3. Verify JWT + role| Auth1[Auth + RBAC]
  Auth1 -->|4. Validate fields| Val1[Validation]
  Val1 -->|5. Insert paper (Draft by default)| PapersDB[(Database: research_papers)]
  API1 -->|6. Log action| LogsDB1[(Database: activity_logs)]

  PapersDB -->|7. Return created paper| API1
  API1 -->|8. JSON response| FE1
  FE1 -->|9. UI confirmation| Faculty

  Admin[Admin] -->|10. Update status| FE2[Frontend (React)]
  FE2 -->|11. PATCH /api/research-papers/:id/status
Authorization: Bearer JWT| API2[Backend API]

  API2 -->|12. Verify JWT + admin role| Auth2[Auth + RBAC]
  Auth2 -->|13. Validate status
(Draft/Under Review/Published/Rejected)| Val2[Validation]
  Val2 -->|14. Update status + updated_at| PapersDB
  API2 -->|15. Log change| LogsDB2[(Database: activity_logs)]

  PapersDB -->|16. Return updated paper| API2
  API2 -->|17. JSON response| FE2
  FE2 -->|18. UI success| Admin
```

**Inputs:** paper data / status change request + JWT token  
**Outputs:** updated `research_papers` record + audit logs

---

## Notes

- The database layer supports both **MySQL (XAMPP)** and **SQLite**; the data flows remain the same because controllers use a consistent `db.query()` interface.
- Activity logging is shown as a separate data store (`activity_logs`) to emphasize auditing and accountability.
