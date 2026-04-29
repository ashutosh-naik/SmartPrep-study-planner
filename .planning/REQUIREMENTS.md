# Requirements

## Epic: Database Migration & Core Persistence

### Functional Requirements
- **FR1: Task Management API:** The backend must support CRUD operations for Tasks.
- **FR2: Target Goals API:** The backend must sync and store Target Goals (including linking via Subject IDs).
- **FR3: Pomodoro Sessions API:** The backend must track study sessions and aggregate focus hour amounts remotely.
- **FR4: Subject Mastery API:** Tracking completed tasks must map backward so subject total times update via DB joins or direct entity tracking instead of purely frontend math.
- **FR5: Basic User Account (Mock Login):** For testing purposes, implement a mock User ID system on the front end which binds the tasks on the backend to a specific database user ID. (We can use a dummy UUID string representing the local machine pending a real OAuth implementation later).

### Non-Functional Requirements
- **NFR1: Consistency:** Discard all major data writes to `localStorage` across `TaskTracker.jsx`, `Dashboard.jsx`, and `StudyPlanner.jsx`. Retain `localStorage` only for strictly stateless UI toggles (e.g., dark mode, drawer state).
- **NFR2: Performance:** Switch frontend to Axios intercepts, loading user data completely on app initialize. No jitter.
- **NFR3: Architectural Coupling:** Develop proper DTO schemas and `ModelMapper` logic to decouple the Database Entity from the JSON Response format over the wire.
