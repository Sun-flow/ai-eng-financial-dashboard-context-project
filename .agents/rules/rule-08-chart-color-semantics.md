# Rule: Chart Color Semantics

## Scope
Recharts components in the frontend dashboard

## Rule Statement
Recharts components must use consistent color semantics: green for income, red for outcome. Reference lines (e.g. zero/profitability boundary) must be visually distinct via dashed styling.

## Rationale
Consistent color mapping builds an implicit visual language: users internalize that green = positive, red = negative without reading labels. **⚠️ Known gap:** the codebase does not yet follow this — `income-outcome-chart.tsx` uses `var(--chart-income)` / `var(--chart-outcome)`, which resolve in `frontend/src/index.css` to blue (`oklch(0.55 0.2 255)`) and orange (`oklch(0.65 0.18 30)`), not green/red. This rule describes the intended semantic, not the current implementation; closing the gap means updating the `--chart-income`/`--chart-outcome` CSS variables (or the components) to a green/red palette.

## Application Guidance
- Income lines and bars: green tone, e.g. `stroke="#10b981"` or an equivalent `--chart-income` value.
- Outcome lines and bars: red tone, e.g. `stroke="#ef4444"` or an equivalent `--chart-outcome` value.
- Reference lines: `stroke="#666" strokeDasharray="4 4"`.
- All new chart components must follow this palette; do not introduce new colors for income/outcome.
- For tertiary data series (e.g. profit, net), use neutral or blue tones.

## Supporting References
- `frontend/src/index.css` – `--chart-income`/`--chart-outcome` currently defined as blue/orange oklch values
- `frontend/src/components/dashboard/income-outcome-chart.tsx` – consumes `var(--chart-income)`/`var(--chart-outcome)`
- `memory-bank/current-status.md` – Rule Coverage Gaps: R8 listed as an open gap