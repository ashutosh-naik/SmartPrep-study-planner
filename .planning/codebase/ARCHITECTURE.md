# ARCHITECTURE
## Architecture Pattern
SmartPrep uses a standard Monolithic Client-Server architecture.
- **Frontend (View/State):** Client rendered React-Redux application.
- **Backend (API):** Spring Boot monolithic service.

## Data Flow
- React components dispatch actions or initiate Axios HTTP calls directly to API controllers.
- Many frontend state features actually rely heavily on browser `localStorage` to avoid heavy database loads (e.g. streaks, basic task items sometimes, subject Pomodoro timers).
- Spring Boot intercepts API calls, translates via JPA to PostgreSQL, and returns DTO models back to the Vite dev server.

## Abstraction Layers
- Frontend features are bucketed mostly into Page Containers (`Dashboard.jsx`, `StudyPlanner.jsx`, `Analytics.jsx`).
- UI Components are modularized (`ProgressBar`, `Navbar`, etc.).
- There is a `taskService.js` and `plannerService.js` abstraction used for fetching data from the backend to loosely couple components from Axios.
