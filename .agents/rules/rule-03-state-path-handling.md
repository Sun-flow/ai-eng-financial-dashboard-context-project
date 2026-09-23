# Rule: State Path Handling

## Scope
Frontend React components

## Rule Statement
Every non-trivial state path (loading, error, empty, success) must be explicitly handled in the UI.

## Rationale
Users should never see a blank screen, infinite spinner, or crash. Four states cover virtually all async data scenarios: loading (skeleton/spinner), error (informative message with recovery path), empty (explanation that no data exists), and success (the actual content). The current codebase handles most of these but is missing an error boundary for render-time crashes.

## Application Guidance
- Every data-fetching component must render distinct UI for `loading`, `error`, `data.length === 0`, and `data.length > 0`.
- Wrap the application (or at minimum the dashboard) in a React error boundary to catch render errors.
- Error messages must be user-friendly and actionable, not technical.
- Empty states should explain *why* there's no data when possible.

## Supporting References
- `docs/conventions.md` – §4.1: Skeleton loading in `kpi-card.tsx`
- `docs/conventions.md` – §4.2: Error banner in `App.tsx`
- `docs/conventions.md` – §4.3: "No data available" fallback in chart components
- `docs/health-assessment.md` – Code Quality Observations: No error boundary exists