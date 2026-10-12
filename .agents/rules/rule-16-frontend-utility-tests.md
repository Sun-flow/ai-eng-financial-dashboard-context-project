# Rule: Frontend Utility Tests

## Scope
Frontend `lib/` utility functions

## Rule Statement
Frontend utility functions must have Vitest unit tests with `describe`/`it` blocks.

## Rationale
Utility functions (transformations, formatters, validators) are the easiest and most valuable unit tests: they have no dependencies on the DOM, network, or component tree. The current codebase has 9 such tests across 4 `describe` blocks (`computeKPIs`, `computeMonthlyData`, `formatters`, `computePeriodLabel`) in `financial-utils.test.ts`, using Vitest with `describe`/`it` blocks — a pattern that must be maintained for all new utility functions.

## Application Guidance
- Create test files alongside the source file: `financial-utils.test.ts` next to `financial-utils.ts`.
- Use `describe` blocks to group related tests (e.g. `describe('computeKPIs')`).
- Use descriptive `it` names: `it('calculates totals and profit values')`.
- Test edge cases: empty arrays, zero values, negative amounts, single-item arrays.
- Run tests with `npx vitest run` before committing.

## Supporting References
- `frontend/src/lib/financial-utils.test.ts` – 9 test cases across 4 `describe` blocks (`computeKPIs`, `computeMonthlyData`, `formatters`, `computePeriodLabel`)
- `frontend/src/lib/utils.test.ts` – additional utility tests for the `cn` helper
- `frontend/src/components/dashboard/kpi-row.test.tsx` – component render tests using the same Vitest `describe`/`it` convention