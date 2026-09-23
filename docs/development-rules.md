# Development Rules — Financial Dashboard

> **Last updated**: 2026-09-23  
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

- **Fact 1a:** `pydantic` is imported in `routes.py` but not listed in `requirements.txt` — it resolves only transitively via `fastapi`, creating a fragile dependency. ([health-assessment.md] Backend Dependencies table)
- **Fact 1b:** All 20 frontend packages in `package.json` are confirmed used in code, and no used import lacks a matching package entry. ([health-assessment.md] Dependency Status table)
- **Fact 1c:** `pytest-cov` is listed in `requirements.txt` but unused in any config — it is a declared dependency with zero consumption. ([health-assessment.md] Backend Dependencies table)

**Corollary 1.1:** Unused dependencies must be removed.

### RULE 2: Configuration that differs between environments must be parameterized, not hardcoded.

- **Fact 2a:** The Vite proxy target `http://backend:8000` only resolves inside Docker Compose — running locally produces 502 errors. ([operational-blockers.md] Issue #2)
- **Fact 2b:** `.env.example` exists for `VITE_API_BASE_URL` but the proxy target is not wired to it. ([project-map.md] Configuration Files section)
- **Fact 2c:** CORS is hardcoded to `["*"]` in `main.py` with no environment awareness. ([health-assessment.md] Code Quality Observations — Backend)

**Corollary 2.1:** Hardcoded values that depend on environmental context (Docker vs. local, dev vs. prod) are bugs waiting to surface.

### RULE 3: Every non-trivial state path (loading, error, empty, success) must be explicitly handled in the UI.

- **Fact 3a:** `App.tsx` shows a skeleton via `<Skeleton>` when `loading` is true, a red error banner when `error` is non-null, and renders data otherwise — all three branches covered. ([conventions.md] §4.1 & §4.2)
- **Fact 3b:** Both `income-outcome-chart.tsx` and `profit-percent-chart.tsx` check for all-zero data and render `"No data available"` as an empty-state fallback. ([conventions.md] §4.3)
- **Fact 3c:** No error boundary exists — any unhandled render error crashes the entire app with no recovery. ([health-assessment.md] Code Quality Observations — Frontend)

**Corollary 3.1:** An error boundary wrapping the dashboard is required to satisfy this rule universally.

### RULE 4: Side effects belong at the container level; presentational components must be pure.

- **Fact 4a:** `App.tsx` is the sole owner of `useState` and `useCallback` for `fetchFinancialData` — no child component manages its own fetch or global state. ([conventions.md] §1.1)
- **Fact 4b:** `kpi-card.tsx`, `kpi-row.tsx`, `dashboard-header.tsx`, `income-outcome-chart.tsx`, and `profit-percent-chart.tsx` receive all data via props and contain no data-fetching logic. ([project-map.md] Component Tree)

**Corollary 4.1:** Child components must not import `fetch`, `axios`, or any HTTP client.

---

## Tier 2: Language & Framework Rules

These rules are language-specific (TypeScript/React or Python/FastAPI) but cross multiple files.

### TypeScript / React

### RULE 5: File names use kebab-case; exported symbols use PascalCase (components/types) or camelCase (functions/variables).

- **Fact 5a:** Components: `kpi-card.tsx` → `KPICard`, `kpi-row.tsx` → `KPIRow`, `dashboard-header.tsx` → `DashboardHeader`. ([conventions.md] §2.1)
- **Fact 5b:** Utilities: `financial-utils.ts` → `computeKPIs`, `formatCurrency`, `formatPercent`. ([conventions.md] §2.1)
- **Fact 5c:** Types: `financial-types.ts` → `FinancialMovement`, `KPIMetrics`, `MonthlyData`. ([conventions.md] §2.1)

**Corollary 5.1:** New component files must follow this naming pattern without exception.

### RULE 6: The `@/` path alias must be used for cross-directory imports; relative imports are for siblings only.

- **Fact 6a:** `kpi-row.tsx` imports `./kpi-card` (relative) — same-directory sibling. ([health-assessment.md] Component Imports table)
- **Fact 6b:** `kpi-card.tsx` imports `@/lib/financial-utils` and `@/components/ui/skeleton` (alias) — cross-directory. ([health-assessment.md] Component Imports table)

### RULE 7: Data transformation must live in pure utility functions, not inside components or hooks.

- **Fact 7a:** `computeKPIs` and `computeMonthlyData` are standalone exported functions in `financial-utils.ts`, imported and called in `App.tsx` between fetch and render. ([project-map.md] Data Flow section)
- **Fact 7b:** Both functions accept `FinancialMovement[]` and return derived types — no side effects, no state access. ([conventions.md] §1.3)

### RULE 8: Recharts components must use consistent color semantics: green (`#10b981`) for income, red (`#ef4444`) for outcome.

- **Fact 8a:** `income-outcome-chart.tsx` applies green to the income line and red to the outcome line. ([conventions.md] §5.2)
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
- **Fact 11b:** Every route handler calls `generate_mock_movements(seed=42)` fresh, rebuilding all 360 movements on every request. ([conventions.md] §6 — Anti-patterns)
- **Fact 11c:** `_year_for_month` uses `date.today()` for year assignment, making output date-dependent despite the fixed seed. ([operational-blockers.md] Issue #3)

---

## Tier 3: Infrastructure & Configuration Rules

### RULE 12: Docker Compose services that depend on other services must use healthchecks, not just `depends_on`.

- **Fact 12a:** `docker-compose.yml` specifies `depends_on: [backend]` with no healthcheck — frontend may start before the backend is ready to accept connections. ([operational-blockers.md] Issue #4)
- **Fact 12b:** The backend has a `/health` endpoint (`{"status": "ok"}`) but it is not referenced by any Docker healthcheck configuration. ([health-assessment.md] Docker Compose References)

### RULE 13: Production Docker images must be distinct from development images (multi-stage, no debugger, no reload).

- **Fact 13a:** `backend/Dockerfile` includes `debugpy` in production and uses `--reload`, which causes an infinite restart loop when combined with bind mounts. ([operational-blockers.md] Issue #1)
- **Fact 13b:** No production-optimized Dockerfile exists — the current configuration is entirely dev-oriented. ([health-assessment.md] Code Quality Observations — Infrastructure)

### RULE 14: Python dependencies must be pinned to specific versions for reproducible builds.

- **Fact 14a:** `requirements.txt` lists `fastapi`, `uvicorn[standard]`, `debugpy`, `pytest`, `pytest-cov`, and `httpx` with no version constraints. ([health-assessment.md] Backend Dependencies)
- **Fact 14b:** No lockfile (`requirements.lock`, `Pipfile.lock`, or `poetry.lock`) exists. ([health-assessment.md] Code Quality Observations — Infrastructure)

---

## Tier 4: Testing Rules

### RULE 15: Backend routes must be tested via `TestClient` with isolated app instances.

- **Fact 15a:** `test_routes.py` imports `from fastapi.testclient import TestClient` and creates the client at module level. ([health-assessment.md] Python Imports — tests)
- **Fact 15b:** 15 test functions cover mock generation, health endpoint, filter combinations, date ranges, and B2B/B2C filtering. ([project-map.md] Backend Tests)

### RULE 16: Frontend utility functions must have Vitest unit tests with `describe`/`it` blocks.

- **Fact 16a:** `financial-utils.test.ts` contains 3 test cases across 2 describe blocks (`computeKPIs`, `computeMonthlyData`). ([health-assessment.md] Frontend Tests)
- **Fact 16b:** Frontend components have zero tests — KPI cards and charts are entirely untested. ([health-assessment.md] Test Coverage Gaps)

### RULE 17: Every presentational component must at minimum have a render test that validates loading, data, and empty states.

- **Fact 17a:** `kpi-card.tsx` conditionally renders `<Skeleton>` or `<span>` depending on the `loading` prop — this branching needs test coverage. ([conventions.md] §4.1)
- **Fact 17b:** Both chart components branch on all-zero data vs. real data — these branches are untested. ([health-assessment.md] Test Coverage Gaps)

---

## Tier 5: Code Quality & Anti-Patterns

These rules exist specifically because violations have been identified in the codebase.

### RULE 18: All user-facing strings in the codebase must use the same natural language.

- **Fact 18a:** `App.tsx` sets an error message in Spanish: `"No se pudo cargar la información financiera. Revisa la API de backend."` while every other string in the codebase is English. ([operational-blockers.md] Issue #9)

### RULE 19: Dead code (files that are never imported) must be removed.

- **Fact 19a:** `mock-data.ts` is present in the repository with 52 hardcoded movements but is never imported by any file. ([operational-blockers.md] Issue #8)

### RULE 20: Values that are derivable from data must not be hardcoded.

- **Fact 20a:** `<DashboardHeader period="2024 - Full Year" />` hardcodes the year label, which does not match the actual data range (Sep 2025 – Aug 2026). ([operational-blockers.md] Issue #3)
- **Fact 20b:** `index.html` has `<title>frontend</title>` — a Vite default that was never changed to match the application name. ([operational-blockers.md] Issue #7)

### RULE 21: API parameter names in route decorators must match function parameter names exactly.

- **Fact 21a:** The `/api/metrics/comparison` route uses `strat_date` in the decorator but `start_date` as the function parameter name — a typo that creates an inconsistency. ([conventions.md] §6 — Anti-patterns)

### RULE 22: Build contexts must be minimized to exclude unnecessary files.

- **Fact 22a:** Neither `backend/` nor `frontend/` has a `.dockerignore` file — `node_modules`, `__pycache__`, and other artifacts are sent to the Docker daemon on every build. ([health-assessment.md] Code Quality Observations — Infrastructure)

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