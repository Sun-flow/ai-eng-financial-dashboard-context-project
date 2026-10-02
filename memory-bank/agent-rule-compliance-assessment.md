# Agent Rule Compliance Assessment

> **Updated**: October 1, 2026
> **Scope**: 22 rules in `.agents/rules/`
> **Baseline**: implementation commit `6a839a8` plus current CI and dependency updates

## Summary

16 compliant (R2-R7, R9-R12, R14-R15, R18, R20-R22), 6 partial (R1, R8, R13, R16, R17, R19). 8 CI-enforced. Original assessment (`6b9e417`) obsolete; six gaps remain.

## Rule-by-Rule Evidence

| Rule | Status | Current application |
|---|---|---|
| R1 Exhaustive dependencies | Partial | Runtime and development requirements are explicit; unused `user-event` was removed; frontend lockfile is committed. **3 packages (`class-variance-authority`, `autoprefixer`, `postcss`) are declared but never imported** — leftover from shadcn/ui CLI init, violating the "unused dependencies must be removed" clause. |
| R2 Parameterized configuration | Compliant | `VITE_API_PROXY_TARGET` and `CORS_ORIGINS` are environment-driven with local defaults. |
| R3 State path handling | Compliant | Loading, error, empty, success, and render-error paths are handled; `ErrorBoundary` wraps the dashboard. |
| R4 Container/presentational separation | Compliant | `useFinancialData` owns fetching and state; dashboard components receive props. |
| R5 Naming conventions | Compliant | Kebab-case files, PascalCase components/types, camelCase TypeScript symbols, snake_case Python. |
| R6 Import path convention | Compliant | `@/` is used across directories; relative imports are limited to siblings. |
| R7 Pure transformations | Compliant | KPI, monthly aggregation, formatting, and period-label derivation live in `financial-utils.ts`. |
| R8 Chart color semantics | Partial | Reference lines dashed; `--chart-income` blue and `--chart-outcome` orange, not required green/red. |
| R9 Python snake_case | Compliant | Python identifiers and API parameters use snake_case. |
| R10 APIRouter pattern | Compliant | Routes register on `APIRouter` and are included by the FastAPI app. |
| R11 Seeded/cached mock data | Compliant | Mock generation is seeded, `@lru_cache`-backed, and accepts an explicit date. |
| R12 Docker healthchecks | Compliant | Backend healthcheck and `service_healthy` dependency are configured. |
| R13 Dev/prod image separation | Partial | Production omits debugger/reload; development also omits reload to avoid the bind-mount loop. Intentional deviation. |
| R14 Pinned Python dependencies | Compliant | Direct pins plus `backend/requirements.lock`; CI installs the lockfile. |
| R15 Backend TestClient usage | Compliant | Shared `TestClient` fixture lives in `backend/tests/conftest.py`. |
| R16 Frontend utility tests | Partial | `financial-utils.ts` is tested, but `frontend/src/lib/utils.ts` exports `cn` without a neighboring Vitest test. |
| R17 Component render tests | Partial | Header, KPI card, charts, and boundary tested; `KPIRow`, `Card`, `Skeleton` untested. |
| R18 Single natural language | Compliant | User-facing frontend strings are English. |
| R19 No dead code | Partial | `mock-data.ts` and `user-event` removed; `frontend/src/assets/hero.png` has no source import and needs an intentional-use decision. |
| R20 No hardcoded derivatives | Compliant | HTML title and dashboard period are meaningful or derived from data. |
| R21 Consistent API parameter names | Compliant | Route decorators and function signatures use matching date parameter names. |
| R22 Minimal build contexts | Compliant | Backend and frontend `.dockerignore` files exclude build and development artifacts. |

## Enforcement Status

The CI workflow in `.github/workflows/ci.yml` now:

- installs Python dependencies from `backend/requirements.lock`;
- runs backend tests on Python 3.13;
- runs frontend ESLint, Vitest, and the production build;
- uses committed lockfiles for pip and npm caching.

CI enforces dependency integrity, tests, lint, and builds. Naming, import aliases, chart colors, and pure transformations remain review-audited.

## Known Non-Rule Blocker

Docker networking is paused; details: `docs/CHANGELOG.md`, `docs/operational-blockers.md`. Containers are individually healthy; host/DinD bridge blocks routing. Environmental, not a rule failure.

## Validation

- Backend: 15 tests passed on the Python 3.13 target.
- Frontend: 24 Vitest tests passed.
- TypeScript build: passed.
- ESLint: passed for changed files and is configured in CI for the full frontend.
