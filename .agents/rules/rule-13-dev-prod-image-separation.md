# Rule: Dev/Prod Image Separation

## Scope
Dockerfile configuration for all services

## Rule Statement
Production Docker images must be distinct from development images — multi-stage builds, no debugger, no reload.

## Rationale
Development and production have fundamentally conflicting needs: dev prioritizes hot-reload and debugging tools, while production prioritizes security, stability, and minimal image size. (Historical note: the backend Dockerfile once included `--reload` in its single build path; combined with bind mounts, this caused an infinite restart loop.) The current multi-stage Dockerfiles separate `development` (with `debugpy` for the backend) from `production` (plain `uvicorn`/`nginx`, no debugger, no reload).

## Application Guidance
- Maintain a single `Dockerfile` with multi-stage targets: `development` and `production` (current approach), or keep separate `Dockerfile.dev` and `Dockerfile.prod` files.
- Development stage: include debugger, use bind mounts; reload is intentionally omitted in this project due to the bind-mount restart-loop issue (see Issue #1 below).
- Production stage: omit debugger, omit `--reload`, pin dependencies, copy code at build time.
- Default `docker compose up` should use the dev target; a separate compose override or `target: production` build handles production.

## Supporting References
- `backend/Dockerfile` – multi-stage `base` → `development` (debugpy, no `--reload`) → `production` (plain `uvicorn`, no debugger)
- `frontend/Dockerfile` – multi-stage `base` → `development` (`npm run dev`) → `build` → `production` (`nginx:alpine` serving the built assets)
- `docs/operational-blockers.md` – Issue #1: historical `--reload` + bind mount infinite restart loop, since fixed by omitting `--reload` from the development stage