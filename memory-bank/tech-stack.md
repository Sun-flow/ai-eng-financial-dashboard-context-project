# Tech Stack and Dependencies

> **Verified**: October 1, 2026 from manifests and Dockerfiles.

## Languages & Frameworks

- **Frontend**: TypeScript `~6.0.2`, React `^19.2.4`, Vite `^8.0.4`, Tailwind CSS `^4.2.2`, Recharts `^3.8.1`, Lucide React `^1.8.0`
- **Backend**: Python 3.13, FastAPI `0.141.1`, Uvicorn `0.53.0`, Pydantic `2.13.5`
- **Container**: `python:3.13-slim` (backend), `node:24-alpine` / `nginx:alpine` (frontend)

## Dependencies

- **28 frontend packages** (7 deps + 21 devDeps). 3 are unused: `class-variance-authority`, `autoprefixer`, `postcss` — leftovers from shadcn/ui CLI init, no PostCSS config exists.
- **Backend runtime**: `fastapi==0.141.1`, `uvicorn[standard]==0.53.0`, `pydantic==2.13.5`
- **Backend dev**: `debugpy==1.8.22`, `pytest==9.1.1`, `httpx==0.28.1`
- Lockfiles: `requirements.lock` (full Python freeze), `package-lock.json` (npm)

## Testing & CI

- **Backend**: pytest + FastAPI TestClient — 15 tests
- **Frontend**: Vitest + Testing Library + jest-dom — 56 tests (10 test files)
- **Lint**: ESLint `^9.39.4` (flat config)
- **CI**: `.github/workflows/ci.yml` — Python 3.13, Node 24; backend tests, frontend lint/tests/build on push/PR to main

## Configuration

- `VITE_API_PROXY_TARGET`: Vite `/api` proxy target (default `http://localhost:8000`)
- `VITE_API_BASE_URL`: optional frontend API base URL override
- `CORS_ORIGINS`: comma-separated allowed origins (default `*`, Compose sets `http://localhost:5173`)

## Commands

```
cd backend && python -m pytest -q
cd frontend && npm test
cd frontend && npm run lint && npm run build
```
