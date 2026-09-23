# Rule: Consistent API Parameter Names

## Scope
Backend FastAPI route definitions

## Rule Statement
API parameter names in route decorators must match function parameter names exactly.

## Rationale
FastAPI uses the function parameter name to extract query/body/path parameters. When the decorator uses one name and the function signature uses another, FastAPI follows the decorator — but the code becomes misleading to readers. In `routes.py`, the comparison endpoint decorator uses `strat_date` (a typo of `start_date`) while the function parameter is `start_date`. This works because FastAPI reads from the decorator, but it's confusing and inconsistent with every other endpoint.

## Application Guidance
- The parameter name in the route decorator and the function definition must be identical strings.
- Use consistent parameter names across endpoints: if one endpoint uses `start_date`, all should.
- Code review should catch decorator/function name mismatches.
- Rename the function parameter to match the decorator if the decorator name is correct; rename the decorator if the function name is correct.

## Supporting References
- `docs/conventions.md` – §6 Anti-patterns: `strat_date` typo in comparison endpoint decorator vs `start_date` in function signature