# Financial Metrics Dashboard - Product Overview

## Product and Boundary

- Read-only executive dashboard for seeded mock income/outcome movements.
- UI: KPI cards, monthly income-vs-outcome chart, monthly profit-margin chart.
- No auth, persistence, database, writes, or production data integration.
- API routes (9): `/health`; `/api/metrics`; `/api/metrics/facets`; `/api/metrics/summary`.
- More routes: `/api/metrics/categories/top`; `/api/metrics/comparison`; `/api/metrics/alerts`; `/api/metrics/b2b`; `/api/metrics/b2c`.
- Compose services start individually, but host bridge networking blocks inter-service traffic; local development is the workaround.

## Architecture and Data Flow

- Flow: `useFinancialData` fetches `/api/metrics` -> pure utilities derive KPIs/months/formatting/period -> `App.tsx` passes state to presentational components.
- Backend: `APIRouter` + Pydantic contracts + cached deterministic mocks.
- Frontend: component composition; no global state library.

## Key Files

- `backend/app/main.py`: FastAPI app, CORS middleware, and router inclusion
- `backend/app/routes.py`: API models, route handlers, filtering, summaries, alerts, and mock generation
- `backend/tests/`: shared TestClient fixture and endpoint tests
- `frontend/src/App.tsx`: composition and error boundary
- `frontend/src/hooks/use-financial-data.ts`: fetch, async state, and derived data
- `frontend/src/components/dashboard/`: KPI and chart presentation
- `frontend/src/lib/financial-utils.ts`: pure calculations and formatting
- `docker-compose.yml`: service orchestration and health dependency

**Evidence**: `backend/app/routes.py`; `frontend/src/`; `backend/requirements*.txt`; `frontend/package.json`; `.agents/rules/`.
