# Rule: Backend TestClient Usage

## Scope
Backend API tests

## Rule Statement
Backend routes must be tested via `TestClient` from `fastapi.testclient` with isolated app instances.

## Rationale
`TestClient` provides a lightweight HTTP client for FastAPI that doesn't require a running server — it invokes the ASGI app directly. This makes tests fast, self-contained, and suitable for CI. The current codebase already uses `TestClient` across 15 test functions covering mock generation, health check, filter combinations, date ranges, and B2B/B2C filtering, but the client is created at module level rather than via a fixture, which can leak state between tests.

## Application Guidance
- Use `from fastapi.testclient import TestClient`.
- Create a fixture that instantiates a fresh `TestClient` with a fresh app per test to prevent state leakage.
- Test both happy paths (200 responses, correct data shapes) and edge cases (empty results, missing params, invalid dates).
- Name tests descriptively: `test_health_endpoint_returns_ok`, `test_filter_by_date_range_returns_filtered_results`.
- Use `conftest.py` for shared fixtures.

## Supporting References
- `docs/health-assessment.md` – Python Imports — tests: `TestClient` imported and used in 15 tests
- `docs/project-map.md` – Backend Tests: coverage includes health, filters, date ranges, B2B/B2C
- `docs/health-assessment.md` – Backend Tests table: tests are synchronous, no fixtures for client creation