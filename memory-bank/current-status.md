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

The rule implementation pass is not fully closed. The current assessment identifies five remaining gaps:

- R8: chart variables use blue/orange oklch hues instead of green/red semantic.
- R13: development reload is intentionally disabled because it caused the Docker bind-mount restart loop.
- R16: `frontend/src/lib/utils.ts` has no utility test.
- R17: `KPIRow`, `Card`, and `Skeleton` have no render tests.
- R19: `frontend/src/assets/hero.png` appears unreferenced and needs an intentional-use decision.

## Next Priorities

1. Close the five rule coverage gaps above, beginning with chart semantics and missing tests.
2. Review, stage, commit, and push the untracked `.github/workflows/ci.yml` and `docs/planning.md`.
3. Decide whether to investigate the paused Docker bridge issue in a host environment with network and iptables access.
4. Plan production configuration, restricted CORS, and database integration only when those features are in scope.

## Repository State

`main` is pushed through `0bb9972`; CI, `docs/planning.md`, and refreshed memory-bank summaries remain untracked and under review.

## Useful Checks

```text
cd backend && python -m pytest -q
cd frontend && npm test
cd frontend && npm run lint && npm run build
```
