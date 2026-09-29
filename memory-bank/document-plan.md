# Memory Bank Document Plan

## Required Documents

| File | Purpose | Current coverage |
|---|---|---|
| `project-overview.md` | Product purpose, verified surface, boundaries, evidence sources | Complete |
| `tech-stack.md` | Languages, frameworks, dependencies, infrastructure, tooling, configuration | Complete |
| `current-status.md` | Working behavior, blockers, warnings, product gaps, next priorities, checks | Complete |
| `compact-context.md` | Short resume point for future agents | Current and consistent with the detailed files |
| `document-plan.md` | Inventory and maintenance guidance for this memory bank | Current |

## Maintenance Rules

- Update `current-status.md` whenever a blocker, test result, or priority changes.
- Update `tech-stack.md` whenever a manifest, Dockerfile, CI workflow, or runtime target changes.
- Keep `project-overview.md` grounded in source paths and observable product behavior.
- Keep `compact-context.md` concise and consistent with the detailed documents.
- Record dates for state snapshots; do not preserve superseded claims as current facts.
- Do not duplicate long implementation plans here; link to `docs/planning.md` and `docs/HANDOFF.md`.

## Related Repository Documents

- `docs/HANDOFF.md`: detailed engineering handoff
- `docs/CHANGELOG.md`: implementation history and validation notes
- `docs/operational-blockers.md`: Docker and operational investigations
- `docs/planning.md`: staged improvement plan
- `.agents/rules/`: repository development rules
- `memory-bank/agent-rule-compliance-assessment.md`: rule-by-rule compliance evidence

## Historical Context Retained

The initial audit established these historical facts:

- A previous Docker development target used `--reload` with a bind mount and entered a restart loop; the current Dockerfile removes that failure mode from the Compose target.
- The Python slim image lacked `curl`, which caused the first healthcheck attempt to fail; the base image now installs it.
- The frontend previously used a Docker-only proxy hostname, had a scaffold HTML title, mixed languages in an error message, and contained unused mock data. These were corrected.
- Repository-map corrections: `rechats` -> `recharts`; `FinanciaMovement` -> `FinancialMovement`.
- Earlier audit counts: backend tests 9 -> 16; mock data 57 -> 52.
- `frontend/public/favicon.svg` was confirmed present.

These historical details are retained here so future agents can understand why the current configuration exists without treating resolved issues as open work.
