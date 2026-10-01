# Development Rules — Financial Dashboard

> **Last updated**: 2026-10-01  
> **Purpose**: Axiom-like rules for development, each grounded in at least one concrete repo fact. Rules are ordered from most universally applicable to most specific. This document expands as new insights emerge.

---

## How Rules Are Structured

```
RULE N: <Statement>
  └─ Fact: <Repo evidence that grounds the rule>
```

Rules supported by **multiple independent facts** are considered stronger and more fundamental.

---

## Tier 1: Universal Principles

These rules apply across the entire repository — frontend, backend, and infrastructure alike.

### RULE 1: Declared dependencies must be exhaustive; every import must resolve to a declared or stdlib dependency.

- **Fact 1a:** `pydantic` is imported in `routes.py` and listed in `requirements.txt` as `pydantic==2.13.5` — declared dependency resolved. ([routes.py] [requirements.txt])
- **Fact 1b:** All 20 frontend packages in `package.json` are confirmed used in code, and no used import lacks a matching package entry. ([health-assessment.md] Dependency Status table)
- **Fact 1c:** `pytest-cov` is not listed in `requirements.txt` — coverage is not currently configured. ([requirements.txt])

**Corollary 1.1:** Unused dependencies must be removed.

### RULE 2: Configuration that differs between environments must be parameterized, not hardcoded.

- **Fact 2a:** The Vite proxy target is driven by `VITE_API_PROXY_TARGET` env var (defaults to `http://localhost:8000` for local dev) — no longer hardcoded to the Docker-only `http://backend:8000`. ([vite.config.ts])
- **Fact 2b:** `.env.example` documents `VITE_API_BASE_URL` for backend origin override; the proxy target variable is documented in `docker-compose.yml`. ([frontend/.env.example] [docker-compose.yml])
- **Fact 2c:** CORS origins are driven by `CORS_ORIGINS` env var (comma-separated, default `"*"`). The `*` default is permissive for development but should be locked down in production. ([main.py])

**Corollary 2.1:** Hardcoded values that depend on environmental context (Docker vs. local, dev vs. prod) are bugs waiting to surface.

### RULE 3: Every non-trivial state path (loading, error, empty, success) must be explicitly handled in the UI.

- **Fact 3a:** `App.tsx` shows a skeleton via `<Skeleton>` when `loading` is true, a red error banner when `error` is non-null, and renders data otherwise — all three branches covered. ([conventions.md] §4.1 & §4.2)
- **Fact 3b:** Both `income-outcome-chart.tsx` and `profit-percent-chart.tsx` check for all-zero data and render `"No data available"` as an empty-state fallback. ([conventions.md] §4.3)
- **Fact 3c:** An `ErrorBoundary` component wraps `<Dashboard />` in `App.tsx`, catching render errors and displaying a fallback UI instead of crashing. It also has a `.test.tsx` suite with 3 tests (normal render, catch+fallback, custom fallback). ([error-boundary.tsx] [error-boundary.test.tsx])

**Corollary 3.1:** New components added inside `<ErrorBoundary>` are automatically covered. No additional error boundary is required.

### RULE 4: Side effects belong at the container level; presentational components must be pure.

- **Fact 4a:** The `useFinancialData` custom hook in `hooks/use-financial-data.ts` is the sole owner of state (`useState` for `metrics`, `monthlyData`, `periodLabel`, `loading`, `error`) and data-fetching logic — no child component manages its own fetch or global state. `App.tsx` destructures the hook's return and passes values as props. ([conventions.md] §1.1)
- **Fact 4b:** `kpi-card.tsx`, `kpi-row.tsx`, `dashboard-header.tsx`, `income-outcome-chart.tsx`, and `profit-percent-chart.tsx` receive all data via props and contain no data-fetching logic. ([project-map.md] Component Tree)

**Corollary 4.1:** Child components must not import `fetch`, `axios`, or any HTTP client.

---

## Tier 2: Language & Framework Rules

These rules are language-specific (TypeScript/React or Python/FastAPI) but cross multiple files.

### TypeScript / React

### RULE 5: File names use kebab-case; exported symbols use PascalCase (components/types) or camelCase (functions/variables).

- **Fact 5a:** Components: `kpi-card.tsx` → `KPICard`, `kpi-row.tsx` → `KPIRow`, `dashboard-header.tsx` → `DashboardHeader`. ([conventions.md] §2.1)
- **Fact 5b:** Utilities: `financial-utils.ts` → `computeKPIs`, `formatCurrency`, `formatPercent`. ([conventions.md] §2.1)
- **Fact 5c:** Types: `financial-types.ts` → `FinancialMovement`, `KPIMetrics`, `MonthlyDataPoint`. ([conventions.md] §2.1)

**Corollary 5.1:** New component files must follow this naming pattern without exception.

### RULE 6: The `@/` path alias must be used for cross-directory imports; relative imports are for siblings only.

- **Fact 6a:** `kpi-row.tsx` imports `./kpi-card` (relative) — same-directory sibling. ([health-assessment.md] Component Imports table)
- **Fact 6b:** `kpi-card.tsx` imports `@/lib/financial-utils` and `@/components/ui/skeleton` (alias) — cross-directory. ([health-assessment.md] Component Imports table)

### RULE 7: Data transformation must live in pure utility functions, not inside components or hooks.

- **Fact 7a:** `computeKPIs`, `computeMonthlyData`, and `computePeriodLabel` are standalone exported functions in `financial-utils.ts`, imported and called inside `useFinancialData()` between fetch and return. ([project-map.md] Data Flow section)
- **Fact 7b:** Both functions accept `FinancialMovement[]` and return derived types — no side effects, no state access. ([conventions.md] §1.3)

### RULE 8: Recharts components must use consistent color semantics: green (`#10b981`) for income, red (`#ef4444`) for outcome.

- **Fact 8a:** CSS variables declare `--chart-income: oklch(0.62 0.2 255)` (blue hue) and `--chart-outcome: oklch(0.68 0.18 30)` (orange hue), violating the intended green/red semantic. ([index.css])
- **Fact 8b:** `profit-percent-chart.tsx` uses a dashed reference line to indicate the zero/profitability boundary. ([conventions.md] §5.2)

### Python / FastAPI

### RULE 9: Backend code must use snake_case for functions, variables, and API parameter names.

- **Fact 9a:** Functions: `generate_mock_movements`, `filter_movements`, `summarize_movements`, `calculate_net_value`. ([project-map.md] Backend Details)
- **Fact 9b:** Parameters: `operation_type`, `business_type`, `create_date`, `start_date`, `end_date`. ([project-map.md] Data Models table)

### RULE 10: API routes must be registered on an `APIRouter` instance, not directly on the app.

- **Fact 10a:** `routes.py` creates `router = APIRouter()` and decorates all handlers with `@router.get(...)`. ([conventions.md] §1.2)
- **Fact 10b:** `main.py` includes the router via `app.include_router(routes.router)` during app initialization. ([conventions.md] §1.2)

### RULE 11: Mock data generators must use a fixed seed for reproducibility and must be cached, not regenerated per request.

- **Fact 11a:** `generate_mock_movements(seed=42)` uses a deterministic seed — output is reproducible. ([project-map.md] Backend Details)
- **Fact 11b:** The function is decorated with `@lru_cache(maxsize=1)`, so the 360 movements are generated once (keyed by the `(seed, today)` tuple) and served from cache on all subsequent requests — no per-request rebuild. ([routes.py])
- **Fact 11c:** `_year_for_month` uses `date.today()` for year assignment when `today` is `None` (the default caller), making the initial cache-fill output date-dependent despite the fixed seed. ([operational-blockers.md] Issue #3)

---

## Tier 3: Infrastructure & Configuration Rules

### RULE 12: Docker Compose services that depend on other services must use healthchecks, not just `depends_on`.

- **Fact 12a:** `docker-compose.yml` specifies `depends_on: { backend: { condition: service_healthy } }` — the frontend waits for the backend healthcheck to pass before starting. ([docker-compose.yml])
- **Fact 12b:** The backend service defines a `healthcheck` block curling `http://localhost:8000/health` with 10s interval, 5s timeout, 3 retries, and 10s start period. ([docker-compose.yml])

### RULE 13: Production Docker images must be distinct from development images (multi-stage, no debugger, no reload).

- **Fact 13a:** `backend/Dockerfile` uses multi‑stage build with three targets: `base` (Python 3.13-slim + curl), `development` (adds `debugpy` and `requirements-dev.txt`), and `production` (no debugger, plain `uvicorn`). The `development` target intentionally omits `--reload` to avoid the bind‑mount restart loop. ([backend/Dockerfile])
- **Fact 13b:** The production target runs `uvicorn app.main:app` without debugpy, serving HTTP on port 8000. ([backend/Dockerfile])

### RULE 14: Python dependencies must be pinned to specific versions for reproducible builds.

- **Fact 14a:** `requirements.txt` pins `fastapi==0.141.1`, `uvicorn[standard]==0.53.0`, and `pydantic==2.13.5` to specific versions. ([health-assessment.md] Backend Dependencies)
- **Fact 14b:** No lockfile (`requirements.lock`, `Pipfile.lock`, or `poetry.lock`) exists. ([health-assessment.md] Code Quality Observations — Infrastructure)

---

## Tier 4: Testing Rules

### RULE 15: Backend routes must be tested via `TestClient` with isolated app instances.

- **Fact 15a:** `test_routes.py` imports `from fastapi.testclient import TestClient` and creates the client at module level. ([health-assessment.md] Python Imports — tests)
- **Fact 15b:** 15 test functions cover mock generation, health endpoint, filter combinations, date ranges, and B2B/B2C filtering. ([project-map.md] Backend Tests)

### RULE 16: Frontend utility functions must have Vitest unit tests with `describe`/`it` blocks.

- **Fact 16a:** `financial-utils.test.ts` contains 9 test cases across 4 `describe` blocks (`computeKPIs` (2), `computeMonthlyData` (1), `formatters` (2), `computePeriodLabel` (4)). ([health-assessment.md] Frontend Tests)
- **Fact 16b:** Frontend components now have render tests: `error-boundary.test.tsx` (3), `dashboard-header.test.tsx`, `income-outcome-chart.test.tsx`, `kpi-card.test.tsx` (3), and `profit-percent-chart.test.tsx`. ([frontend test files])

### RULE 17: Every presentational component must at minimum have a render test that validates loading, data, and empty states.

- **Fact 17a:** `kpi-card.tsx` conditionally renders `<Skeleton>` or `<span>` depending on the `loading` prop — `kpi-card.test.tsx` covers all three branches (data render, loading skeleton, variant styling). ([kpi-card.test.tsx])
- **Fact 17b:** Both chart components branch on all-zero data vs. real data — `income-outcome-chart.test.tsx` and `profit-percent-chart.test.tsx` cover these branches. ([chart test files])

---

## Tier 5: Code Quality & Anti-Patterns

These rules exist specifically because violations have been identified in the codebase.

### RULE 18: All user-facing strings in the codebase must use the same natural language.

- **Fact 18a:** `use-financial-data.ts` previously threw an error in Spanish; it now uses English: `"Could not load financial data. Check the backend API."` — consistent with the rest of the codebase. ([use-financial-data.ts])

### RULE 19: Dead code (files that are never imported) must be removed.

- **Fact 19a:** `mock-data.ts` has been removed from the repository — no dead component files remain. The `utils.ts` helper (`cn()`) is actively imported by all shadcn/ui primitives. ([frontend/src/lib/utils.ts])

### RULE 20: Values that are derivable from data must not be hardcoded.

- **Fact 20a:** `App.tsx` passes `periodLabel ?? undefined` (derived via `computePeriodLabel(movements)`) to `DashboardHeader` — no longer hardcoded. The component's default parameter `'Full Year'` serves as a fallback. ([App.tsx] [dashboard-header.tsx] [financial-utils.ts])
- **Fact 20b:** `index.html` has `<title>Financial Dashboard</title>` — correctly set to the application name. ([index.html])

### RULE 21: API parameter names in route decorators must match function parameter names exactly.

- **Fact 21a:** All 9 route handlers use `start_date` consistently in both decorator queries and function parameter names — no typo mismatch exists. ([routes.py] — search `start_date` vs `strat_date`)

### RULE 22: Build contexts must be minimized to exclude unnecessary files.

- **Fact 22a:** Both `backend/.dockerignore` and `frontend/.dockerignore` exist and exclude `node_modules/`, `__pycache__/`, `*.pyc`, `.git/`, `.env`, `dist/`, `.venv/`, and other build artifacts from the Docker context. ([backend/.dockerignore] [frontend/.dockerignore])

---

## Appendix: Rule Origin Cross-Reference

| Rule | Source Documents | Supporting Facts | Tier |
|------|-----------------|------------------|------|
| R1: Exhaustive dependencies | health-assessment, project-map | 3 facts (1a–1c) | 1 — Universal |
| R2: Parameterized config | operational-blockers, project-map, health-assessment | 3 facts (2a–2c) | 1 — Universal |
| R3: State path handling | conventions, health-assessment | 3 facts (3a–3c) | 1 — Universal |
| R4: Container/presentational | conventions, project-map | 2 facts (4a–4b) | 1 — Universal |
| R5: Naming conventions | conventions | 3 facts (5a–5c) | 2 — Language |
| R6: Import path conventions | health-assessment | 2 facts (6a–6b) | 2 — Language |
| R7: Pure transformation fns | project-map, conventions | 2 facts (7a–7b) | 2 — Language |
| R8: Chart color semantics | conventions | 2 facts (8a–8b) | 2 — Language |
| R9: snake_case in Python | project-map, conventions | 2 facts (9a–9b) | 2 — Language |
| R10: APIRouter pattern | conventions | 2 facts (10a–10b) | 2 — Language |
| R11: Seeded cached mock data | project-map, conventions, operational-blockers | 3 facts (11a–11c) | 2 — Language |
| R12: Healthchecks in Compose | operational-blockers, health-assessment | 2 facts (12a–12b) | 3 — Infrastructure |
| R13: Dev/prod image separation | operational-blockers, health-assessment | 2 facts (13a–13b) | 3 — Infrastructure |
| R14: Pinned Python deps | health-assessment | 2 facts (14a–14b) | 3 — Infrastructure |
| R15: TestClient for routes | health-assessment, project-map | 2 facts (15a–15b) | 4 — Testing |
| R16: Vitest for frontend utils | health-assessment | 2 facts (16a–16b) | 4 — Testing |
| R17: Component render tests | conventions, health-assessment | 2 facts (17a–17b) | 4 — Testing |
| R18: Single language | operational-blockers | 1 fact (18a) | 5 — Quality |
| R19: No dead code | operational-blockers | 1 fact (19a) | 5 — Quality |
| R20: No hardcoded derivatives | operational-blockers | 2 facts (20a–20b) | 5 — Quality |
| R21: Consistent param names | conventions | 1 fact (21a) | 5 — Quality |
| R22: Minimal build contexts | health-assessment | 1 fact (22a) | 5 — Quality |

---

*Add new rules at the bottom of the appropriate tier as new insights emerge. Each new rule must cite at least one concrete repo fact.*