# Rule: Minimal Build Contexts

## Scope
Docker builds for all services

## Rule Statement
Build contexts must be minimized to exclude unnecessary files.

## Rationale
Docker sends the entire build context directory — including `node_modules`, `__pycache__`, `.git`, and other artifacts — to the Docker daemon for every build. This slows builds, wastes bandwidth, and can cause cache invalidation when irrelevant files change. Neither the backend nor the frontend has a `.dockerignore` file, meaning every build sends the full project structure.

## Application Guidance
- Create `.dockerignore` in both `backend/` and `frontend/`.
- Exclude: `node_modules/`, `__pycache__/`, `*.pyc`, `.git/`, `.env`, `.venv/`, `dist/`, `*.egg-info/`.
- Keep `.dockerignore` files in each service directory, not at the repository root, so each build context only ignores what's relevant.
- Review `.dockerignore` when adding new development artifacts.

## Supporting References
- `docs/health-assessment.md` – Code Quality Observations – Infrastructure: no `.dockerignore` files exist for either service