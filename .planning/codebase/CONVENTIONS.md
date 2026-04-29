# CONVENTIONS
## Frontend Conventions
- **Styling:** Adheres completely to Tailwind CSS inline-classes. Avoids raw CSS unless necessary to override default values or Vite caching (`!important` usage in `index.css`).
- **Icons:** Strict 'No-Emoji' policy. Uses **Lucide React** icon equivalents exclusively to enforce a premium design paradigm.
- **Color Palette:** Premium scheme leveraging hex `#2563EB` (Primary Blue), `#7C3AED` (Purple Accent), and `#14B8A6` (Teal Accent).
- **Typography:** Relies heavily on **Poppins** for headings and **Inter** for body text.

## Backend Conventions
- **Structure:** Traditional Spring MVC logic (`Controller -> Model`).
- **Data Transport:** Uses Jackson serialization directly connecting Models via Controllers without strict DTO interfaces observed in base files.
