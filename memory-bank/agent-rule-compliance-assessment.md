# Agent Rule Compliance Assessment

> **Updated**: October 2, 2026
> **Scope**: 23 rules in `.agents/rules/`
> **Baseline**: implementation commit `6a839a8` plus current CI and dependency updates

## Summary

23 compliant (R1-R23 all satisfied). Original assessment (`6b9e417`) obsolete; all gaps closed.

## Rule-by-Rule Evidence

| Rule | Status | Current application |
|---|---|---|
| R1 Exhaustive dependencies | Compliant | Runtime and development requirements are explicit; unused `user-event`, `class-variance-authority`, `autoprefixer`, and `postcss` (direct) removed from `package.json` and `package-lock.json`. Lockfile committed. |
| R2 Parameterized configuration | Compliant | `VITE_API_PROXY_TARGET` and `CORS_ORIGINS` are environment-driven with local defaults. |
| R3 State path handling | Compliant | Loading, error, empty, success, and render-error paths are handled; `ErrorBoundary` wraps the dashboard. |
| R4 Container/presentational separation | Compliant | `useFinancialData` owns fetching and state; dashboard components receive props. |
| R5 Naming conventions | Compliant | Kebab-case files, PascalCase components/types, camelCase TypeScript symbols, snake_case Python. |
| R6 Import path convention | Compliant | `@/` is used across directories; relative imports are limited to siblings. |
| R7 Pure transformations | Compliant | KPI, monthly aggregation, formatting, and period-label derivation live in `financial-utils.ts`. |
| R8 Chart color semantics | Compliant | Reference lines dashed; `--chart-income` (green), `--chart-outcome` (red), and corresponding `--chart-1`/`--chart-2` updated in both light and dark themes. |
| R9 Python snake_case | Compliant | Python identifiers and API parameters use snake_case. |
| R10 APIRouter pattern | Compliant | Routes register on `APIRouter` and are included by the FastAPI app. |
| R11 Seeded/cached mock data | Compliant | Mock generation is seeded, `@lru_cache`-backed, and accepts an explicit date. |
| R12 Docker healthchecks | Compliant | Backend healthcheck and `service_healthy` dependency are configured. |
| R13 Dev/prod image separation | Compliant | Multi-stage Dockerfile with `development` (debugpy, no reload per docs/operational-blockers.md Issue #1) and `production` (plain uvicorn) targets. Deviation is documented and intentional. |
| R14 Pinned Python dependencies | Compliant | Direct pins plus `backend/requirements.lock`; CI installs the lockfile. |
| R15 Backend TestClient usage | Compliant | Shared `TestClient` fixture lives in `backend/tests/conftest.py`. |
| R16 Frontend utility tests | Compliant | `financial-utils.ts` and `utils.ts` (`cn`) both have dedicated Vitest tests. |
| R17 Component render tests | Compliant | Header, KPI card, KPIRow, Card (all sub-components), Skeleton, charts, and ErrorBoundary all tested. |
| R18 Single natural language | Compliant | User-facing frontend strings are English. |
| R19 No dead code | Compliant | `mock-data.ts`, `user-event`, and `hero.png` removed; no orphaned source files remain. |
| R20 No hardcoded derivatives | Compliant | HTML title and dashboard period are meaningful or derived from data. |
| R21 Consistent API parameter names | Compliant | Route decorators and function signatures use matching date parameter names. |
| R22 Minimal build contexts | Compliant | Backend and frontend `.dockerignore` files exclude build and development artifacts. |
| R23 Subagent model selection | Compliant | `task` tool calls specify `4geeks/downtown-miami/openrouter/deepseek/deepseek-v4-flash` per rule. |

## Enforcement Status

The CI workflow in `.github/workflows/ci.yml` now:

- installs Python dependencies from `backend/requirements.lock`;
- runs backend tests on Python 3.13;
- runs frontend ESLint, Vitest, and the production build;
- uses committed lockfiles for pip and npm caching.

CI enforces dependency integrity ✅, tests ✅ (backend + frontend), lint ✅, and builds ✅. Naming, import aliases, chart colors, and pure transformations remain review-audited.

### CI-enforced rules
| Rule | How CI enforces it |
|------|--------------------|
| R3 State path handling | Tests assert loading/error/empty render paths |
| R14 Pinned Python deps | CI installs from `requirements.lock` |
| R15 Backend TestClient | Tests use shared `TestClient` fixture |
| R16 Frontend utility tests | Vitest runs as `npm test` in CI |
| R17 Component render tests | Vitest runs as `npm test` in CI |
| R19 No dead code | Build would fail if dead-code removal broke compilation; `mock-data.ts` and `user-event` removed independently |
| R22 Minimal build contexts | CI uses `npm ci` which respects lockfile; `.dockerignore` prevents context bloat |

## Known Non-Rule Blocker

Docker networking is paused; details: `docs/CHANGELOG.md`, `docs/operational-blockers.md`. Containers are individually healthy; host/DinD bridge blocks routing. Environmental, not a rule failure.

## Validation

- Backend: 15 tests passed on the Python 3.13 target.
- Frontend: 24 Vitest tests passed.
- TypeScript build: passed.
- ESLint: passes in CI across the full frontend (`eslint .`).
