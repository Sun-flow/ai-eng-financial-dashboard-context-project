# Rule: No Hardcoded Derivatives

## Scope
All source files — frontend and backend

## Rule Statement
Values that are derivable from data must not be hardcoded.

## Rationale
Hardcoded derived values inevitably drift from their source of truth. The dashboard header hardcodes `"2024 - Full Year"` but the actual mock data spans September 2025 to August 2026 — the label is inaccurate. The HTML `<title>` is `"frontend"` — a Vite scaffold default that was never updated to match the application name. Both should be derived from configuration or data.

## Application Guidance
- Derive display labels from actual data rather than hardcoding them (e.g. compute the year range from the data's min/max dates).
- Wire the HTML `<title>` to an environment variable or a config constant.
- If a hardcoded value is intentional (e.g. "Full Year" vs. a date range), add a comment explaining why it cannot be derived.
- Review hardcoded strings during code review for derivability.

## Supporting References
- `docs/operational-blockers.md` – Issue #3: `"2024 - Full Year"` doesn't match actual data range (Sep 2025 – Aug 2026)
- `docs/operational-blockers.md` – Issue #7: HTML `<title>` says `"frontend"` instead of `"Financial Dashboard"`