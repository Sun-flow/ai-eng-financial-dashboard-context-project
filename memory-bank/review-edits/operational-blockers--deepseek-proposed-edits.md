# Review: `memory-bank/operational-blockers.md`

> Review by **DeepSeek (deepseek-v4-flash)** — October 12, 2026
> Scope: post-migration validation of the operational-blockers ledger, its agent-management instructions, and cross-repo consistency.

## Verdict

**⚠️ FAIL (minor)** — All ten blocker claims verified substantially accurate and no live `.md` references point to the old path, but the migration is **incomplete on one live file** (`backend/Dockerfile` still points at the deleted `docs/operational-blockers.md`), the **Summary Table contradicts the prose on Issue #9's file**, and `frontend/.env.example` does **not** document `VITE_API_PROXY_TARGET`. All are small, precisely-scoped fixes; no content is fabricated.

## Findings

### 🔴 F1 — Live dangling reference to the old path in `backend/Dockerfile`
`backend/Dockerfile:23-25` comment reads `See docs/operational-blockers.md (Issue #1).` Terminal sweep confirms this is the **only** remaining live reference, and `docs/operational-blockers.md` no longer exists. This comment sits directly above the dev CMD — risks future agents trusting an archived path.

### 🟡 F2 — Summary-Table vs prose contradiction: Issue #9 file attribution
Prose (#9): "Error message in `use-financial-data.ts`" — confirmed at `frontend/src/hooks/use-financial-data.ts:36` (`setError("Could not load financial data. Check the backend API.")`). **Summary Table row #9** says `frontend/src/App.tsx`, which only *renders* `{error}` (line 24). `.agents/rules/rule-18-single-natural-language.md` also references `App.tsx` — three documents disagree; the hook is the true location.

### 🟡 F3 — `frontend/.env.example` does not document `VITE_API_PROXY_TARGET`
`frontend/vite.config.ts:9` default `"http://localhost:8000"` and compose override `http://backend:8000` are correct, but `.env.example` contains **only** `VITE_API_BASE_URL`. Future agents reading `.env.example` won't discover the proxy override documented in Issue #2.

### 🟡 F4 — Dangling `docs/CHANGELOG.md` references surfaced during the migration sweep
- `memory-bank/agent-rule-compliance-assessment.md:63`: "details: `docs/CHANGELOG.md`, `memory-bank/operational-blockers.md`"
- `docs/milestone-deliverables-assessment.md:131`: "`docs/CHANGELOG.md` — Implementation history…"
`docs/CHANGELOG.md` **does not exist** (docs/ contains only `milestone-deliverables-assessment.md`). Outside the letter of the task scope but a consistency defect adjacent to the blocker migration.

### 🟢 F5 — Issue #3 prose describes only the frontend half of the fix
`backend/app/routes.py` confirms the backend-side `_year_for_month` derivation; the prose fix mentions **only** `computePeriodLabel`. The Table's File column (`backend/app/routes.py`) is reconcilable, but prose would be more precise citing `_year_for_month`. No contradiction; minor completeness note.

### 🟢 F6 — Agent-instruction rule 4 vs `project-overview.md` numbering
Rule 4 says "The blocker number in all files must match the ledger." `project-overview.md:11` discusses bridge networking **without any `#10` number**. Not a violation (no wrong number claimed), but of the three topological files the rule names, only `current-status.md` and `compact-context.md` actually carry the `#10` label.

## ✅ Verified claims (all passed)

| Item | Verification result |
|---|---|
| **#1** `--reload` removed | ✅ dev CMD has no `--reload`; base CMD clean |
| **#2** `VITE_API_PROXY_TARGET` default | ✅ vite.config.ts default; compose override |
| **#3** Dynamic year | ✅ `_year_for_month` via `date.today()`; `computePeriodLabel` dynamic |
| **#4** Healthcheck + `service_healthy` | ✅ compose backend `curl --fail`; `depends_on: service_healthy`; `/health` route exists; `curl` in base stage |
| **#5** debugpy + 3.13 | ✅ `python:3.13-slim` + `debugpy==1.8.22`; doc honestly labels ❓ Unverified |
| **#6** favicon | ✅ `frontend/public/favicon.svg` exists; linked in `index.html` |
| **#7** title | ✅ `<title>Financial Dashboard</title>` |
| **#8** mock-data.ts dead | ✅ file absent; no imports |
| **#9** English error string | ✅ hook sets English string |
| **#10** PAUSED | ✅ consistent across README, README.es.md, current-status, compact-context, project-overview, assessment; not re-verifiable live (environmental) — correctly labeled |

**Reference migration (`.md` files):** All live markdown references now target `memory-bank/operational-blockers.md` — README.md:45, README.es.md:45, rule-12/13/18/19, compact-context, current-status, document-plan, agent-rule-compliance-assessment, milestone-deliverables-assessment. Only `review-edits/` matches are historical archives (excluded).

**Agent management instructions (document-plan.md):** All seven numbered rules are concrete, mutually non-conflicting, and implementable. Rule 6's reference to rule-23 "full 4Geeks model paths" is verified real. Rule 5 (global, never-reused numbering) matches the actual `#1–#10` ledger.

## Recommendations (exact actionable edits)

1. **🔴 F1** — `backend/Dockerfile:25`: `See docs/operational-blockers.md (Issue #1).` → `See memory-bank/operational-blockers.md (Issue #1).`
2. **🟡 F2** — Summary Table row #9: File `frontend/src/App.tsx` → `frontend/src/hooks/use-financial-data.ts`. (Optionally correct rule-18's "in `App.tsx`" wording to the hook.)
3. **🟡 F3** — Add to `frontend/.env.example`:
   ```bash
   # Optional override for the Vite dev proxy backend target (used when the
   # backend is not reachable at the default http://localhost:8000).
   VITE_API_PROXY_TARGET=http://localhost:8000
   ```
4. **🟡 F4** — Either restore `docs/CHANGELOG.md` or update the two dangling references (`agent-rule-compliance-assessment.md:63`, `milestone-deliverables-assessment.md:131`).
5. **🟢 F5** — (Optional) Add one clause to Issue #3 prose noting `_year_for_month` in `routes.py` plus `computePeriodLabel`, so prose matches the table.
6. **🟢 F6** — Either add `(#10)`-style numbering to `project-overview.md:11` or soften rule 4 to "where a number is cited, it must match the ledger."

## Bloated content note

**Not bloated.** The file is appropriately lean — the #10 diagnostic trace (commands tried, verified IPs 172.18.0.2/172.18.0.3, both-direction timeouts) is exactly the evidence-driven detail the ledger should carry, and the summary-table/prose duplication is intentional redundancy. No dead or superseded claims; `Last updated: October 1, 2026` predates the migration but content isn't stale. No removal needed.