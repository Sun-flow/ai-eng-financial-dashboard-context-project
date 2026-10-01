# Rule: Container/Presentational Separation

## Scope
Frontend React component architecture

## Rule Statement
Side effects belong at the container level; presentational components must be pure. Child components must not import `fetch`, `axios`, or any HTTP client.

## Rationale
Separating data-fetching (containers) from rendering (presentational components) makes components testable, reusable, and easier to reason about. A presentational component's output is purely determined by its props — no hidden network calls, no global state access. The current codebase already follows this pattern correctly; new code must not regress.

## Application Guidance
- The `useFinancialData` hook is the container — it owns all `useState`, `useEffect`, and data fetching; `App.tsx` simply calls the hook and passes its results down as props.
- Components in `components/dashboard/` must receive data via props only.
- To add a new data dependency, thread it through the hook/container layer, not through a new `useEffect` inside a child.
- Extract complex data logic into custom hooks (`useFinancialData`, etc.) but keep them at the container level, not inside presentational components.

## Supporting References
- `docs/conventions.md` – §1.1: `useFinancialData` hook owns all state; `App.tsx` destructures and passes down as props
- `docs/project-map.md` – Component Tree: all 5 dashboard components receive data via props
- `frontend/src/hooks/use-financial-data.ts` – `fetchFinancialData` and all `useState` calls live inside the hook, not in `App.tsx`