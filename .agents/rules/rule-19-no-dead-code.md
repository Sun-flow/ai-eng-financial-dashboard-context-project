# Rule: No Dead Code

## Scope
All source files in the repository

## Rule Statement
Dead code (files that are never imported or reachable) must be removed.

## Rationale
Dead code increases maintenance surface area for no benefit. It must be read, understood, and accounted for during refactoring, yet it contributes nothing to the application. A prior audit found one instance: `mock-data.ts` with 52 hand-written `FinancialMovement` objects was never imported by any file, duplicating content already produced by the backend's `generate_mock_movements()` function. The file has since been deleted (`docs/operational-blockers.md` #8 is marked ✅ FIXED); this rule remains in force to catch any future dead code.

## Application Guidance
- Before removing a file, verify it is not imported anywhere: `grep -r "mock-data" frontend/src/`.
- Check for both direct imports and re-exports through barrel files.
- If a file might be useful in the future, move it to a `_archive/` directory rather than leaving it in the source tree.
- Dead code detection can be automated via ESLint's `no-unused-vars` and TypeScript's `noUnusedLocals`.

## Supporting References
- `docs/operational-blockers.md` – Issue #8: `mock-data.ts` was dead code; now deleted and marked ✅ FIXED
- `docs/project-map.md` – Repository Structure: `mock-data.ts` no longer present in the tree