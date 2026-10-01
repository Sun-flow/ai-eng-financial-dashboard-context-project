# Tech Stack and Dependencies

> **Verified**: September 29, 2026 from the repository manifests and Dockerfiles.

## Languages and Frameworks

- **Frontend**: TypeScript `~6.0.2`, React `^19.2.4`, React DOM `^19.2.4`
- **Frontend tooling**: Vite `^8.0.4`, Tailwind CSS `^4.2.2`, `@vitejs/plugin-react`
- **Backend**: Python 3.13, FastAPI `0.141.1`, Uvicorn `0.53.0`, Pydantic `2.13.5`
- **Charts and icons**: Recharts `^3.8.1`, Lucide React `^1.8.0`
- **Frontend utilities**: `class-variance-authority`, `clsx`, and `tailwind-merge`
- **Frontend CSS/build support**: PostCSS, Autoprefixer, Tailwind Vite integration

## Testing and Quality Tooling

- **Backend**: pytest `9.1.1`, FastAPI TestClient, httpx `0.28.1`
- **Frontend**: Vitest `^4.1.4`, Testing Library React `^16.3.3`, jest-dom `^7.0.1`, jsdom `^30.1.1`
- **Lint/build**: ESLint `^9.39.4`, TypeScript project build, Vite production build
- **Debugging**: debugpy `1.8.22` in development requirements only

## Infrastructure, Locking, CI

- Compose orchestrates services; both Dockerfiles have dev/prod targets.
- Images: backend `python:3.13-slim`; frontend dev/build `node:24-alpine`; frontend prod `nginx:alpine`.
- Backend: runtime `requirements.txt`; dev/test `requirements-dev.txt`; full Python 3.13 lock `requirements.lock`.
- Frontend: `package.json` + `package-lock.json`.
- Tracked `.github/workflows/ci.yml`: Python 3.13/Node 24; backend tests; frontend lint, tests, build.

## Configuration

- `VITE_API_PROXY_TARGET`: `/api` proxy; local `http://localhost:8000`, Compose `http://backend:8000`.
- `VITE_API_BASE_URL`: optional frontend API prefix; default same origin.
- `CORS_ORIGINS`: comma-separated origins; default `*`, Compose `http://localhost:5173`.

## Development Commands

```text
cd backend && python -m pytest -q
cd frontend && npm test
cd frontend && npm run lint && npm run build
```

Local: Uvicorn 8000 + Vite 5173; proxy defaults to local backend. Compose is usable for image/orchestration checks, not service traffic, until the bridge issue is resolved.
