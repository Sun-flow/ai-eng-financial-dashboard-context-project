# Operational Blockers — Issues Preventing Proper Operation

> **Identified**: September 23, 2026  
> **Last updated**: October 1, 2026  
> Priority: Critical (prevents or disrupts running the project)

---

## 🔶 Deferred / Paused — Inter-Container Networking Broken (10)

> **Status: PAUSED.** Do not pursue further without explicit direction.

**Symptom:** `docker compose up` starts both containers and the backend reports `Healthy`, but the **frontend UI loads forever** (never receives `/api/metrics` data).

**Root cause (diagnosed):** Frontend ↔ backend containers **cannot route to each other** over the compose bridge network, verified in both directions:
- Frontend container → `backend:8000` and backend IP `172.18.0.2:8000` → **time out**
- Backend container → frontend IP `172.18.0.3:5173` → **time out**
- Each container reaches its own loopback and own IP fine; all services healthy individually → the break is purely inter-container routing.
- `ip_forward=1`; network has no special options (`internal=false`); ICC not disabled; yet traffic is blocked. Suspected host/DinD-level firewall (`iptables` not inspectable without root) or nested-Docker bridge breakage.

**Tried without success:** `docker compose down` → `docker network prune -f` → `docker compose up -d` (fresh network + containers). Cross-container timeouts persisted.

**Recommended future path (deferred):** Fix host bridge/iptables state, or run frontend outside Docker pointed at `localhost:8000` via `VITE_API_PROXY_TARGET`.

---

## 🟡 Open — Medium Severity

### 5. `debugpy` + Python 3.13 Compatibility Unknown

**File:** `backend/Dockerfile`
```dockerfile
FROM python:3.13-slim
```

**Problem:** Python 3.13 introduced significant CPython internals changes (PEP 703 free-threaded mode groundwork, JIT compiler work). `debugpy` is a debugger that hooks deep into CPython. If the installed `debugpy==1.8.22` doesn't fully support Python 3.13, it could crash on import or fail to attach, taking down the container.

**Severity:** 🟡 **Medium** — May or may not be an issue depending on debugpy's 3.13 support status.

**Fix:** Pin to `python:3.12-slim` if debugpy fails, or test with 3.13 first.

---

## ✅ Fixed Issues (Historical Record)

These issues were identified and resolved in previous sessions. They remain documented so that future agents understand *why* the current configuration exists as it does, without treating them as open work.

### #1 — Backend `--reload` Flag Causes Restart Loop (Docker)

**Solution:** `--reload` removed from the development target CMD in `backend/Dockerfile`. The dev target now runs uvicorn without `--reload`; only local (non-Docker) development uses `--reload`.

### #2 — Vite Proxy `backend:8000` Won't Resolve Outside Docker

**Solution:** `VITE_API_PROXY_TARGET` environment variable added in `frontend/vite.config.ts`, defaulting to `http://localhost:8000`. The Docker compose override sets it to `http://backend:8000`.

### #3 — Mock Data Year Mismatch

**Solution:** Dashboard period label is now derived dynamically from actual data via `computePeriodLabel(movements)` in `financial-utils.ts`. The `DashboardHeader` receives the computed label instead of a hardcoded value.

### #4 — `depends_on` Without Health Check — Race Condition

**Solution:** `docker-compose.yml` now includes a `curl`-based healthcheck on the backend service and uses `depends_on: backend: condition: service_healthy`. `curl` was installed in the base Docker stage (required because `python:3.13-slim` does not ship it).

### #6 — Missing `/favicon.svg` Causes 404

**Solution:** `favicon.svg` was added to `frontend/public/`. The icon reference in `index.html` now resolves correctly.

### #7 — Generic HTML Title

**Solution:** `<title>` changed from `"frontend"` to `"Financial Dashboard"` in `frontend/index.html`.

### #8 — `mock-data.ts` Is Dead Code

**Solution:** `frontend/src/lib/mock-data.ts` was deleted. It was unused by any component.

### #9 — Error Message in Spanish (Mixed Language)

**Solution:** Error message in `use-financial-data.ts` translated from Spanish to English: `"Could not load financial data. Check the backend API."`

---

## Summary Table

| # | Issue | File | Severity | Status |
|---|-------|------|----------|--------|
| 1 | `--reload` + bind mount → restart loop | `backend/Dockerfile` | 🔴 Critical | ✅ **FIXED** |
| 2 | Vite proxy target `backend:8000` won't resolve locally | `frontend/vite.config.ts` | 🔴 Critical | ✅ **FIXED** |
| 3 | Mock data year mismatch (2025/2026 vs hardcoded "2024") | `backend/app/routes.py` | 🟠 High | ✅ **FIXED** |
| 4 | No healthcheck → startup race condition | `docker-compose.yml` | 🟡 Medium | ✅ **FIXED** |
| 5 | `debugpy` + Python 3.13 compatibility | `backend/Dockerfile` | 🟡 Medium | ❓ Unverified |
| 6 | Missing favicon → 404 | `frontend/public/` | 🟡 Medium | ✅ **FIXED** |
| 7 | Generic HTML title | `frontend/index.html` | 🟢 Low | ✅ **FIXED** |
| 8 | Dead code: `mock-data.ts` unused | `frontend/src/lib/mock-data.ts` | 🟢 Low | ✅ **FIXED** |
| 9 | Error message in Spanish (mixed language) | `frontend/src/App.tsx` | 🟢 Low | ✅ **FIXED** |
| 10 | Inter-container networking broken (frontend ↔ backend) | Docker bridge / host | 🔴 Critical | 🔶 **PAUSED/UNRESOLVED** |