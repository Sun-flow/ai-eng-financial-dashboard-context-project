# Financial Metrics Dashboard - Product Overview

> **Updated**: October 9, 2026

## Product and Boundary

- Read-only executive dashboard for seeded mock income/outcome movements (seed=42, `@lru_cache`-backed for deterministic repeatability).
- UI: KPI cards, monthly income-vs-outcome chart, monthly profit-margin chart.
- No auth, persistence, database, writes, or production data integration.
- 9 API routes: `/health`, `/api/metrics`, `/api/metrics/{facets,summary,categories/top,comparison,alerts,b2b,b2c}`.
- Compose services start individually, but host bridge networking blocks inter-service traffic; local development is the workaround.

## Architecture and Data Flow

- Flow: `useFinancialData` fetches `/api/metrics` -> pure utilities compute KPIs/monthly data/period label -> `App.tsx` passes state to presentational components (KPIRow, IncomeOutcomeChart, ProfitPercentChart, all wrapped in ErrorBoundary).
- Backend: `APIRouter` + Pydantic contracts + cached deterministic mocks (seed=42, `@lru_cache`). Key business logic: `generate_mock_movements`, `filter_movements`, `summarize_movements`, `build_top_categories`, `detect_outcome_alerts`, `build_metrics_facets`.
- Frontend: component composition; no global state library.

## Key Files

- `backend/app/routes.py` — 9 routes, Pydantic models, mock generation (`@lru_cache`), filters, alerts
- `backend/app/main.py` — FastAPI app (module-level), CORS, router inclusion
- `frontend/src/App.tsx` — composition root, error boundary wrapper
- `frontend/src/hooks/use-financial-data.ts` — fetch + async state
- `frontend/src/lib/financial-utils.ts` — pure calculations (KPIs, monthly data, formatting, period label)
- `frontend/src/components/dashboard/` — KPI cards, income/outcome chart, profit chart
- `docker-compose.yml` — service orchestration, health dependency, env vars
