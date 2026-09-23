# Rule: Exhaustive Dependencies

## Scope
Frontend (`package.json`), Backend (`requirements.txt`)

## Rule Statement
Declared dependencies must be exhaustive; every import must resolve to a declared or stdlib dependency. Unused dependencies must be removed.

## Rationale
Transitive-only dependencies (e.g. `pydantic` coming through `fastapi`) create fragile builds: an upgrade to `fastapi` could drop the transitive dependency, breaking imports silently. Unused declared dependencies (e.g. `pytest-cov`) bloat install size and obscure what the project actually needs. Full bidirectionality — every declared dep is used, every used import is declared — ensures the dependency file is a reliable contract.

## Application Guidance
- When adding an import, check whether the package is directly listed in `requirements.txt` (Python) or `package.json` (TypeScript).
- Python stdlib modules (`datetime`, `random`, `math`, `typing`) do not need to be declared.
- Run `pip freeze` vs `requirements.txt` audits after dependency changes to catch drift.
- Remove packages that are declared but never imported anywhere.

## Supporting References
- `docs/health-assessment.md` – Backend Dependencies table: `pydantic` imported but not in `requirements.txt`
- `docs/health-assessment.md` – Backend Dependencies table: `pytest-cov` declared but unused
- `docs/health-assessment.md` – Dependency Status table: all 20 frontend packages confirmed used