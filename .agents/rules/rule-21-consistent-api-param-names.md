# Rule: Consistent API Parameter Names

## Scope
Backend FastAPI route definitions

## Rule Statement
API parameter names in route decorators must match function parameter names exactly.

## Rationale
FastAPI uses the function parameter name to extract query/body/path parameters. When the decorator uses one name and the function signature uses another, FastAPI follows the decorator — but the code becomes misleading to readers. (Historical note: the comparison endpoint once had a `strat_date` typo in a query parameter; this has been corrected. All endpoints now consistently use `start_date`/`end_date`.)

## Application Guidance
- The parameter name in the route decorator and the function definition must be identical strings.
- Use consistent parameter names across endpoints: if one endpoint uses `start_date`, all should.
- Code review should catch decorator/function name mismatches.
- Rename the function parameter to match the decorator if the decorator name is correct; rename the decorator if the function name is correct.

## Supporting References
- `backend/app/routes.py` – `get_metrics`, `get_metrics_summary`, `get_top_categories`, and `get_metrics_comparison` all consistently use `start_date`/`end_date` as both the `Query(...)` parameter and the function argument