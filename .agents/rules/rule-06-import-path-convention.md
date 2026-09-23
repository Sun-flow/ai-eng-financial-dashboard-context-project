# Rule: Import Path Convention

## Scope
Frontend TypeScript imports

## Rule Statement
The `@/` path alias must be used for cross-directory imports; relative imports (`./`) are for same-directory siblings only.

## Rationale
The `@/` alias (mapped to `./src` in both `tsconfig.app.json` and `vite.config.ts`) provides a clean, refactor-safe way to reference files across the source tree. Relative imports for cross-directory references break when files are moved, creating a maintenance burden. The convention "siblings relative, everything else alias" is simple to enforce and understand.

## Application Guidance
- From `components/dashboard/kpi-row.tsx` to `components/dashboard/kpi-card.tsx` → `./kpi-card`.
- From `components/dashboard/kpi-card.tsx` to `lib/financial-utils.ts` → `@/lib/financial-utils`.
- From `components/dashboard/kpi-card.tsx` to `components/ui/skeleton.tsx` → `@/components/ui/skeleton`.
- Never use `../../` style relative imports for cross-directory references.

## Supporting References
- `docs/health-assessment.md` – Component Imports table: sibling import `./kpi-card`
- `docs/health-assessment.md` – Component Imports table: cross-directory imports via `@/`
- `docs/project-map.md` – Vite Config: `resolve.alias` maps `@` → `./src`
- `docs/project-map.md` – TypeScript Config: paths `@/*` → `./src/*`