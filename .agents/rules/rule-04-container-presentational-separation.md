# Rule: Container/Presentational Separation

## Scope
Frontend React component architecture

## Rule Statement
Side effects belong at the container level; presentational components must be pure. Child components must not import `fetch`, `axios`, or any HTTP client.

## Rationale
Separating data-fetching (containers) from rendering (presentational components) makes components testable, reusable, and easier to reason about. A presentational component's output is purely determined by its props — no hidden network calls, no global state access. The current codebase already follows this pattern correctly; new code must not regress.

## Application Guidance
- `App.tsx` is the container — it owns all `useState`, `useEffect`, `useCallback`, and data fetching.
- Components in `components/dashboard/` must receive data via props only.
- To add a new data dependency, thread it through the container layer, not through a new `useEffect` inside a child.
- Extract complex data logic into custom hooks (`useFinancialData`, etc.) but keep them at the container level.

## Supporting References
- `docs/conventions.md` – §1.1: `App.tsx` owns all state, passes down as props
- `docs/project-map.md` – Component Tree: all 5 dashboard components receive data via props
- `docs/health-assessment.md` – Code Quality Observations: `fetchFinancialData` lives inline in `App.tsx`