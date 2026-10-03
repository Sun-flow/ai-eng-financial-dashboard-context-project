# Handoff — Financial Dashboard Improvements

> **Handoff date**: 2026-09-29
> **To**: Next agent/engineer resuming this repo
> **From**: Previous session (full-stack improvement pass)
> **Status**: Most planned work DONE. **One 🔴 critical, environment-level issue PAUSED (inter-container networking).**

---

## TL;DR — Resume Here

1. **Everything in the 4-round plan is implemented and committed** except items explicitly listed as open/deferred below.
2. **The app does NOT currently work end-to-end via `docker compose up`** because frontend ↔ backend containers cannot route to each other over the Docker bridge network (blocker #10). This is **paused by direction — do not chase it without explicit instruction**. Both containers are individually healthy.
3. **Highest-value next task**: keep the memory bank and `.agents/rules/` synchronized with future changes; the GitHub Actions CI workflow (`.github/workflows/ci.yml`) is already reviewed, tracked in git, and pushed.
4. **Run and test locally (outside Docker)** for a working experience — see [Quick Start](#quick-start).

---

## ✅ What Is DONE (this session)

### Backend
- **Multi-stage Dockerfile** (`base` / `development` / `production`); production runs plain uvicorn, **no `--reload`** (fixes infinite restart loop).
- **`curl` installed in `base` stage** — `python:3.13-slim` does not ship curl, so the healthcheck previously always failed.
- **`/health`** endpoint → `{"status": "ok"}`.
- **CORS** now driven by `CORS_ORIGINS` env var (comma-separated, default `"*"`; Docker sets `http://localhost:5173`).
- **Pinned deps** in `backend/requirements.txt` (`fastapi==0.141.1`, `uvicorn[standard]==0.53.0`, `pydantic==2.13.5`); debugpy/pytest/httpx moved to `backend/requirements-dev.txt`.
- Mock generator `generate_mock_movements(seed, today)` accepts optional `today` for deterministic, testable year logic.
- Backend tests expanded (15 passing via pytest + TestClient).

### Frontend
- **Multi-stage Dockerfile** (`base` / `development` / `build` / `production` → nginx).
- **Vite proxy target configurable**: `VITE_API_PROXY_TARGET` env var, defaults to `http://localhost:8000` (fixes "backend" hostname unresolvable locally).
- **Vitest configured** in `vite.config.ts` (jsdom, globals, `setupFiles: ./src/test-setup.ts`); `@testing-library/jest-dom` matchers.
- **`ErrorBoundary`** component added and wraps `App`.
- **Loading skeletons** on KPI cards + both charts.
- Title `frontend` → `Financial Dashboard`; Spanish error → English.
- **`mock-data.ts` deleted** (dead code).
- Frontend component tests added for: `dashboard-header`, `kpi-card`, `income-outcome-chart`, `profit-percent-chart`, and `error-boundary` (24 tests total including utility tests).
- `tsc -b` passes (exit 0).

### Infra / Docs
- Healthcheck + `depends_on: condition: service_healthy` in `docker-compose.yml`.
- `.dockerignore` for both services.
- `docs/operational-blockers.md`, `docs/planning.md`, `docs/CHANGELOG.md`, `docs/conventions.md`, `docs/development-rules.md`, `docs/health-assessment.md`, `docs/project-map.md`.
- `.agents/rules/` (23 rules) + `memory-bank/` (6 files).

---

## 🔴 BLOCKER #10 — INTER-CONTAINER NETWORKING (PAUSED)

> **Do NOT pursue further without explicit direction.**

**Symptom**: `docker compose up` starts both containers; backend reports `Healthy`; **frontend UI loads forever** (never receives `/api/metrics`).

**Diagnosis (verified both directions)**:
- frontend → `backend:8000` (and `172.18.0.2:8000`): **timeout**
- backend → frontend `172.18.0.3:5173`: **timeout**
- Each container reaches its own loopback/IP fine → break is purely **inter-container routing**.
- `ip_forward=1`, `internal=false`, ICC not disabled; yet traffic blocked.
- Suspected: **host/DinD-level firewall** (`iptables` not inspectable without root) or **nested-Docker bridge breakage**.

**Tried**: `docker compose down` + `docker network prune -f` + `up -d` — did not fix.

**Workaround if needed**: run frontend outside Docker pointed at `http://localhost:8000` via `VITE_API_PROXY_TARGET`, or fix host bridge/iptables state.

---

## 🎯 Next Priorities (in order)

### 1. Keep context synchronized
- Update the memory bank whenever implementation, test, or blocker state changes.
- Keep the rule assessment aligned with `.agents/rules/` and executable validation.

### 2. Deferred product and infrastructure work
- Investigate Docker bridge routing only in an environment with host network and iptables access.
- Scope production configuration, restricted CORS, and database integration separately before implementation.

---

## 🚀 Quick Start

### Local (recommended while #10 is open)
```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000   # http://localhost:8000/health

# Frontend (separate terminal)
cd frontend
npm install
npm run dev                                   # http://localhost:5173
```
_(Proxy defaults to `http://localhost:8000`, so no env vars needed locally.)_

### Backend tests
```bash
cd backend && pytest -v
```

### Frontend tests
```bash
cd frontend && npx vitest run
```

### Typecheck
```bash
cd frontend && npx tsc -b
```

### Docker (blocked end-to-end by #10)
```bash
docker compose up --build
```
- Backend container will be `Healthy`; frontend will hang on data fetch due to #10.

---

## ⚙️ Environment Variables

| Var | Where | Default | Purpose |
|-----|-------|---------|---------|
| `VITE_API_PROXY_TARGET` | frontend | `http://localhost:8000` | Vite dev proxy target (`/api` → this). In Docker compose set to `http://backend:8000`. |
| `VITE_API_BASE_URL` | frontend | `""` (same origin) | API base URL prefix for fetch. |
| `CORS_ORIGINS` | backend | `"*"` | Comma-separated allowed origins. Docker sets `http://localhost:5173`. |

---

## 🧭 Project Map (where things live)

```
backend/
  Dockerfile                 # multi-stage: base / development / production
  requirements.txt           # pinned runtime deps
  requirements-dev.txt       # debugpy, pytest, httpx
  .dockerignore
  app/
    main.py                  # FastAPI app, CORS, /health
    routes.py                # APIRouter + all 9 endpoints + mock generation
  tests/
    conftest.py
    test_routes.py           # 15 tests
frontend/
  Dockerfile                 # multi-stage: base / dev / build / prod(nginx)
  vite.config.ts             # proxy target envvar + vitest config + @ alias
  src/
    App.tsx                  # dashboard composition and error boundary
    hooks/use-financial-data.ts # fetch, loading/error state, derived data
    test-setup.ts
    components/
      error-boundary.tsx (+ test)
      dashboard/ dashboard-header, kpi-card, kpi-row,
                income-outcome-chart, profit-percent-chart (+ tests)
      ui/ card, skeleton
    lib/ financial-types.ts, financial-utils.ts (+ test), utils.ts
docs/                        # planning, blockers, changelog, conventions, dev-rules...
memory-bank/                 # project-overview, current-status, tech-stack, doc-plan, compact-context, rule-assess
.agents/rules/               # 23 numbered rules (binding)
docker-compose.yml
```

---

## 📐 Must-Follow Conventions (see `.agents/rules/` + `docs/`)

- **Rule 4**: side effects only in container (App/hook); presentational components pure (props only).
- **Rule 7**: transformations are pure functions (`computeKPIs`, `computeMonthlyData`).
- **Rule 8**: charts should use green = income, red = outcome. **✅ Resolved**: `--chart-income`/`--chart-1` (green oklch) and `--chart-outcome`/`--chart-2` (red oklch) updated in both light/dark themes.
- **Rule 9**: snake_case Python, camelCase TS, kebab-case files, PascalCase components.
- **Rule 11**: mock data seeded + cached (`@lru_cache`), never per-request.
- **Rule 12/13**: healthchecks required; dev/prod image separation.
- **Rule 14**: pin Python deps exactly.
- **Rules 15–17**: backend TestClient tests; frontend util + component render tests.
- **Rule 18**: single natural language (English) throughout.
- **Rule 19**: no dead code.
- **Rule 22**: minimal Docker build contexts (`.dockerignore`).
- Always review latest `.agents/rules/`, `.agents/skills/` (if present), and `memory-bank/` before acting.

---

## ⚠️ Recurring Pitfalls / Gotchas

- **`--reload` + bind mount** = restart loop in dev target. Only use `--reload` for truly-local (non-Docker) dev.
- **`python:3.13-slim` has no `curl`** — healthcheck requires installing it (already done in `base`).
- **Don't hardcode `http://backend:8000`** outside docker-compose env — use `VITE_API_PROXY_TARGET` fallback.
- **`_year_for_month` depends on `date.today()`** — header label will drift; fix via dynamic label (2.4).
- **`package-lock.json`** is committed and modified; keep deps in sync via `npm ci` in Docker.