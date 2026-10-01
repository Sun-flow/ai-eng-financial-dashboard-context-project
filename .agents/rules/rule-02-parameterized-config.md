# Rule: Parameterized Configuration

## Scope
All environment-dependent configuration (Docker, local dev, production)

## Rule Statement
Configuration that differs between environments must be parameterized, not hardcoded. Hardcoded values that depend on environmental context (Docker vs. local, dev vs. prod) are bugs waiting to surface.

## Rationale
Hardcoded environment-specific values force every developer to edit source files to match their setup, creating merge conflicts and making the project harder to onboard. (Historical example: the Vite proxy target was once hardcoded to `http://backend:8000`, which only worked inside Docker and required editing `vite.config.ts` to run locally. It is now read from `VITE_API_PROXY_TARGET` with a `http://localhost:8000` fallback.) CORS `"*"` is appropriate for dev but dangerous for production; it is now read from the `CORS_ORIGINS` environment variable rather than hardcoded, though `"*"` remains the default and should be locked down before any production deployment.

## Application Guidance
- Use environment variables with sensible defaults for any value that changes between environments.
- Wire `.env.example` values into actual config; don't just document them.
- For Vite, use `process.env.VITE_API_PROXY_TARGET || "http://localhost:8000"` for the dev-server proxy target.
- For CORS, read `CORS_ORIGINS` (comma-separated) from an environment variable.

## Supporting References
- `frontend/vite.config.ts` – proxy target driven by `VITE_API_PROXY_TARGET`, defaulting to `http://localhost:8000`
- `backend/app/main.py` – CORS origins driven by `CORS_ORIGINS` env var (comma-separated, default `"*"`)
- `docker-compose.yml` – sets `VITE_API_PROXY_TARGET=http://backend:8000` and `CORS_ORIGINS=http://localhost:5173` for the containerized environment