# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Build static assets to dist/
npm run preview  # Preview production build locally
```

Deployment is automatic via GitHub Actions on push to main — builds and deploys to GitHub Pages at `https://eat-real.github.io/tasty-full/`.

## Architecture

**Stack:** Vite + React 18 SPA (no SSR), deployed as static files to GitHub Pages. Backend planned via Supabase (not yet integrated).

**Monolithic structure:** The entire app lives in `src/App.jsx` (~2000 lines) — all components, state, data, translations, and business logic in one file. `src/main.jsx` is just the React entry point.

### Key architectural patterns

- **Routing:** No react-router. Simple `page` state variable (`home`, `menu`, `planner`, `orders`) with conditional rendering.
- **State:** All state via React hooks (`useState`, `useRef`, `useCallback`). No external state management.
- **Responsive:** Custom `useMedia()` hook. Separate desktop and mobile component trees (e.g. `PlannerPage` vs `MobilePlannerPage`, `HeroPage` vs `MobileHero`).
- **i18n:** Centralized `T` object with translations for 6 languages (en, pt, es, fr, uk, ru). Language stored in `lang` state.
- **Styling:** Inline styles only. No CSS framework.

### Data model (in-memory, frontend only)

- `ALL_DISHES` — array of dish objects with `id`, `cat` (breakfast/soup/main/special), multilingual `name`, nutrition (`kcal`, `p`, `f`, `c`), `price` (EUR), `diet` flags (`vegan`, `gf`, `lf`), `portions`, `img` (Unsplash URLs).
- **Delivery system:** 3 deliveries/week (Mon/Wed/Fri). Meals grouped into delivery blocks. `DELIVERY_FEE`: €5, `FREE_THRESHOLD`: €50.
- **Diet filtering:** `dietBlock(dish, userDiet)` checks compatibility. Three filters: vegan, gluten-free, lactose-free.

### Component map inside App.jsx

- **Pages:** `HeroPage`/`MobileHero` (landing), `MenuPage` (browse), `PlannerPage`/`MobilePlannerPage` (weekly planner), `OrdersPage` (history)
- **Modals:** `AuthModal` (login/register), `ProfileModal` (diet prefs), `Checkout` (order)
- **Planner pieces:** `PSlot` (meal slot), `SidebarDish` (draggable dish), `BonusCell`, `OfficeCell`

## Important context

- `vite.config.js` sets `base: '/tasty-full/'` for GitHub Pages path prefix.
- `index.html` defaults to `lang="ru"`.
- PRD (`prd.md`) describes full target system with Supabase schema, Stripe payments, RLS policies — most of this is not yet implemented.
- Payment options in current UI: MBWay, Cash, USDT (placeholder, no real integration).
