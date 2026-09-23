# Rule: No Dead Code

## Scope
All source files in the repository

## Rule Statement
Dead code (files that are never imported or reachable) must be removed.

## Rationale
Dead code increases maintenance surface area for no benefit. It must be read, understood, and accounted for during refactoring, yet it contributes nothing to the application. The current codebase has one clear instance: `mock-data.ts` with 52 hand-written `FinancialMovement` objects is never imported by any file. Its content is effectively duplicated by the backend's `generate_mock_movements()` function.

## Application Guidance
- Before removing a file, verify it is not imported anywhere: `grep -r "mock-data" frontend/src/`.
- Check for both direct imports and re-exports through barrel files.
- If a file might be useful in the future, move it to a `_archive/` directory rather than leaving it in the source tree.
- Dead code detection can be automated via ESLint's `no-unused-vars` and TypeScript's `noUnusedLocals`.

## Supporting References
- `docs/operational-blockers.md` – Issue #8: `mock-data.ts` is never imported
- `docs/project-map.md` – Repository Structure: `mock-data.ts` marked as dead code (⚠️)