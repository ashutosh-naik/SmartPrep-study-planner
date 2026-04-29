# SmartPrep Study Planner

## What This Is
SmartPrep is an adaptive study planner and exam analytics platform. It is a full-stack web application built using React 19, Spring Boot, and PostgreSQL. The application relies on a premium UI utilizing modern aesthetic principles, Lucide icons, dynamic Recharts, and sleek animations. 

The primary goal of the current project cycle is to eliminate the application's reliance on temporary browser `localStorage` and migrate all core study features (Pomodoro sessions, Target Goals, Task management) into permanent Spring Boot API endpoints backed by a PostgreSQL database.

## Core Value
To provide students with a state-of-the-art, seamless exam preparation experience where their tasks, tracking analytics, and goals are securely persisted across multiple sessions and devices.

## Requirements

### Validated
- ✓ Premium UI styling (emoji-free, Lucide-React icons, responsive Tailwind layout)
- ✓ Functional Dashboard with dynamic Target Goals and KPI cards
- ✓ Advanced Analytics page populated by Recharts (Pie and Bar graphs)
- ✓ Adaptive Study Planner with core Drag-and-Drop functionality
- ✓ Functional Pomodoro Focus timer

### Active
- [ ] Implement backend Spring Data JPA entities for Tasks, Goals, and Pomodoro Sessions
- [ ] Develop RESTful Controllers to manage CRUD operations for study data
- [ ] Refactor React frontend services to use Axios API calls instead of checking `localStorage`
- [ ] Add explicit data transfer objects (DTOs) to prevent entity structure leaking or lazy-loading bugs
- [ ] Integrate rudimentary user identification/authentication to allow session tracking

### Out of Scope
- [ ] Mobile App Native Development — Focus must remain strictly on the responsive Web Application format.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Migrate away from Local Storage | `localStorage` provides zero cross-device synchronization and fails the core requirement of a dynamic system. | — Pending |
| Adopt strict Spring Data / REST architecture | Ensures robust, scalable backend operations suitable for a premium product. | — Pending |

---
*Last updated: April 13, 2026 after initialization*
