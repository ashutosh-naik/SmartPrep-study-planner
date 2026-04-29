# TESTING
## Current State
- **Frontend Testing:** No dedicated unit testing framework (like Jest or React Testing Library) is actively wired into standard practice. Application relies heavily on manual functional verification.
- **Backend Testing:** Default Spring Boot Starter Test is included, but comprehensive API integration testing logic (MockMvc or TestRestTemplate) is largely unpopulated.

## Recommendations
- Needs explicit end-to-end Cypress or Playwright tests added for complex components like the Pomodoro Timer tracking or Planner Drag/Drop logic.
