# Rule: Seeded and Cached Mock Data

## Scope
Backend mock data generators

## Rule Statement
Mock data generators must use a fixed seed for reproducibility and must be cached, not regenerated per request.

## Rationale
Reproducibility is critical for testing and debugging: a fixed seed ensures the same sequence of "random" values every time. The codebase decorates `generate_mock_movements(seed, today)` with `@lru_cache(maxsize=1)`, so movements are generated once per unique `(seed, today)` combination and served from cache thereafter — no per-request rebuild. Both `seed` and `today` are optional explicit parameters (defaulting to `None` → `date.today()`), so tests can override them for deterministic, reproducible output; the default (no explicit `today`) is intentionally date-dependent so the mock data stays relevant to "now" in normal operation.

## Application Guidance
- Generate mock data once and cache it (e.g. via `lru_cache`), not inside every route handler invocation.
- Accept `seed` and `today` as explicit optional parameters so tests can override them for determinism; let the default remain date-dependent for realistic demo data.
- Keep a deterministic default seed (`seed=42`, set by the route handlers) for reproducibility across runs with the same date.

## Supporting References
- `backend/app/routes.py` – `generate_mock_movements(seed: int | None = None, today: date | None = None)` decorated with `@lru_cache(maxsize=1)`
- `backend/app/routes.py` – `_year_for_month` accepts an optional `today` override, falling back to `date.today()` only when not supplied
- `backend/tests/test_routes.py` – tests pass explicit `today` values to get deterministic, reproducible movement sets