# Memory Bank Generator Prompt

> **What this is**: A single, self-contained prompt that an AI coding agent can read as its **first instruction** in any repository, then generate and maintain a durable "memory bank" for that repo. Instantiate it at your repo root (e.g., as `AGENTS.md`, `.clinerules/memory-bank.md`, or a `docs/` file referenced from `AGENTS.md`). It is generic by design — adapt names to your stack, keep the rules.
>
> **Why**: An agent's memory resets between sessions. A memory bank is a folder of plain-text Markdown files that are the agent's only link to earlier work. If they are accurate, evidence-based, and consistent, every future session — and every independently-running agent — starts from a correct picture of the repo.

---

## Your Mandate

Your memory resets completely between sessions. This is not a limitation; it is why you maintain a memory bank. After every reset you rely **entirely** on these files to understand the project and continue work. Therefore:

1. **At the start of every task or session, READ every file in `memory-bank/` plus the root `AGENTS.md`.** This is mandatory, not optional.
2. **Every claim you write must be verified against the actual repository** (files, manifests, tests, git history). Cite `path/to/file:line` evidence. Never fabricate or guess.
3. **Keep the bank lean, current, and consistent.** One fact lives in exactly one place; other files link to it. Superfluous or duplicated content is a bug.

---

## Core File Set (create all of these on init)

Create a `memory-bank/` directory at the repo root. If an equivalent file already exists elsewhere (e.g., `docs/`), migrate or symlink it rather than duplicating.

| File | Purpose | Update cadence |
|---|---|---|
| `memory-bank/project-overview.md` | What this project **is** and what it **isn't**: goals, problems solved, scope, explicit boundaries/non-goals, definition of done, key files with one-line descriptions, high-level architecture and data flow. | On scope/direction change |
| `memory-bank/tech-stack.md` | Languages, frameworks, pinned dependencies, tooling, CI, configuration (env vars), and canonical build/test/run commands — **all verified against manifests** (`package.json`, `requirements.txt`, Dockerfiles, workflows). | When a manifest/CI/config changes |
| `memory-bank/current-status.md` | What works, known gaps/blockers, warnings, and next priorities. The most frequently updated state ledger. | After every working session |
| `memory-bank/document-plan.md` | The **index/hub file**: inventory of every memory-bank and docs file with one-line purpose, plus these maintenance rules. Update whenever a file is added/removed. | On any file change in the bank |
| `memory-bank/changelog.md` | Human-readable change history in Keep-a-Changelog format: latest version first, `[Unreleased]` at top, sections **Added / Changed / Deprecated / Removed / Fixed / Security**, ISO-8601 dates. | On every material change |

## Recommended Optional Files (create only when relevant)

| File | When to create |
|---|---|
| `memory-bank/operational-blockers.md` | Whenever something blocks, degrades, or risks the project's operation (broken commands, networking, dependency/runtime incompatibilities). A numbered ledger with severity (🔴/🟠/🟡/🟢/🔶), symptom, root cause, what was tried, and status (✅ FIXED / ❓ Unverified / 🔶 Paused). Never delete resolved entries — preserve history with a solution note. |
| `memory-bank/conventions.md` | When the project has meaningful architecture, patterns, or conventions worth preserving (component boundaries, module conventions, naming rules, invariants). |
| `memory-bank/decisions/NNNN-title.md` | When a significant architectural or engineering decision is made. Append-only ADR: context, decision, alternatives, consequences. |
| `memory-bank/glossary.md` | When project-specific terms/abbreviations need consistent definition across sessions. |
| `memory-bank/archive/` | When content is superseded. **Archive, don't delete** — a one-line "moved to archive, superseded by X" note preserves provenance. |

---

## Init Workflow (when instructed to "initialize the memory bank")

1. **Inventory the repo**: directory tree, all manifests (package.json, requirements, Cargo.toml, etc.), lockfiles, Dockerfiles, CI workflows, existing docs, test layout, `.git` history for recent intent.
2. **Create** `memory-bank/` and the core files above.
3. **Fill each file strictly from evidence**:
   - Count routes/tests/components from the actual files — run `grep`/tests rather than inferring.
   - Pin versions/locations exactly as they appear in manifests.
   - State commands exactly as they run (`cd backend && python -m pytest -q`).
   - For anything you cannot verify, write it as **❓ Unverified** rather than omitting or asserting it.
4. **Record the date** (ISO-8601, e.g., `2026-10-12`) in every file.
5. **Wire the entry point**: make the root `AGENTS.md` point to `memory-bank/` (read-at-start mandate), `.agents/rules/` (if present), and `.agents/skills/` (if present), mirroring the repo's conventions.
6. **Run the cross-validation pass** (below) before declaring the bank initialized.

---

## Cross-Validating Generated Files with Multiple Agents

A memory bank written by one agent is only trustworthy after independent review. Whenever you initialize or significantly change the bank, run a **validation pass** with at least **two independent reviewer agents** (use `task(...)` subagents; different roles/models are strongly preferred where available):

1. **Fact-checker** — verifies every quantitative claim in the core files against the live repo:
   - Route/test/component counts, dependency versions, file paths, command strings, env var defaults, commit SHAs.
   - Verdict format: **PASS ✅ / FAIL ⚠️** + a table of `claim → file:line evidence → verdict`.
2. **Consistency-checker** — checks cross-file agreement and freshness:
   - The same number/claim (e.g., "23 rules", "blocker #10") appears identically in every file that mentions it.
   - No file references a path or file that no longer exists (dangling links).
   - No superseded claim is presented as current fact; dates are present and plausible.
   - Verdict format: **PASS ✅ / FAIL ⚠️** + per-inconsistency findings with exact file:line locations.

Protocol rules for the pass:

- **Reviewers propose, they do not mutate.** Each reviewer writes its findings to `memory-bank/review-edits/<file>--<agent>-review.md` as *proposed edits* (never editing the canonical file directly). A lead agent (or human) resolves and applies them.
- **Severity-tag every finding**: 🔴 blocking (fabrication, contradiction, dangling reference), 🟡 should-fix (stale, ambiguous), 🟢 nit (style/clarity).
- **Re-run until green**: after applying fixes, repeat the pass until both reviewers return PASS; log the final verdict in the review file.
- **Keep one archived review set** so future agents see that validation happened and how.

---

## Maintenance Rules (live by these)

1. **Read-all-at-start**: read every memory-bank file before doing any work in the repo. Never skip it, even for "trivial" tasks.
2. **Update on triggers, not schedule**: update the bank after (a) discovering new project patterns, (b) implementing significant changes, (c) a blocker/status change, (d) direction changes, (e) the user says "update memory bank" (then **review and reconcile ALL files**, not just the diff).
3. **Single source of truth**: each fact lives in exactly one file; the rest **link**, never duplicate. If two files must both mention a number, keep the canonical value in one place and reference it.
4. **Evidence-only**: every substantive claim traces to a real file, manifest, or command output. If you can't verify it, mark it ❓ and say what confirming check is needed.
5. **Date everything**: ISO-8601 date on every entry/snapshot. When a claim is superseded, mark it **stale/superseded** (do not silently delete) and link to the replacement.
6. **Compress for discoverability**: one-line executive summary at the top of each file; detail behind links. If a file would exceed roughly the size of a screen, split it and link.
7. **One topic per file** (atomicity): if a file straddles two concerns, split it and update `document-plan.md`.
8. **Keep it lint-able**: valid cross-file links, canonical heading structure, no trailing duplicate headings — the bank should pass markdownlint (`MD051` link fragments, `MD043` heading templates).
9. **Archive, don't delete**: retirement = move to `archive/` with a one-line note; never destroy history.
10. **Agent-facing vs human-facing separation**: memory bank files are for agents; keep them out of the human README, and keep the agents' operational noise out of the human docs.
11. **Write for the next amnesiac session**: every decision carries its rationale (the *why*), not just its outcome. State what was tried and rejected, and why the current state exists.
12. **Ten-second orientation**: a fresh agent must be able to load `document-plan.md` → `project-overview.md` → `current-status.md` → `changelog.md` and know what the repo is, what works, what's broken, and what to do next — within seconds.

---

## Definition of Done for "initialize memory bank"

- [ ] Core files exist, dated, and evidence-based (no fabricated facts; unverifiable items marked ❓).
- [ ] `document-plan.md` inventory matches the actual files on disk.
- [ ] `AGENTS.md` points at `memory-bank/`.
- [ ] Cross-validation pass ran with ≥2 independent reviewers; verdicts on file; all 🔴 findings resolved, 🟡/🟢 triaged.
- [ ] No duplicates: each fact appears in exactly one file (others link).
- [ ] A fresh read of the bank yields the "ten-second orientation" above.