# Rule: Component Render Tests

## Scope
Frontend presentational components

## Rule Statement
Every presentational component must at minimum have a render test that validates loading, data, and empty states.

## Rationale
Presentational components are deterministic — given props X, they render output Y. This makes them ideal for render testing. `kpi-card.tsx`, `dashboard-header.tsx`, `income-outcome-chart.tsx`, `profit-percent-chart.tsx`, and `error-boundary.tsx` each have a `*.test.tsx` file (3 tests apiece, 15 total) covering loading/non-loading and variant-specific rendering. The remaining gap is `kpi-row.tsx`, which has no render test — a render test for each state catches regressions when props change or the component is refactored.

## Application Guidance
- Use `@testing-library/react` for rendering and assertions.
- Test the loading state: pass `loading={true}` and assert that `<Skeleton>` renders.
- Test the data state: pass realistic data and assert that expected values appear in the DOM.
- Test the empty state: pass an empty array or all-zero data and assert the empty-state message renders.
- Test the error state where applicable: pass `null` data and assert graceful fallback.
- Place test files next to the component: `kpi-card.test.tsx` alongside `kpi-card.tsx`.

## Supporting References
- `docs/conventions.md` – §4.1: `kpi-card.tsx` renders `<Skeleton>` when `loading` is true
- `docs/health-assessment.md` – Test Status table: component render test coverage (15 tests across 5 components)
- `frontend/src/components/dashboard/kpi-row.tsx` – presentational component still without a render test