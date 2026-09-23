# Rule: Chart Color Semantics

## Scope
Recharts components in the frontend dashboard

## Rule Statement
Recharts components must use consistent color semantics: green (`#10b981`) for income, red (`#ef4444`) for outcome. Reference lines (e.g. zero/profitability boundary) must be visually distinct via dashed styling.

## Rationale
Consistent color mapping builds an implicit visual language: users internalize that green = positive, red = negative without reading labels. The green/red pairing for income/outcome is already established in the codebase. Reference lines must be dashed to avoid confusion with data series lines.

## Application Guidance
- Income lines and bars: `stroke="#10b981"` or `fill="#10b981"`.
- Outcome lines and bars: `stroke="#ef4444"` or `fill="#ef4444"`.
- Reference lines: `stroke="#666" strokeDasharray="4 4"`.
- All new chart components must follow this palette; do not introduce new colors for income/outcome.
- For tertiary data series (e.g. profit, net), use neutral or blue tones.

## Supporting References
- `docs/conventions.md` – §5.2: `income-outcome-chart.tsx` uses green/red; `profit-percent-chart.tsx` uses dashed reference line