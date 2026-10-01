# Execution Plan — Financial Dashboard Improvements

> **Last updated**: 2026-10-01
> **Status**: This is the **historical roadmap** that guided the implementation work. All 4 rounds have been substantially completed — see the ✅/⚠️/❌ status markers added to each task below, and `docs/CHANGELOG.md` for the authoritative record of what shipped. Only Round 4 items 4.3–4.5 (backend `.env.example`, `pydantic-settings` config module, and SQLite database integration) remain undone; everything else is implemented.
> **Source documents**: `project-map.md`, `health-assessment.md`, `conventions.md`, `operational-blockers.md`

---

## Round 1: 🔴 Critical — Fix Operational Blockers ✅ Done

**Goal**: Make the application runnable. These issues prevent the app from working at all (either in Docker or locally).

| # | Task | Files | Effort | Dependencies | Status |
|---|------|-------|--------|-------------|--------|
| 1.1 | Remove `--reload` flag from backend Docker CMD | `backend/Dockerfile` | 5 min | None | ✅ Done |
| 1.2 | Make Vite proxy target configurable (env var with localhost fallback) | `frontend/vite.config.ts` | 15 min | None | ✅ Done |
| 1.3 | Fix mock data year to match UI header ("2024 - Full Year") | `backend/app/routes.py` | 10 min | None | ✅ Done — period label is now computed dynamically from data via `computePeriodLabel()` |
| 1.4 | Add Docker healthcheck for backend | `docker-compose.yml` | 15 min | None | ✅ Done |
| 1.5 | Pin Python dependencies to specific versions | `backend/requirements.txt` | 10 min | None | ✅ Done |

**Acceptance Criteria:**
- `docker compose up --build` starts without restart loops
- Frontend loads and displays data (API calls succeed) — ⚠️ still blocked by the separate Docker bridge networking issue; see `docs/operational-blockers.md`
- Metadata year labels match displayed data
- Backend healthcheck stabilizes startup order
- Builds are reproducible

**Estimated time**: ~55 minutes

---

## Round 2: 🟠 High — Fix Code Quality & UX Issues ✅ Done

**Goal**: Address the most impactful code quality and user experience problems.

| # | Task | Files | Effort | Dependencies | Status |
|---|------|-------|--------|-------------|--------|
| 2.1 | Add `.dockerignore` for both services | `backend/.dockerignore`, `frontend/.dockerignore` | 10 min | None | ✅ Done |
| 2.2 | Fix HTML title ("frontend" → "Financial Dashboard") | `frontend/index.html` | 2 min | None | ✅ Done |
| 2.3 | Extract `fetchFinancialData` into custom hook `useFinancialData` | `frontend/src/hooks/use-financial-data.ts` (new), `App.tsx` | 30 min | None | ✅ Done |
| 2.4 | Make dashboard period label dynamic from data | `dashboard-header.tsx`, `App.tsx` | 20 min | 2.3 | ✅ Done |
| 2.5 | Translate Spanish error message to English | `frontend/src/App.tsx` | 2 min | None | ✅ Done |
| 2.6 | Remove dead code (`mock-data.ts`) | Delete `mock-data.ts` | 2 min | Verify unused first | ✅ Done |
| 2.7 | Add loading states to chart components | `income-outcome-chart.tsx`, `profit-percent-chart.tsx` | 15 min | None | ✅ Done |
| 2.8 | Fix `strat_date` typo → `start_date` | `backend/app/routes.py` | 5 min | Update tests | ✅ Done |
| 2.9 | Cache mock data at startup (not per-request) | `backend/app/routes.py` | 20 min | None | ✅ Done — `@lru_cache(maxsize=1)` |

**Acceptance Criteria:**
- Browser tab shows "Financial Dashboard"
- Period label reflects actual data range
- Error messages are in English
- No dead code in the codebase
- Charts show skeleton while loading
- Mock data is generated once, not per request
- `strat_date` → `start_date` consistent everywhere

**Estimated time**: ~106 minutes

---

## Round 3: 🟡 Medium — Expand Testing & Error Handling ✅ Done

**Goal**: Improve reliability through better testing and error handling.

| # | Task | Files | Effort | Dependencies | Status |
|---|------|-------|--------|-------------|--------|
| 3.1 | Add Vitest config to `vite.config.ts` (if not present) | `frontend/vite.config.ts` | 10 min | None | ✅ Done |
| 3.2 | Add component tests for KPI card rendering | `frontend/src/components/dashboard/kpi-card.test.tsx` (new) | 30 min | None | ✅ Done |
| 3.3 | Add component tests for chart rendering | `frontend/src/components/dashboard/income-outcome-chart.test.tsx` (new) | 30 min | None | ✅ Done |
| 3.4 | Add error boundary component | `frontend/src/components/error-boundary.tsx` (new) | 20 min | None | ✅ Done |
| 3.5 | Add null/empty data handling tests for backend | `backend/tests/test_routes.py` | 20 min | 1.5 | ⚠️ Partial — existing 15 tests cover filters and endpoints, but no test explicitly asserts an empty-result response |
| 3.6 | Verify all backend tests pass | `backend/tests/` | 10 min | 1.1, 1.3 | ✅ Done — verified directly: `pytest tests/ -q` → `15 passed` |

**Acceptance Criteria:**
- Frontend component tests exist and pass
- Error boundary catches render errors gracefully
- Backend tests cover edge cases (empty data, missing params)
- CI could be configured to run these tests

**Estimated time**: ~120 minutes

---

## Round 4: 🟢 Low — Polish & Production Readiness ⚠️ Mostly Done

**Goal**: Production-ready configuration and developer experience improvements.

| # | Task | Files | Effort | Dependencies | Status |
|---|------|-------|--------|-------------|--------|
| 4.1 | Add production Dockerfiles (multi-stage, no debugpy) | `backend/Dockerfile.prod`, `frontend/Dockerfile.prod` (new) | 30 min | 1.1 | ✅ Done — implemented as a `production` target inside the existing multi-stage `Dockerfile` for each service rather than separate `.prod` files |
| 4.2 | Add GitHub Actions CI workflow | `.github/workflows/ci.yml` (new) | 30 min | 3.x | ✅ Done — tracked in git and pushed |
| 4.3 | Add `.env` example for backend | `backend/.env.example` (new) | 10 min | None | ❌ Not done |
| 4.4 | Set up environment variable management (pydantic-settings) | `backend/app/config.py` (new), `main.py` | 20 min | None | ❌ Not done — `CORS_ORIGINS` is read directly via `os.getenv()` in `main.py`, no dedicated settings module |
| 4.5 | Add database integration (SQLite for dev) | `backend/app/database.py` (new) | 60 min | Major feature | ❌ Not done — all data remains in-memory mock |
| 4.6 | Audit CORS settings for production | `backend/app/main.py` | 10 min | 4.4 | ✅ Done — `CORS_ORIGINS` env var, comma-separated, default `"*"` |
| 4.7 | Remove debugpy from production requirements | `backend/requirements.txt` | 5 min | 4.1 | ✅ Done — `debugpy` lives only in `requirements-dev.txt` and only the `development` Docker stage installs it |

**Acceptance Criteria:**
- Production Docker image doesn't include debugger
- CI runs tests on every PR
- Configuration is environment-driven
- CORS is restricted in production
- Path to database integration is scoped

**Estimated time**: ~165 minutes

---

## Dependency Graph

```
Round 1 (Critical)
  │
  ▼
Round 2 (Code Quality) ──── depends on 1.1, 1.3, 1.5
  │
  ▼
Round 3 (Testing) ────────── depends on 1.1, 1.3, 1.5
  │
  ▼
Round 4 (Production) ────── depends on 1.x, 3.x
```

Each round builds on the previous. Round 1 is the prerequisite for everything else — without a working app, other improvements cannot be validated.

---

## Quick Wins (Can Be Done Anytime)

These tasks have no dependencies and take < 10 minutes — **all completed**:
- ✅ Fix HTML title (`index.html`)
- ✅ Fix Spanish error message (`App.tsx`)
- ✅ Remove dead code (`mock-data.ts`)
- ✅ Pin Python dependencies (`requirements.txt`)
- ✅ Add `.dockerignore` files

---

## Effort Summary

| Round | Tasks | Est. Time | Impact | Status |
|-------|-------|-----------|--------|--------|
| 🔴 Round 1 | 5 | 55 min | App becomes runnable | ✅ Done |
| 🟠 Round 2 | 9 | 106 min | Code quality + UX | ✅ Done |
| 🟡 Round 3 | 6 | 120 min | Reliability + testing | ✅ Done (3.5 partial) |
| 🟢 Round 4 | 7 | 165 min | Production readiness | ⚠️ 4/7 done (4.3–4.5 not started) |
| **Total** | **27** | **~7.5 hours** | | **23/27 complete** |

---

## Appendix: Files to Create

Status key: ✅ created as planned, 🔁 implemented differently than planned, ❌ not created.

```
new files:
├── frontend/src/hooks/use-financial-data.ts     (Round 2.3) ✅
├── frontend/src/components/error-boundary.tsx    (Round 3.4) ✅
├── backend/app/config.py                          (Round 4.4) ❌
├── backend/app/database.py                        (Round 4.5) ❌
├── backend/.env.example                           (Round 4.3) ❌
├── backend/.dockerignore                          (Round 2.1) ✅
├── frontend/.dockerignore                         (Round 2.1) ✅
├── backend/Dockerfile.prod                        (Round 4.1) 🔁 implemented as a `production` target in `backend/Dockerfile` instead
├── frontend/Dockerfile.prod                       (Round 4.1) 🔁 implemented as a `production` target in `frontend/Dockerfile` instead
├── .github/workflows/ci.yml                       (Round 4.2) ✅
└── frontend/src/components/dashboard/
    ├── kpi-card.test.tsx                           (Round 3.2) ✅
    └── income-outcome-chart.test.tsx               (Round 3.3) ✅
```

## Appendix: Files to Modify

All listed modifications were completed:

```
backend/Dockerfile               (Rounds 1.1, 4.1)
backend/requirements.txt         (Rounds 1.5, 4.7)
backend/app/routes.py            (Rounds 1.3, 2.8, 2.9)
backend/app/main.py              (Round 4.6)
backend/tests/test_routes.py     (Rounds 2.8, 3.5)
frontend/vite.config.ts          (Round 1.2)
frontend/index.html              (Round 2.2)
frontend/src/App.tsx             (Rounds 2.3, 2.4, 2.5)
frontend/src/components/dashboard/
    ├── dashboard-header.tsx     (Round 2.4)
    ├── income-outcome-chart.tsx (Round 2.7)
    ├── profit-percent-chart.tsx (Round 2.7)
    └── kpi-card.tsx             (in scope for reusability)
docker-compose.yml               (Round 1.4)
```

## Appendix: Files to Delete

```
frontend/src/lib/mock-data.ts    (Round 2.6 — dead code) ✅ Deleted
```