# Rule: Component Render Tests

## Scope
Frontend presentational components

## Rule Statement
Every presentational component must at minimum have a render test that validates loading, data, and empty states.

## Rationale
Presentational components are deterministic — given props X, they render output Y. This makes them ideal for render testing. The `kpi-card.tsx` component conditionally renders `<Skeleton>` or `<span>` depending on the `loading` prop; both chart components branch on all-zero data vs. real data. None of these branches have test coverage. A render test for each state catches regressions when props change or the component is refactored.

## Application Guidance
- Use `@testing-library/react` for rendering and assertions.
- Test the loading state: pass `loading={true}` and assert that `<Skeleton>` renders.
- Test the data state: pass realistic data and assert that expected values appear in the DOM.
- Test the empty state: pass an empty array or all-zero data and assert the empty-state message renders.
- Test the error state where applicable: pass `null` data and assert graceful fallback.
- Place test files next to the component: `kpi-card.test.tsx` alongside `kpi-card.tsx`.

## Supporting References
- `docs/conventions.md` – §4.1: `kpi-card.tsx` renders `<Skeleton>` when `loading` is true
- `docs/health-assessment.md` – Test Coverage Gaps: frontend components have zero tests
- `docs/health-assessment.md` – Component Imports: 5 dashboard components with branching render logic