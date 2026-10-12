# Memory Bank Document Plan

## Required Documents

| File | Purpose | Current coverage |
|---|---|---|
| `project-overview.md` | Product purpose, verified surface, boundaries, evidence sources | Complete |
| `tech-stack.md` | Languages, frameworks, dependencies, infrastructure, tooling, configuration | Complete |
| `current-status.md` | Working behavior, blockers, warnings, product gaps, next priorities, checks | Complete |
| `compact-context.md` | Short resume point for future agents | Current and consistent with the detailed files |
| `document-plan.md` | Inventory and maintenance guidance for this memory bank | Current |
| `operational-blockers.md` | Issue ledger: open blockers, unverified items, and resolved history; agent management instructions | Complete |
| `agent-rule-compliance-assessment.md` | Rule-by-rule compliance evidence against `.agents/rules/` | Complete |

## Related Repository Documents — `docs/`

Working directory for temporary agent scratch, research aggregation, transient analysis (plans, summaries, comparisons), reports, etc. Ingest relevant long-term info into `memory-bank/` during handoff; stable content belongs in `memory-bank/` and `.agents/rules/`.

### Currently Active Files

| File | Purpose | Status |
|---|---|---|
| `docs/milestone-deliverables-assessment.md` | Deliverable verification report (milestone conclusion) | ✅ Active |

## Maintenance Rules

- Update `current-status.md` whenever a blocker, test result, or priority changes.
- Update `tech-stack.md` whenever a manifest, Dockerfile, CI workflow, or runtime target changes.
- Keep `project-overview.md` grounded in source paths and observable product behavior.
- Keep `compact-context.md` concise and consistent with the detailed documents.
- Record dates for state snapshots; do not preserve superseded claims as current facts.
- **Keep `docs/` lean**: agents will build plans/implemnentation proposals/research/reports here for their own temporary usage — ingest long-term (memory-bank) relevant findings into `memory-bank/` during handoff, then clean up.
- Refresh this inventory whenever a `docs/` or `memory-bank/` file is added or removed.
- On each major session start, verify that the file listings above match the actual filesystem.

## Operational Blockers — Agent Management Instructions

`memory-bank/operational-blockers.md` is the **single source of truth** ledger for anything that prevents, degrades, or risked preventing proper operation of the project (Docker networking, dependency/runtime compatibility, proxy/config issues, broken workflows). It is a memory-bank document, **not** a `docs/` scratch file — agents must treat its lifecycle like the other memory-bank files.

When working with `memory-bank/operational-blockers.md`, agents **must**:

1. **Register new blockers** — When you discover a new operational problem (e.g. a command fails, a service won't start, a dependency mismatch, an environment incompatibility), add it to the ledger with: a unique issue number (continue the existing sequence), severity label (🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low / 🔶 Paused), the file or component involved, a precise symptom, root cause if diagnosed, what was tried, and current status. Do **not** bury blockers only in session chat or scratch docs.
2. **Update status truthfully** — Move an item to **✅ FIXED** only when the fix is actually implemented and verified in the repo; mark **❓ Unverified** while a compatibility/risk remains unconfirmed; mark **🔶 PAUSED** when work is deferred by explicit direction (do not re-pursue a paused item without new direction).
3. **Keep resolved history accurate** — Leave fixed issues in the ledger (never delete them) so future agents understand *why* current config exists, but ensure the "Summary Table" status column reflects reality and the fixed item has a concise solution note.
4. **Cross-reference in related docs** — When you add/update/close a blocker, update the correlated claims in `memory-bank/current-status.md`, `memory-bank/compact-context.md`, and `memory-bank/project-overview.md` (and any `.agents/rules/` supporting references) in the same pass. The blocker number in all files must match the ledger.
5. **Follow the issue-numbering convention** — Blocker numbers are global and never reused. New issues take the next number. Do not renumber or reorder existing entries (the summary table and rule references depend on stable numbers).
6. **Run the multi-agent validation pass** — Before finalizing a significant change to this ledger (new blocker, status flip, or restructuring), dispatch the standard review subagents (per `.agents/rules/rule-23-subagent-model-selection.md` full 4Geeks model paths) to review `memory-bank/operational-blockers.md` and confirm consistency across the repo, exactly as done for the other memory-bank files (see `memory-bank/review-edits/`).
7. **Keep it lean and evidence-based** — Each blocker should contain only verified facts (commands run, observed outputs, file/line references). Do not add speculation without labeling it as such; do not duplicate content that already lives in `current-status.md` or the rule files (link instead).

## Historical Context

Resolved issues are preserved in `memory-bank/operational-blockers.md` (Issues #2, #4, #6, #7, #8 — proxy target, curl in base stage, favicon, title, dead-code removal).

**R13 (no `--reload`)** is an intentional deviation, now documented in both the rule (`rule-13-dev-prod-image-separation.md`) and `memory-bank/operational-blockers.md` (Issue #1). Development omits `--reload` to avoid the Docker bind-mount restart loop. Assessment updated to Compliant.
