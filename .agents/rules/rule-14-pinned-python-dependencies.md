# Rule: Pinned Python Dependencies

## Scope
Backend `requirements.txt`

## Rule Statement
Python dependencies must be pinned to specific versions for reproducible builds.

## Rationale
Unpinned dependencies (`fastapi`, `uvicorn[standard]`, `debugpy`, etc.) produce different builds at different points in time as packages release new versions. This creates "works on my machine" bugs and makes CI failures unreproducible. Pinning ensures every install — local, CI, or production — resolves the exact same package versions. A lockfile (`requirements.lock`, `Pipfile.lock`, or `poetry.lock`) is the gold standard.

## Application Guidance
- Pin to exact versions: `fastapi==0.115.0` not `fastapi`.
- Use a lockfile for transitive dependencies (e.g. `pip freeze > requirements.lock`).
- Update pinned versions intentionally via a dedicated PR, not incidentally during other work.
- Document the update policy (e.g. "monthly dependency bump" or "Dependabot/Renovate").

## Supporting References
- `docs/health-assessment.md` – Backend Dependencies: all 6 packages in `requirements.txt` are unpinned
- `docs/health-assessment.md` – Code Quality Observations – Infrastructure: no lockfile exists