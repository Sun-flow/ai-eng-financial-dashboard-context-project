# Rule: Dev/Prod Image Separation

## Scope
Dockerfile configuration for all services

## Rule Statement
Production Docker images must be distinct from development images — multi-stage builds, no debugger, no reload.

## Rationale
Development and production have fundamentally conflicting needs: dev prioritizes hot-reload and debugging tools, while production prioritizes security, stability, and minimal image size. The current backend Dockerfile includes `debugpy` and `--reload` in the production build path — the `--reload` flag combined with bind mounts causes an infinite restart loop. Separating dev and prod configurations ensures each environment gets exactly what it needs without compromising the other.

## Application Guidance
- Maintain a single `Dockerfile` with multi-stage targets: `dev` and `prod`, or keep separate `Dockerfile.dev` and `Dockerfile.prod` files.
- Dev stage: include debugger, enable reload, use bind mounts.
- Prod stage: omit debugger, omit `--reload`, pin dependencies, copy code at build time.
- Default `docker compose up` should use the dev target; a separate `docker compose -f docker-compose.prod.yml` or overrides file handles production.

## Supporting References
- `docs/operational-blockers.md` – Issue #1: `--reload` + bind mount causes infinite restart loop
- `docs/health-assessment.md` – Code Quality Observations – Infrastructure: no production-optimized Dockerfiles exist