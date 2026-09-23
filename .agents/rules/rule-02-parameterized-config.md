# Rule: Parameterized Configuration

## Scope
All environment-dependent configuration (Docker, local dev, production)

## Rule Statement
Configuration that differs between environments must be parameterized, not hardcoded. Hardcoded values that depend on environmental context (Docker vs. local, dev vs. prod) are bugs waiting to surface.

## Rationale
Hardcoded environment-specific values force every developer to edit source files to match their setup, creating merge conflicts and making the project harder to onboard. The Vite proxy target `http://backend:8000` only works inside Docker; running locally requires editing `vite.config.ts`. CORS `["*"]` is appropriate for dev but dangerous for production. Parameterizing these values via environment variables makes the codebase portable.

## Application Guidance
- Use environment variables with sensible defaults for any value that changes between environments.
- Wire `.env.example` values into actual config; don't just document them.
- For Vite, use `process.env.VITE_API_BASE_URL || "http://localhost:8000"`.
- For CORS, read `ALLOWED_ORIGINS` from an environment variable.

## Supporting References
- `docs/operational-blockers.md` – Issue #2: Vite proxy `backend:8000` only resolves in Docker
- `docs/project-map.md` – Configuration Files: `.env.example` exists but is not wired to proxy config
- `docs/health-assessment.md` – Code Quality Observations – Backend: CORS hardcoded to `["*"]`