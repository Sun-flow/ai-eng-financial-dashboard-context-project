# Memory Bank Document Plan

## Required Documents

| File | Purpose | Current coverage |
|---|---|---|
| `project-overview.md` | Product purpose, verified surface, boundaries, evidence sources | Complete |
| `tech-stack.md` | Languages, frameworks, dependencies, infrastructure, tooling, configuration | Complete |
| `current-status.md` | Working behavior, blockers, warnings, product gaps, next priorities, checks | Complete |
| `compact-context.md` | Short resume point for future agents | Current and consistent with the detailed files |
| `document-plan.md` | Inventory and maintenance guidance for this memory bank | Current |
| `agent-rule-compliance-assessment.md` | Rule-by-rule compliance evidence against `.agents/rules/` | Complete |

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

## Historical Context

Resolved issues preserved to explain current config (see `docs/operational-blockers.md` for details):
- **#2** — Proxy target changed from Docker-only `backend:8000` to env-configurable defaulting to `localhost:8000`
- **#4** — `python:3.13-slim` lacked curl for healthchecks; added to base stage
- **#6** — Missing favicon added to `frontend/public/`
- **#7** — Generic `<title>frontend</title>` changed to "Financial Dashboard"
- **#8** — Unused `mock-data.ts` deleted

**R13 (no `--reload`)** is an intentional deviation, now documented in both the rule (`rule-13-dev-prod-image-separation.md`) and `docs/operational-blockers.md` (Issue #1). Development omits `--reload` to avoid the Docker bind-mount restart loop. Assessment updated to Compliant.
