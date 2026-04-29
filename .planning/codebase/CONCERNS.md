# CONCERNS
## Technical Debt & Issues
1. **State Persistence:** Several key metrics (Goals, Analytics, Pomodoro Study amounts) rely heavily on Browser `localStorage`. If a user logs into a separate machine, their data will suddenly appear missing because it sits strictly in local caching. The API logic needs to be fully extended so metrics propagate downstream to the PSQL database.
2. **Cache Sticking:** The Vite server has aggressive caching logic when handling CSS token modifications to `index.css`. This inherently mandates the `!important` tag across many global variables.
3. **Missing DTOs:** Backend currently relies heavily on mapping direct DB Entities to Controller requests. This might trigger Lazy Loading exceptions or unintentional data leakage unless separate DTO models are standardized.
4. **Vulnerable Links:** Reliance on external internet resources (like `picsum.photos`) often results in broken images due to local network policies. Using standard Lucide SVG icons and Tailwind gradients provides infinitely better resiliency.
