# INTEGRATIONS
## Frontend Libraries
- **Google OAuth:** `@react-oauth/google` for authentication.
- **LocalStorage:** For persistent offline synchronization (Pomodoro counters, streaks, cached states).
- **Vite Proxy:** Uses Vite proxy config to communicate with `http://127.0.0.1:8081` (Spring Boot).

## Backend Integration
- **PostgreSQL:** Uses Spring Data JDBC connect.
- No major 3rd party webhooks observed (currently localized to student portal logic).
- API mapping via standard Spring `@RestController` controllers parsing JSON.
