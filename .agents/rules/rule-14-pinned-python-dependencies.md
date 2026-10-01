# Rule: Pinned Python Dependencies

## Scope
Backend `requirements.txt`

## Rule Statement
Python dependencies must be pinned to specific versions for reproducible builds.

## Rationale
Unpinned dependencies (`fastapi`, `uvicorn[standard]`, `pydantic`, etc.) produce different builds at different points in time as packages release new versions. This creates "works on my machine" bugs and makes CI failures unreproducible. Pinning ensures every install — local, CI, or production — resolves the exact same package versions. A prior audit found `requirements.txt` unpinned with no lockfile; this has since been corrected: all 3 packages in `requirements.txt` are pinned to exact versions (`fastapi==0.141.1`, `uvicorn[standard]==0.53.0`, `pydantic==2.13.5`), and a full transitive lockfile (`requirements.lock`) exists alongside it.

## Application Guidance
- Pin to exact versions: `fastapi==0.115.0` not `fastapi`.
- Use a lockfile for transitive dependencies (e.g. `pip freeze > requirements.lock`).
- Update pinned versions intentionally via a dedicated PR, not incidentally during other work.
- Document the update policy (e.g. "monthly dependency bump" or "Dependabot/Renovate").

## Supporting References
- `backend/requirements.txt` – all 3 packages pinned to exact versions
- `backend/requirements.lock` – full transitive dependency lockfile present
- `docs/health-assessment.md` – Backend Dependencies: pinned versions confirmed