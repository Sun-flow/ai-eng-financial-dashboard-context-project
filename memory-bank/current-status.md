# Current Status and Known Gaps

> **Updated**: October 1, 2026

## What Works

- 9 FastAPI routes; seeded/cached mock generation with 360 movements (`@lru_cache`).
- KPI cards and two charts with loading, error, empty, and render-error states.
- `useFinancialData` hook, `computePeriodLabel`, pinned Python dependencies, multi-stage Docker targets, Compose health dependency, `.dockerignore` files, env-driven CORS, parameterized Vite proxy.
- Backend: **15 tests passed**. Frontend: **24+ tests** (9 utils + component render tests). ESLint, TypeScript build, and Vite production build pass.
- Rule detail: `memory-bank/agent-rule-compliance-assessment.md`.

## Known Gaps and Blockers

### Critical: Docker Bridge Networking (paused)

- Both directions time out; each container reaches its own loopback/IP.
- Observed `ip_forward=1`, `internal=false`, no explicit ICC disable.
- Network prune/recreation did not help; suspected host/DinD firewall or nested bridge.
- Details: `docs/operational-blockers.md` #10. Do not pursue without direction.

**Workaround**: run the backend locally on port 8000 and the frontend locally with the default Vite proxy target `http://localhost:8000`.

### Non-blocking Warnings

- Starlette/httpx TestClient deprecation.
- npm audit vulnerabilities; no remediation selected.
- Vite bundle exceeds 500 kB.

### Product Scope Gaps

- No database, persistence, auth, authorization, writes, or real-data integration.
- Debugpy is not separately integration-tested.

## Rule Coverage Gaps

The rule implementation pass is not fully closed. The current assessment identifies six remaining gaps:

- R1: 3 packages (`class-variance-authority`, `autoprefixer`, `postcss`) are declared but never imported — leftover from shadcn/ui CLI init.
- R8: chart variables use blue/orange oklch hues instead of green/red semantic.
- R13: development reload is intentionally disabled because it caused the Docker bind-mount restart loop.
- R16: `frontend/src/lib/utils.ts` has no utility test.
- R17: `KPIRow`, `Card`, and `Skeleton` have no render tests.
- R19: `frontend/src/assets/hero.png` appears unreferenced and needs an intentional-use decision.

## Next Priorities

1. Close the six rule coverage gaps above, beginning with removing stale packages (R1), chart semantics (R8), and missing tests (R16/R17).
2. (Completed) `.github/workflows/ci.yml` and `docs/planning.md` are tracked and pushed.
3. Decide whether to investigate the paused Docker bridge issue in a host environment with network and iptables access.
4. Plan production configuration, restricted CORS, and database integration only when those features are in scope.

## Repository State

`main` is pushed and up to date; all documentation, CI workflows, and memory-bank summaries are tracked and aligned with the current codebase state (see `git log` for the latest commit).

## Useful Checks

```text
cd backend && python -m pytest -q
cd frontend && npm test
cd frontend && npm run lint && npm run build
```
