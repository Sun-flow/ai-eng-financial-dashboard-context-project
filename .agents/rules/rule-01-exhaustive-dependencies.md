# Rule: Exhaustive Dependencies

## Scope
Frontend (`package.json`), Backend (`requirements.txt`)

## Rule Statement
Declared dependencies must be exhaustive; every import must resolve to a declared or stdlib dependency. Unused dependencies must be removed.

## Rationale
Transitive-only dependencies create fragile builds: relying on a package only because a direct dependency happens to pull it in (rather than declaring it directly) means an upstream change could silently break imports. Unused declared dependencies bloat install size and obscure what the project actually needs. Full bidirectionality — every declared dep is used, every used import is declared — ensures the dependency file is a reliable contract. (Historical note: `pydantic` was once only transitive via `fastapi` and has since been pinned directly in `requirements.txt`.)

## Application Guidance
- When adding an import, check whether the package is directly listed in `requirements.txt` (Python) or `package.json` (TypeScript).
- Python stdlib modules (`datetime`, `random`, `math`, `typing`) do not need to be declared.
- Run `pip freeze` vs `requirements.txt` audits after dependency changes to catch drift.
- Remove packages that are declared but never imported anywhere.

## Supporting References
- `backend/requirements.txt` – `pydantic==2.13.5` is pinned directly (previously only transitive via `fastapi`)
- `backend/requirements.txt` / `backend/requirements-dev.txt` – no `pytest-cov` dependency is declared anywhere in the project
- `frontend/package.json` – 28 total declared packages (7 dependencies + 21 devDependencies); 25 confirmed used in code or build config, 3 (`class-variance-authority`, `autoprefixer`, `postcss`) are declared but never imported — leftovers from the shadcn/ui CLI init (see health-assessment.md ⚠️ rows)