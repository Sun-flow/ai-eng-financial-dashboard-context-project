# Rule: Minimal Build Contexts

## Scope
Docker builds for all services

## Rule Statement
Build contexts must be minimized to exclude unnecessary files.

## Rationale
Docker sends the entire build context directory — including `node_modules`, `__pycache__`, `.git`, and other artifacts — to the Docker daemon for every build. This slows builds, wastes bandwidth, and can cause cache invalidation when irrelevant files change. Both `backend/.dockerignore` and `frontend/.dockerignore` exist and exclude the relevant artifacts for each service.

## Application Guidance
- Keep `.dockerignore` in both `backend/` and `frontend/` (already present).
- Exclude: `node_modules/`, `__pycache__/`, `*.pyc`, `.git/`, `.env`, `.venv/`, `dist/`, `*.egg-info/`, `.pytest_cache/`, `.vscode/`.
- Keep `.dockerignore` files in each service directory, not at the repository root, so each build context only ignores what's relevant.
- Review `.dockerignore` when adding new development artifacts (e.g. new cache directories, lockfiles that shouldn't be excluded).

## Supporting References
- `backend/.dockerignore` – excludes `__pycache__/`, `*.pyc`, `.git/`, `.env`, `.venv/`, `.pytest_cache/`, etc.
- `frontend/.dockerignore` – excludes `node_modules/`, `.git/`, `.env`, `dist/`, etc.