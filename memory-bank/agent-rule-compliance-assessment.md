# Agent Rule Compliance Assessment

> **Date**: September 23, 2026  
> **Source**: `.agents/rules/` — 22 axiom-like development rules  
> **Method**: Manual audit against live codebase state at commit `6b9e417`


## Compliance Summary

| Status | Count | Rules |
|--------|-------|-------|
| ✅ Compliant | 9 | R4, R5, R6, R7, R8, R9, R10, R16, R21 |
| ❌ Needs Fix | 13 | R1, R2, R3, R11, R12, R13, R14, R15, R17, R18, R19, R20, R22 |
| **Total** | **22** | |


## ✅ Compliant Rules (No Violations Found)

### R4 — Container/Presentational Separation

### R5 — Naming Conventions

### R6 — Import Path Convention

### R7 — Pure Transformation Functions

### R8 — Chart Color Semantics

### R9 — snake_case in Python

### R10 — APIRouter Pattern

### R16 — Frontend Utility Tests

### R21 — Consistent API Parameter Names


## ❌ Needs Fix — Rules with Violations

### R1 — Exhaustive Dependencies
  1. `pydantic` is imported in `backend/app/routes.py` (`from pydantic import BaseModel`) but is not listed in `backend/requirements.txt` — it resolves only transitively via `fastapi`.
  2. `pytest-cov` is listed in `backend/requirements.txt` but is neither imported nor configured anywhere.

### R2 — Parameterized Configuration
  1. `frontend/vite.config.ts` hardcodes the proxy target to `http://backend:8000`, which only resolves inside Docker Compose.
  2. `backend/app/main.py` hardcodes CORS to `allow_origins=["*"]` with no environment awareness.

### R3 — State Path Handling
  1. No React error boundary exists anywhere in `frontend/src/`. Unhandled render errors crash the entire app.

### R11 — Seeded and Cached Mock Data
  1. `generate_mock_movements(seed=42)` is called fresh on every request handler — no caching or memoization.
  2. `_year_for_month()` uses `date.today()`, making output date-dependent despite the fixed seed.

### R12 — Docker Healthchecks
  1. `docker-compose.yml` specifies `depends_on: [backend]` with no `healthcheck:` block for the backend service.

### R13 — Dev/Prod Image Separation
  1. `backend/Dockerfile` includes `debugpy` in `requirements.txt` and `--reload` in the CMD — both development concerns baked into the production image.

### R14 — Pinned Python Dependencies
  1. All 6 packages in `backend/requirements.txt` are unpinned (no `==` version constraints).
  2. No lockfile exists.

### R15 — Backend TestClient Usage
  1. `TestClient` is instantiated at module level in `test_routes.py` (`client = TestClient(app)`) rather than via a pytest fixture, risking state leakage between tests.

### R17 — Component Render Tests
  1. No `.test.tsx` files exist anywhere under `frontend/src/components/`. Zero presentational components have render tests.

### R18 — Single Natural Language
  1. `frontend/src/App.tsx` sets an error message in Spanish: `"No se pudo cargar la información financiera. Revisa la API de backend."` while every other user-facing string is English.

### R19 — No Dead Code
  1. `frontend/src/lib/mock-data.ts` contains 52 hand-written `FinancialMovement` objects but is never imported by any file in the repository.

### R20 — No Hardcoded Derivatives
  1. `frontend/index.html` has `<title>frontend</title>` — a Vite scaffold default, not the application name.
  2. `frontend/src/components/dashboard/dashboard-header.tsx` hardcodes `period="2024 - Full Year"` which does not match the actual data range.

### R22 — Minimal Build Contexts
  1. Neither `backend/` nor `frontend/` has a `.dockerignore` file — `node_modules`, `__pycache__`, and other artifacts are sent to the Docker daemon on every build.


## Rule Enforcement Priority

Based on number of violations and operational impact:

| Priority | Rules | Rationale |
|----------|-------|-----------|
| 🔴 Immediate | R2, R11, R13, R14, R18, R20 | Blockers or user-facing issues |
| 🟡 This Session | R1, R3, R12, R19, R22 | Quick fixes, high compliance impact |
| 🟢 Next Iteration | R15, R17 | New patterns (testing) that take longer to establish |