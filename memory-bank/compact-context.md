# Compact Context - Financial Dashboard

> **Updated**: September 29, 2026.
> **Details**: `docs/HANDOFF.md`, `docs/CHANGELOG.md`, `docs/operational-blockers.md`, `memory-bank/current-status.md`.

## State

- FastAPI + React/TypeScript dashboard.
- Seeded in-memory data; checks pass.
- Five rule gaps remain; Compose traffic is blocked by a paused host bridge issue.

## Verified

9 routes, 360 movements, 15 backend tests, 24 frontend tests, and passing ESLint, TypeScript build, and Vite production build.

## Key Files

- `backend/app/routes.py`: API routes, models, filters, summaries, mock generation
- `backend/app/main.py`: FastAPI app and CORS configuration
- `frontend/src/App.tsx`: dashboard composition
- `frontend/src/hooks/use-financial-data.ts`: fetch and async state
- `frontend/src/lib/financial-utils.ts`: pure calculations and period labels
- `docker-compose.yml`: service orchestration and health dependency
- `.agents/rules/`: 22 repository rules
- `memory-bank/agent-rule-compliance-assessment.md`: current rule audit

## Rule Conventions

- Side effects: container/hook; dashboard components: presentational.
- Transformations: pure/tested; chart semantics: green income/red outcome.
- Names: Python snake_case; TypeScript camelCase; kebab-case files; PascalCase components/types.
- Keep mocks seeded/cached, dependencies pinned, API parameters consistent, Docker contexts minimal.

## Blocker

Compose containers cannot reach one another over Docker bridge network (#10). Run frontend/backend locally; proxy defaults to `http://localhost:8000`.

## Environment

- `VITE_API_PROXY_TARGET`: local `http://localhost:8000`; Compose `http://backend:8000`.
- `VITE_API_BASE_URL`: optional same-origin prefix.
- `CORS_ORIGINS`: comma-separated; Compose `http://localhost:5173`.

## Commands

Backend: `cd backend && python -m pytest -q`; frontend: `cd frontend && npm test`; checks: `cd frontend && npm run lint && npm run build`.

## Next

- Review/commit untracked CI workflow.
- Close R8, R13, R16, R17, R19 gaps in the assessment.
- Synchronize memory bank after changes.
- Defer database, production config, and bridge remediation until explicitly scoped.
