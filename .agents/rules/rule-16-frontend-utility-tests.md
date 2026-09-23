# Rule: Frontend Utility Tests

## Scope
Frontend `lib/` utility functions

## Rule Statement
Frontend utility functions must have Vitest unit tests with `describe`/`it` blocks.

## Rationale
Utility functions (transformations, formatters, validators) are the easiest and most valuable unit tests: they have no dependencies on the DOM, network, or component tree. The current codebase has 3 such tests for `computeKPIs` and `computeMonthlyData` using Vitest with `describe`/`it` blocks — a pattern that must be maintained for all new utility functions.

## Application Guidance
- Create test files alongside the source file: `financial-utils.test.ts` next to `financial-utils.ts`.
- Use `describe` blocks to group related tests (e.g. `describe('computeKPIs')`).
- Use descriptive `it` names: `it('calculates totals and profit values')`.
- Test edge cases: empty arrays, zero values, negative amounts, single-item arrays.
- Run tests with `npx vitest run` before committing.

## Supporting References
- `docs/health-assessment.md` – Frontend Tests: 3 test cases, 2 describe blocks
- `docs/health-assessment.md` – Test Coverage Gaps: only utility functions have tests; components have zero tests
- `docs/conventions.md` – §3.2: Vitest + describe/it block convention