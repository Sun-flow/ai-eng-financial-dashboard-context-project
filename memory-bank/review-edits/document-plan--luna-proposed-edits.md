# Review: `memory-bank/document-plan.md`

## Verdict: FAIL — edits recommended

The required memory-bank and related repository paths exist, and the coverage/maintenance sections are mostly accurate. The main defect is in Historical Context: it treats an outstanding rule deviation as resolved and mixes sourced fixes with unsupported claims.

## Findings and specific recommendations

1. **R13 is misclassified as resolved.** `agent-rule-compliance-assessment.md` marks R13 Partial, explaining that development omits `--reload` to avoid the bind-mount restart loop; `current-status.md` also lists R13 among six remaining rule gaps. The workaround avoids the loop, but the rule deviation remains. **Recommendation:** remove R13 from the resolved list or explicitly identify it as an outstanding intentional deviation, linking to the assessment/current status.

2. **Historical entries need better sourcing and precision.** `docs/operational-blockers.md` documents the missing-curl fix (#4), proxy target (#2), favicon (#6), generic HTML title (#7), and unused `mock-data.ts` removal (#8). Current configuration has a localhost proxy default and a Compose `backend` target. The `rechats`/`FinanciaMovement` typo claims were not corroborated in inspected docs or source. **Recommendation:** replace “Docker-only proxy hostname” with the documented before/after behavior; cite supported fixes by blocker number; remove the typo claims unless a source or commit reference can be supplied.

3. **The Historical Context list is compressed and mixes categories.** Its one sentence combines configuration fixes, cleanup/cosmetic changes, an outstanding deviation, and unsourced claims. **Recommendation:** retain only a few sourced items that explain current configuration or useful cleanup; separate unresolved deviations from resolved fixes and link to authoritative records.

4. **“Complete” has no defined criterion.** All six listed files exist, and their stated coverage matches their apparent roles. `compact-context.md` is broadly consistent with the detailed status and assessment (updated October 1, 2026). **Recommendation (minor):** define Complete (for example, required topics are covered and verified against repository evidence), or document consistent statuses such as Complete / Current / Needs review.

5. **Related paths and maintenance rules pass.** `docs/HANDOFF.md`, `docs/CHANGELOG.md`, `docs/operational-blockers.md`, `docs/planning.md`, and `.agents/rules/` all exist. The maintenance rules sensibly cover status changes, stack/config changes, evidence-based overview, compact-context synchronization, dated snapshots, and linking rather than duplicating long plans. No mandatory edit is needed here.

## Suggested replacement for Historical Context

> Keep historical context limited to sourced fixes that explain current configuration or useful cleanup. For example, blockers #2 and #4 in `docs/operational-blockers.md` document the proxy target and curl healthcheck dependency; blockers #6–#8 record the favicon, page-title, and dead mock-data fixes. R13 is an outstanding intentional deviation, not a resolved item: development omits `--reload` to avoid the bind-mount restart loop (see `memory-bank/agent-rule-compliance-assessment.md` and `current-status.md`). Remove the `rechats`/`FinanciaMovement` typo claims unless reliable evidence is added.

## Bloated content

The seven-item Historical Context sentence is too compressed: it conflates resolutions, an outstanding deviation, and unsupported typo claims without references. Replace it with a short sourced note as suggested above, or remove it if that history is not useful. No other section appears bloated.
