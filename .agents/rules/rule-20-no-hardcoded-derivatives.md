# Rule: No Hardcoded Derivatives

## Scope
All source files — frontend and backend

## Rule Statement
Values that are derivable from data must not be hardcoded.

## Rationale
Hardcoded derived values inevitably drift from their source of truth. (Historical note: the dashboard header once hardcoded `"2024 - Full Year"` while the mock data spanned different months, and the HTML `<title>` was left at the Vite scaffold default `"frontend"`.) Both have since been fixed: the header period label is now computed from the actual movement data via `computePeriodLabel()`, and the `<title>` reads `"Financial Dashboard"`.

## Application Guidance
- Derive display labels from actual data rather than hardcoding them (e.g. compute the year range from the data's min/max dates, as `computePeriodLabel` does).
- Wire the HTML `<title>` to the application name, not a scaffold default.
- If a hardcoded value is intentional (e.g. "Full Year" vs. a date range), add a comment explaining why it cannot be derived.
- Review hardcoded strings during code review for derivability.

## Supporting References
- `frontend/src/lib/financial-utils.ts` – `computePeriodLabel()` derives the header period label from the min/max movement dates (e.g. `"Sep 2025 — Aug 2026"` or `"2025 — Full Year"`)
- `frontend/src/App.tsx` – passes the computed `periodLabel` into `DashboardHeader`
- `frontend/index.html` – `<title>Financial Dashboard</title>`