# STRUCTURE
## Root Layout
- `/frontend`: Contains the Vite+React application.
- `/backend`: Contains the Maven+Java Spring Boot application.

## Frontend Directory (`/frontend/src/`)
- `/components`: Reusable UI elements (`Navbar.jsx`, `Skeleton.jsx`, `EmptyState.jsx`, `PomodoroTimer.jsx`).
- `/pages`: Main routed views (`dashboard`, `planner`, `tasks`, `analytics`).
- `/utils`: Helper functions (`constants.js`, `dateUtils.js`, `calculationUtils.js`).
- `/services`: API handler logic (`taskService.js`, `plannerService.js`).
- `/assets`: Images and styling (Tailwind CSS configuration).

## Backend Directory (`/backend/src/main/`)
- `/java/com/smartprep/model`: Spring entities (`User.java`, `Task.java`).
- `/java/com/smartprep/controller`: Spring REST endpoints.
- `/resources`: Configuration properties (`application.properties`).
