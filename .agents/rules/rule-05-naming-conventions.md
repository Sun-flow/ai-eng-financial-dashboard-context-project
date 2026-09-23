# Rule: Naming Conventions

## Scope
All files and exported symbols in the frontend codebase

## Rule Statement
File names use kebab-case; exported symbols use PascalCase (components and types) or camelCase (functions and variables).

## Rationale
Consistent naming makes the codebase navigable by convention: developers can predict the file name from the component name and vice versa. The current codebase already follows this pattern uniformly — new code must maintain consistency.

## Application Guidance
- Component files: `kebab-case.tsx` → exports `PascalCase` (e.g. `kpi-card.tsx` → `KPICard`).
- Utility files: `kebab-case.ts` → exports `camelCase` (e.g. `financial-utils.ts` → `computeKPIs`).
- Type files: `kebab-case.ts` → exports `PascalCase` interfaces (e.g. `financial-types.ts` → `FinancialMovement`).
- Python files on the backend: already use snake_case naturally; maintain that.

## Supporting References
- `docs/conventions.md` – §2.1: File & folder naming table with all evidence