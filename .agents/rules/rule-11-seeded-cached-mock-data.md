# Rule: Seeded and Cached Mock Data

## Scope
Backend mock data generators

## Rule Statement
Mock data generators must use a fixed seed for reproducibility and must be cached, not regenerated per request.

## Rationale
Reproducibility is critical for testing and debugging: a fixed seed ensures the same sequence of "random" values every time. The current codebase correctly uses `seed=42` but calls `generate_mock_movements()` on every API request, rebuilding all 360 movements unnecessarily. Additionally, `_year_for_month` uses `date.today()`, making output date-dependent despite the fixed seed — a subtle inconsistency. Caching at module level (or via `lru_cache`) ensures consistent performance and identical output across requests within the same session.

## Application Guidance
- Generate mock data once at module level, not inside route handlers.
- If dynamic refresh is needed (e.g. for testing different dates), use `lru_cache` or a memoized factory with explicit parameters.
- Avoid `date.today()` in mock generators — accept the "current" date as an explicit parameter so it can be overridden in tests.
- Keep the deterministic seed (`seed=42`) for reproducibility.

## Supporting References
- `docs/project-map.md` – Backend Details: `generate_mock_movements(seed=42)` with deterministic seed
- `docs/conventions.md` – §6 Anti-patterns: mock data regenerated per request
- `docs/operational-blockers.md` – Issue #3: `_year_for_month` uses `date.today()` unpredictably