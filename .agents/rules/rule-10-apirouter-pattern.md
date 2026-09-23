# Rule: APIRouter Pattern

## Scope
Backend FastAPI route registration

## Rule Statement
API routes must be registered on an `APIRouter` instance, not directly on the app.

## Rationale
Using `APIRouter` keeps route definitions modular and testable — routes can be imported, prefixed, and included in different app instances. The current codebase correctly uses `router = APIRouter()` in `routes.py` and includes it via `app.include_router(routes.router)` in `main.py`. This pattern supports future route splitting (e.g. separate routers for metrics, auth, admin).

## Application Guidance
- All new route files must create their own `router = APIRouter()` and register handlers with `@router.get(...)` etc.
- In `main.py`, include routers via `app.include_router(module.router)`.
- Do not use `@app.get(...)` or `@app.post(...)` outside of `main.py`.
- Use optional `prefix=` and `tags=` parameters on `APIRouter()` for route organization and OpenAPI grouping.

## Supporting References
- `docs/conventions.md` – §1.2: `routes.py` uses `APIRouter()`, `main.py` uses `app.include_router()`