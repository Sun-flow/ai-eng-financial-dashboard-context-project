# Rule: Pure Transformation Functions

## Scope
Frontend data processing logic

## Rule Statement
Data transformation must live in pure utility functions, not inside components or hooks.

## Rationale
Pure functions — deterministic, side-effect-free, with no state access — are trivially testable, composable, and reusable. The current codebase already follows this pattern: `computeKPIs()` and `computeMonthlyData()` are standalone exports in `financial-utils.ts` that accept `FinancialMovement[]` and return derived objects. Keeping transformations separate from components means they can be unit-tested without rendering a component tree.

## Application Guidance
- Any logic that transforms input A into output B should be a standalone exported function in `lib/`.
- Components should call these functions but never contain the transformation logic inline.
- New transformations (e.g. filtering, aggregation, formatting) go in `financial-utils.ts` or a new `lib/` module if thematically distinct.
- Functions must not reference React state, props, or hooks.

## Supporting References
- `docs/project-map.md` – Data Flow section: `computeKPIs` and `computeMonthlyData` called between fetch and render
- `docs/conventions.md` – §1.3: Data flow pattern: Fetch → Transform → Render
- `docs/health-assessment.md` – Frontend tests: 3 Vitest tests for these pure functions