# Review: `memory-bank/operational-blockers.md`

> Review by **Luna (gpt-6-luna)** — October 12, 2026
> Scope: post-migration validation of the operational-blockers ledger, its agent-management instructions, and cross-repo consistency.

## Verdict

**FAIL ⚠️** — Issue statuses are mostly consistent, but the ledger contains two incorrect file references, an inaccurate claim about frontend health, and stale active cross-references after the move.

## Findings

1. **🟡 Issue #3 points to the wrong file in the Summary Table** — History entry says the label derives via `computePeriodLabel(movements)` in `financial-utils.ts` (confirmed in `frontend/src/lib/financial-utils.ts` and `frontend/src/hooks/use-financial-data.ts`), but the Summary Table names `backend/app/routes.py`. **Correction:** change the table's File cell for #3 to `frontend/src/lib/financial-utils.ts` (optionally include the hook).
2. **🟡 Issue #9's Summary Table points to the wrong file** — History says the message changed in `use-financial-data.ts`; actual English string is in `frontend/src/hooks/use-financial-data.ts`, but the table names `frontend/src/App.tsx`. `.agents/rules/rule-18-single-natural-language.md` also describes the correction as an `App.tsx` message (its rationale correctly identifies the hook). **Correction:** use the hook path in the table and clarify the rule's supporting-reference wording.
3. **🔴 Active stale path remains in `backend/Dockerfile`** — Still says `See docs/operational-blockers.md (Issue #1).` The file moved (`R docs/operational-blockers.md -> memory-bank/operational-blockers.md`); old path no longer exists. **Correction:** change to `memory-bank/operational-blockers.md`.
4. **🟡 Issue #10 overstates what Compose health establishes** — Says "all services healthy individually", but only the **backend** has a healthcheck in `docker-compose.yml`; the frontend has none. **Suggested wording:** "The backend reports healthy via its `/health` check; the frontend responds locally, but Compose has no frontend healthcheck."
5. **🟡 Issue #10's underlying cause is presented too definitively; current state could not be reproduced** — "Root cause (diagnosed)" conflates the observed symptom with an unknown underlying cause (the firewall/DinD suspicion is appropriately labeled as suspicion). `docker compose ps --all` showed both containers exited 13 days ago, so timeouts/network properties could not be re-verified live. **Suggested replacement heading:** "Observed failure (diagnosed); underlying cause unknown." Date the diagnostics; keep hypotheses labeled.
6. **🟡 Issue #5's compatibility concern is real only as a narrow unverified runtime check; rationale is speculative** — `debugpy==1.8.22` package metadata explicitly lists Python 3.13 support, so the PEP 703/JIT rationale doesn't support the concern. CI verifies backend tests on 3.13 but not the Docker development-stage debugpy launch/attach path. **Recommendation:** retain "Unverified" only for that specific dev-container path; rewrite rationale around the concrete verification gap; do not suggest pinning 3.12 absent a demonstrated failure.
7. **🟡 Migration left another active broken reference; archived review notes still contain old paths** — `memory-bank/agent-rule-compliance-assessment.md` references `docs/CHANGELOG.md` (orphaned; docs/ contains only `milestone-deliverables-assessment.md`). `memory-bank/review-edits/document-plan--glm-proposed-edits.md` and `document-plan--luna-proposed-edits.md` contain stale `docs/operational-blockers.md` references (archived, but confusing). **Recommendation:** replace/remove the changelog reference; label archived review notes as historical snapshots.
8. **🟢 Cross-document blocker numbers and statuses otherwise align** — `current-status.md` (#10, paused), `compact-context.md` (#10), `project-overview.md` (bridge issue) agree; `.agents/rules/` refs to #1, #4, #8, #9 agree with fixed statuses. #10's 🔴 Critical severity + 🔶 Paused status are not contradictory.
9. **🟡 Agent-management instructions are useful but need clearer status/severity rules and a realistic validation requirement** — Item 1's "severity label" list includes `🔶 Paused` (a status, not a severity); Item 6 requires subagent review "exactly as done" without defining "significant" or handling dispatch-unavailable; Item 7 says link-not-duplicate but Historical Context repeats ledger fixes. **Suggested clarification:** separate severity vs status values, define the review trigger, permit recording dispatch-unavailable, and trim the duplicated history list.

## Recommendations

1. Correct Summary Table File cells: **#3 → `frontend/src/lib/financial-utils.ts`** (optionally the hook); **#9 → `frontend/src/hooks/use-financial-data.ts`**.
2. In `backend/Dockerfile`, replace stale comment ref with `memory-bank/operational-blockers.md`.
3. In the #10 entry, replace **"Root cause (diagnosed)"** with **"Observed failure (diagnosed); underlying cause unknown"**, and avoid claiming all services are healthy when only the backend has a Compose healthcheck.
4. Date/source the #10 networking observations; containers are stopped, so this confirms configuration/history, not a live reproduction.
5. Rewrite #5 around the unverified **development-container startup/attach test**, not broad Python 3.13 internals claims.
6. Fix or remove the absent `docs/CHANGELOG.md` reference in `agent-rule-compliance-assessment.md`; decide whether archived review refs should be updated or marked historical.
7. In `document-plan.md`, distinguish severity from status, make the subagent-review trigger actionable, and reduce duplication in the resolved-issue list.

## Bloated content

The "Historical Context" list in `memory-bank/document-plan.md` repeats resolved details already recorded in the ledger (#2, #4, #6, #7, #8). Can be shortened to a link, retaining only the distinct R13/no-`--reload` maintenance note.