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

## Related Repository Documents — `docs/`

| File | Purpose | Status |
|---|---|---|
| `docs/project-map.md` | Full repository structure, architecture overview, and component map | ✅ Complete |
| `docs/CHANGELOG.md` | Implementation history, validation notes, and deferred issues | ✅ Complete |
| `docs/HANDOFF.md` | Detailed engineering handoff for the next engineer | ✅ Complete |
| `docs/conventions.md` | Established patterns, conventions, and anti-patterns in the codebase | ✅ Complete |
| `docs/development-rules.md` | Axiom-like development rules grounded in repo facts | ✅ Complete |
| `docs/health-assessment.md` | Manual audit of all files — imports, references, connections, dependencies | ✅ Complete |
| `docs/planning.md` | Staged improvement plan with completion status per task | ✅ Complete |
| `docs/operational-blockers.md` | Docker and operational issues, with priority markings | ✅ Complete |

## Maintenance Rules

- Update `current-status.md` whenever a blocker, test result, or priority changes.
- Update `tech-stack.md` whenever a manifest, Dockerfile, CI workflow, or runtime target changes.
- Keep `project-overview.md` grounded in source paths and observable product behavior.
- Keep `compact-context.md` concise and consistent with the detailed documents.
- Record dates for state snapshots; do not preserve superseded claims as current facts.
- Do not duplicate long implementation plans here; link to `docs/planning.md` and `docs/HANDOFF.md`.
- Refresh this inventory whenever a `docs/` or `memory-bank/` file is added or removed.
- On each major session start, verify that the file listings above match the actual filesystem.

## Historical Context

Resolved issues preserved to explain current config (see `docs/operational-blockers.md` for details):
- **#2** — Proxy target changed from Docker-only `backend:8000` to env-configurable defaulting to `localhost:8000`
- **#4** — `python:3.13-slim` lacked curl for healthchecks; added to base stage
- **#6** — Missing favicon added to `frontend/public/`
- **#7** — Generic `<title>frontend</title>` changed to "Financial Dashboard"
- **#8** — Unused `mock-data.ts` deleted

**R13 (no `--reload`)** is an intentional deviation, now documented in both the rule (`rule-13-dev-prod-image-separation.md`) and `docs/operational-blockers.md` (Issue #1). Development omits `--reload` to avoid the Docker bind-mount restart loop. Assessment updated to Compliant.
