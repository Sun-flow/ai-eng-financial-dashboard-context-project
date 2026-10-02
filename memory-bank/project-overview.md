# Financial Metrics Dashboard - Product Overview

## Product and Boundary

- Read-only executive dashboard for seeded mock income/outcome movements.
- UI: KPI cards, monthly income-vs-outcome chart, monthly profit-margin chart.
- No auth, persistence, database, writes, or production data integration.
- 9 API routes: `/health`, `/api/metrics`, `/api/metrics/{facets,summary,categories/top,comparison,alerts,b2b,b2c}`.
- Compose services start individually, but host bridge networking blocks inter-service traffic; local development is the workaround.

## Architecture and Data Flow

- Flow: `useFinancialData` fetches `/api/metrics` -> pure utilities derive KPIs/months/formatting/period -> `App.tsx` passes state to presentational components.
- Backend: `APIRouter` + Pydantic contracts + cached deterministic mocks.
- Frontend: component composition; no global state library.

## Key Files

- `backend/app/routes.py` — 9 routes, Pydantic models, mock generation (`@lru_cache`), filters, alerts
- `backend/app/main.py` — FastAPI app, CORS, router inclusion
- `frontend/src/App.tsx` — composition root, error boundary wrapper
- `frontend/src/hooks/use-financial-data.ts` — fetch + async state
- `frontend/src/lib/financial-utils.ts` — pure calculations (KPIs, monthly data, formatting, period label)
- `frontend/src/components/dashboard/` — KPI cards, income/outcome chart, profit chart
- `docker-compose.yml` — service orchestration, health dependency, env vars
