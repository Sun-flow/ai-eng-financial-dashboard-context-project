# Rule: Docker Healthchecks

## Scope
Docker Compose service orchestration

## Rule Statement
Docker Compose services that depend on other services must use healthchecks, not just `depends_on`.

## Rationale
`depends_on` only waits for a container to *start*, not for it to be *ready to accept connections*. The frontend may begin sending API requests before uvicorn is listening on port 8000, causing transient 502 errors on first load. The backend already exposes a `/health` endpoint (`{"status": "ok"}`) that is purpose-built for this check but is not wired into the Compose configuration.

## Application Guidance
- Add a `healthcheck` block to the backend service using `curl --fail http://localhost:8000/health`.
- Update the frontend's `depends_on` to `condition: service_healthy`.
- Keep healthcheck intervals reasonable (e.g. 10s interval, 3 retries, 5s timeout) to avoid unnecessary overhead.
- Any new service that depends on another must follow this pattern.

## Supporting References
- `docs/operational-blockers.md` – Issue #4: `depends_on` without healthcheck causes startup race condition
- `docs/health-assessment.md` – Docker Compose References: `/health` endpoint exists but unused by Docker