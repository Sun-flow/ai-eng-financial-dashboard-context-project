# Memory Bank & Multi-Agent Repo Maintenance — Rules and Insights

> **Purpose**: A verbose reference of agent-oriented rules for maintaining a cutting-edge repository where **multiple AI agents operate independently** on a shared codebase and shared memory bank. These rules are generic and widely-applicable; they are meant to be farmed out to the layers that enforce them (project, workspace, user, repo/CI). Use alongside `docs/memory-bank-generator-prompt.md` (the single-file prompt) — this document is the "why and how-to" deep dive.
>
> **Sources**: synthesized from the Cline Memory Bank convention (`docs.cline.bot/best-practices/memory-bank`), the AGENTS.md open standard (`agents.md`, Agentic AI Foundation / Linux Foundation), PARÁ & Progressive Summarization (Forte Labs), Zettelkasten atomicity, Keep a Changelog 1.1.0, MADR/ADR (adr.github.io), markdownlint, MCP, and observed patterns in this repo's own multi-agent review workflow (`memory-bank/review-edits/`, `.agents/rules/`, subagent routing for cross-model validation).

---

## Part 1 — The Problem We Are Solving

An AI agent's memory resets every session. A repo with several independently operating agents multiplies the failure modes:

1. **Amnesia**: each agent re-discovers what the repo is at full token cost and with drift risk.
2. **Fabrication**: agents confidently assert counts, versions, and paths they did not verify.
3. **Inconsistency**: two agents write contradicting facts into separate docs, and nothing detects it.
4. **Staleness**: `current-status.md` says green while the code changed hours ago.
5. **Friction**: every session needs a human to re-explain the project, conventions, and blockers.

The memory bank + a set of agent behavioral rules solve these. The rest of this document is the full rule set, organized by the layer at which each rule lives, plus the automation loops that make the system maintain itself.

---

## Part 2 — Canonical Memory Bank Core

The invariable core (from the generator prompt; recap here for convenience):

- `project-overview.md` — what it is / isn't, scope, boundaries, key files, architecture.
- `tech-stack.md` — stack, pinned deps, tooling, CI, env vars, canonical commands (verified).
- `current-status.md` — works / gaps / blockers / next priorities (updated most often).
- `document-plan.md` — the hub/index + maintenance rules.
- `changelog.md` — Keep-a-Changelog history (`[Unreleased]` top; Added/Changed/Deprecated/Removed/Fixed/Security; ISO dates).
- Optional: `operational-blockers.md` (numbered ledger, never delete resolved), `system-patterns.md`, `decisions/NNNN-*.md` (ADRs), `glossary.md`, `archive/`.

Design principle from the sources: **files build on each other in a hierarchy** — project-overview shapes tech-stack, system-patterns, and current-status; all of them feed changelog and the operational ledger. Never flatten this hierarchy into one giant file.

---

## Part 3 — Rules by Layer

### 3.1 User-Level Rules (global agent preferences, apply to every repo)

> Stored in the user's global instructions / `.clinerules/` / chat prelude — not in any repo.

- **U1 · Read-before-act is default.** At the start of any task, read the repo's `AGENTS.md` and memory bank if present. Do not skip this even for "small" edits. (Cline: *"I MUST read ALL memory bank files at the start of EVERY task — this is not optional."*)
- **U2 · Verify before you claim.** Never state a number, version, path, or behavior you did not observe in the current repo state. Run the command, grep the file, read the manifest. Unverifiable → label ❓.
- **U3 · Never fabricate evidence.** If no evidence exists for a claim, say so. Fabricated `file:line` citations are the single most damaging failure mode; a strict global taboo.
- **U4 · Docs change in the same change as code.** If you modify behavior, update the affected memory-bank files in the same pass (docs-as-code). Do not leave "update docs later."
- **U5 · Finish clean.** No partial work labeled done. A task is done when tests pass, docs are synced, and the memory bank reflects reality.
- **U6 · Work in atomic, single-purpose steps.** Small commits with clear messages make review-by-other-agents cheap and conflict-free.
- **U7 · Mark uncertainty.** Use a status vocabulary consistently: ✅ verified / ❓ unverified / 🔶 paused / 🔴 broken. Never let a paused item quietly become assumed-fixed.
- **U8 · Prefer asking over guessing** when a human decision is genuinely required — but resolve everything you can from evidence first so you rarely need to.

### 3.2 Project-Level Rules (live in the repo: AGENTS.md + memory bank + tools)

> Stored in `AGENTS.md`, memory-bank maintenance rules, and `.agents/rules/`.

- **P1 · AGENTS.md is the front door.** Every repo has a root `AGENTS.md` that (a) explains the project in ≤ one paragraph, (b) points to `.agents/rules/`, `.agents/skills/`, and `memory-bank/`, (c) states the read-at-start mandate. If it doesn't exist, create it.
- **P2 · AGENTS.md is not README.** READMEs are for humans; AGENTS.md is for agents. Keep them separate and each concise. (agents.md standard.)
- **P3 · Nested AGENTS.md wins by proximity.** In a monorepo, place an `AGENTS.md` in each subproject/package; agents read the **nearest** one first, closest wins, explicit user prompts override everything. (OpenAI main repo ships 88.)
- **P4 · One source of truth per fact.** A fact lives in exactly one file; all other references link to it (single-source-of-truth; Keep-a-Changelog: *"it ought to be"*).
- **P5 · Hub file is load-bearing.** `document-plan.md` (or `INDEX.md`/MOC) is the map. An agent loads it first, then branches to what it needs. Refresh it whenever any bank file is added/removed.
- **P6 · Date every snapshot.** ISO-8601 dates in every file and entry, so freshness is observable at a glance. A file whose date is older than the most recent material change is itself a signal.
- **P7 · Flag stale, never silently delete.** Mark superseded claims `stale/superseded → see <new location>`; preserve history. (Adapted from PARA Archives & claude-code's 14-day stale lifecycle.)
- **P8 · Atomic files.** One topic/concern per file (Zettelkasten atomicity; ADR single-decision rule). If a file spans two concerns, split it and update the hub.
- **P9 · Compress for discoverability, keep context for understanding.** Executive summary at top; detail behind links (progressive summarization). A bank padded with prose fails just as hard as an empty one.
- **P10 · Agents' memory is separate from users' docs.** Never stuff agent-facing operational state into a human-facing README, and never pollute the memory bank with user-facing prose.
- **P11 · Write for the next amnesiac agent.** Every decision records its rationale, what was tried, what was rejected, and why current state exists. Future agents trust banks that explain *why*.
- **P12 · Record decisions as ADRs when significant.** Append-only `decisions/NNNN-title.md` (context, decision, alternatives, consequences). Supersede, never rewrite history.
- **P13 · Preserve an issue/blocker ledger with stable numbering.** `operational-blockers.md` uses global, never-reused issue numbers; resolved entries stay with a solution note; numbers referenced elsewhere must match (learned from this repo's #1–#10 ledger discipline).
- **P14 · Keep the bank lean.** If content would duplicate another file, link instead. On init and periodically, prune verified-dead content (like this repo's dead `user-event` / `hero.png` removal in R19).

### 3.3 Workspace-Level Rules (multi-repo / shared dev environment)

- **W1 · One memory-bank per repo, one AGENTS.md per repo.** Don't create a "global bank"; each repo's bank is authoritative for its own facts. Cross-repo facts are linked from each repo's bank (or `docs/`), never duplicated.
- **W2 · Shared conventions get frozen in a shared location.** Style/naming/commit templates that span repos live in the user-level rule set (3.1) or a shared `docs/` you point all repos at — not re-explained per repo.
- **W3 · Consistent command vocabulary.** Repos under the same workspace should expose analogous commands (`test`, `lint`, `build`, `dev`) so an agent's learned habits transfer safely. Document any deviation in tech-stack.md.
- **W4 · Identity per agent run.** When multiple agents act in a shared workspace, each run records its name/model + timestamp + scope in its outputs (review files, logs), so a later agent can attribute and trust.
- **W5 · Serialize writes to shared files.** The hub (`document-plan.md`) and any file many agents touch adopt a single-writer convention: an agent announces intent via branch/PR or updates-and-logs in one pass. No two agents edit the same memory-bank file in the same unsynchronized window.

### 3.4 Repo-Level Rules (enforced by CI, git hooks, and scripts)

- **R1 · CI enforces the bank's health.** Add a workflow (or extend existing) that runs on PR/push: markdownlint over `memory-bank/` + `docs/`, a **dangling-link checker**, and a **stale-date scanner** (any file whose most recent edit date ≫ its header date fails).
- **R2 · CI enforces rule-compliance evidence.** Every "all rules compliant" claim in the bank must be backed by a doc (like `agent-rule-compliance-assessment.md`) that maps rule → evidence `file:line`; a script can verify the referenced paths still exist.
- **R3 · Tests are the verification loop.** Tests gate merges, and the bank's quantitative claims should be checkable against test counts (route counts, test counts, coverage) so drift is detected by CI rather than by humans.
- **R4 · Lockfiles committed and CI-installed.** `requirements.lock` / `package-lock.json` committed; CI installs from them — so `tech-stack.md` versions stay externally auditable. (Matches this repo's R14.)
- **R5 · Commit conventions enforced by hooks.** Conventional-commit / PR-title linters wired into CI make changelog generation and per-agent attribution trivial.
- **R6 · Git hooks serialize the dirty path.** A pre-commit hook that ensures memory-bank files touched by a change are consistent (e.g., hub updated, dates bumped).
- **R7 · Docs-health gate on the README too.** `AGENTS.md` links must resolve; the human README must not carry stale operational claims (this repo's audit caught exactly this pattern: `docs/HANDOFF.md` saying "22 rules" while the repo had 23).

---

## Part 4 — Behavioral Rules for an Independently Operating Agent (the "self-discipline" layer)

These are the rules any single agent must internalize so the multi-agent system works even when nobody is watching:

- **D1 · Load, then act.** Read the bank (P1/P5) before writing a single line. The cost of re-reading is tiny; the cost of acting on stale context is not.
- **D2 · Cite like a reviewer.** When making a claim in any doc, annotate the evidence (`routes.py:12`, `package.json:17`). A claim without a citation is a debt.
- **D3 · Self-check before finishing.** Final checklist: did I run the tests/lint? does my change match the bank's description? did I update `current-status.md`, `changelog.md`, and the hub if relevant? did I bump dates?
- **D4 · No silent supersession.** If my change invalidates an existing documented claim, I do not just edit around it — I update or mark the old claim stale *and* note the change in the changelog.
- **D5 · Adversarial self-review.** Before submitting, read your own diff as if a hostile reviewer wrote it: does each claim hold against evidence? Is there uncommitted work flattering itself? (Name this "the critic pass".)
- **D6 · Separate writer from checker.** When a change is non-trivial, don't be your own only reviewer — invoke a subagent in the checker role on the diff (see 5.4 Review loops).
- **D7 · Treasure the ledger.** Blocker numbers are identity anchors. Never renumber, never delete resolved entries, never contradict the summary table's status column.
- **D8 · Prefer small + complete.** Ten small green changes beat one large half-green change, especially under parallel agents: smaller diffs = fewer collisions, easier review, cheaper re-verification.
- **D9 · When in doubt, do not assert.** Write ❓ + the specific verification that would convert it to ✅. Unverified ≠ false; it means "someone must confirm."
- **D10 · Anthropomorphize sparingly.** The bank is not a notebook to impress a human; it is a database for a future amnesiac copy of you. Optimize for machine-reproducible throughput, not prose.

---

## Part 5 — Automation Loops (Keep It Maintained With Minimal Prompting)

The goal: the repo stays healthy with near-zero routine prompting. Each loop below is a standing invitation — an agent, script, or CI job — that fires on a trigger rather than on demand.

### 5.1 · Session Start Bootstrap (agent-driven, zero prompt)
**Trigger**: any new session/task begins.
**Action**: agent reads `AGENTS.md` + `document-plan.md` + `project-overview.md` + `current-status.md`; if `current-status.md`'s date ≫ last git activity, run the status-reconciliation routine below.
**Owned by**: project rule P1/U1. This single loop eliminates re-explanation forever.

### 5.2 · End-of-Session Handoff (agent-driven, one-line prompt "follow your instructions")
**Trigger**: session ends / context window fills / task completes.
**Action**: agent performs the *handoff dance*:
1. Update `current-status.md` (works/gaps/next) and `changelog.md` (`[Unreleased]`).
2. Stamp dates.
3. Write a `memory-bank/review-edits/<scope>--<agent>-handoff.md` recap: what changed, what's unverified, what the next agent should do first.
4. Optionally compact a `compact-context.md` one-page resume for the next session.
**Effect**: the next session starts from a correct, dated snapshot; compaction stops losing knowledge (the human's context window and the agent's both survive).

### 5.3 · Status Reconciliation (triggered by 5.1)
**Trigger**: the bank is suspected stale (dates, or "run tests once more").
**Action**: agent runs the canonical test/lint commands, counts tests/routes/components fresh, reconciles `current-status.md` / `tech-stack.md` numbers, marks anything changed as stale → updated, and records the run in the changelog.
**Effect**: quantitative drift between docs and code is caught in minutes, not weeks.

### 5.4 · Multi-Agent Review Loop (the cross-validation pass)
**Trigger**: any significant memory-bank change; required at init and when closing a blocker.
**Action**: dispatch ≥2 reviewer subagents with **separate roles and (where available) different models**, e.g.:
- **Fact-checker** (e.g., deepseek-v4-flash): verify every claim in the bank against the live tree → `claim / evidence / verdict`.
- **Consistency-checker** (e.g., gpt-6-luna): cross-file numeric/claim agreement, dangling links, stale-date flags, stale/superseded correctness.
- **Critic** (optional, e.g., glm-5.3-flash): semantic — "does this bank let a fresh agent rebuild and run the project?"
Reviewers **propose, don't mutate**: findings go to `review-edits/` as severity-tagged proposed edits (🔴 / 🟡 / 🟢). A lead (or human) applies; loop re-runs until PASS ✅.
**Effect**: the bank is trustworthy *because* it's adversarial-checked — and the review trail (archived in `review-edits/`) proves it to future agents. This repo's `review-edits/` (deepseek/gpt/luna/glm per file) is the working example.

### 5.5 · CI Doc-Sanity Gate
**Trigger**: every PR/push.
**Action**: scripted checks — markdownlint; dangling-link checker over `memory-bank/`, `docs/`, `AGENTS.md`; stale-date scanner; evidence-path checker (verify cited paths exist).
**Effect**: rule violations can't silently ship; humans never babysit docs health.

### 5.6 · Rule-Compliance Audit Loop
**Trigger**: weekly (or after big refactors) — e.g., one agent run with prompt "re-audit `.agents/rules/` compliance".
**Action**: refresh `agent-rule-compliance-assessment.md`: rule → status → current application → evidence; flag new gaps; close docs for closed gaps; confirm CI-enforced subset matches reality.
**Effect**: the "23 rules compliant" style claim stays true and auditable (this repo's R1–R23 pattern).

### 5.7 · Changelog + ADR Sweep
**Trigger**: on release/version bump or on demand.
**Action**: promote `[Unreleased]` → a versioned section (SemVer), ensure every material change is captured, verify each ADR status, archive superseded decisions to `memory-bank/archive/`.
**Effect**: history stays append-only and human-readable without manual bookkeeping.

### 5.8 · Freshness & Bloat Audit
**Trigger**: monthly, or when the bank exceeds a size budget.
**Action**: scan for (a) files whose header date is stale, (b) duplicated facts across files, (c) orphaned files not in `document-plan.md`, (d) archived-worthy content, (e) bank-wide word/line budget overflow. Consolidate, link, archive, report.
**Effect**: the bank stays lean and machine-fast — the classic PARA "organize by actionability, never over-structure" and Zettelkasten "connect, don't collect".

### 5.9 · Agent Work Observability
**Trigger**: on every review/handoff artifact.
**Action**: name review/audit files `memory-bank/review-edits/<file>--<agent-or-model>-<kind>.md`; include agent/model, date, verdict, findings, applied/rejected. Keep one archived set.
**Effect**: any future agent can see *who* validated *what*, *when*, and *with which model* — provenance becomes part of the memory (this repo's exact convention).

---

## Part 6 — Cross-Validation with Multiple Agents: Concrete Protocol

For the highest-value practice (multi-agent checking), the precise protocol used to produce a trustworthy bank:

1. **Prepare**: the writer agent completes the bank/change and marks it "for review."
2. **Dispatch** (parallel): fact-checker + consistency-checker (+ optional critic), each with an explicit scope, the file list to review, and the prompt: *"Do NOT edit files. Return findings as severity-tagged proposals with file:line evidence. Verdict: PASS/FAIL."*
3. **Collect** into `review-edits/`; merge/dedupe findings.
4. **Apply**: the lead agent applies 🔴 + agreed 🟡; 🟢 batched or deferred; each application notes "applied per <agent> review".
5. **Re-verify**: re-run the pass on the merged result until PASS; log final verdicts.
6. **Archive**: keep the review set; the newest PASS verdicts are the authority.

**Model diversity matters.** Different models catch different error classes (this repo routes by model: deepseek for bulk/code, gpt for reasoning/facts, glm for agentic/tooling, per `subagent-routing` rule R23). Use the same diversity for reviews. Where only one model exists, still run two role-separated passes (writer ≠ checker) — role separation alone catches most fabrication.

**Rules for reviewers** (equal weight with writer rules):
- Reviewers never mutate canonical files.
- Every finding is severity-tagged and evidence-cited.
- A finding that says "no problem" must still be evidence-backed (it's a verification, not an opinion).

---

## Part 7 — The Rules Index (quick lookup)

| ID | Rule (short) | Layer |
|---|---|---|
| U1 | Read before act | User |
| U2 | Verify before claim | User |
| U3 | Never fabricate evidence | User |
| U4 | Docs change with code | User |
| U5 | Finish clean | User |
| U6 | Atomic single-purpose steps | User |
| U7 | Mark uncertainty (✅/❓/🔶/🔴) | User |
| U8 | Ask only when evidence runs out | User |
| P1–P14 | Front door AGENTS.md … lean bank | Project |
| W1–W5 | Per-repo banks … serialize shared writes | Workspace |
| R1–R7 | CI docs-sanity … hooks | Repo/CI |
| D1–D10 | Load-then-act … machine-first bank | Self-discipline |

Automation loops: **5.1** session bootstrap · **5.2** end-of-session handoff · **5.3** status reconciliation · **5.4** multi-agent review · **5.5** CI doc-sanity · **5.6** rule-compliance audit · **5.7** changelog/ADR sweep · **5.8** freshness & bloat audit · **5.9** work observability.

---

## Part 8 — Anti-Patterns to Forbid Explicitly

- ❌ **Fabricated citations** (U3) — the unforgivable sin; review loops tag 🔴.
- ❌ **One mega-file bank** — kills discoverability; atomicity (P8) forbids it.
- ❌ **Silent deletion of superseded facts** (P7) — erases *why*, which future agents need.
- ❌ **Duplicate facts with drift** (P4) — the exact inconsistency the consistency-checker hunts.
- ❌ **Unscheduled "always update" fetish** — infinite bank maintenance with zero signal; update on triggers (P1/P4 in generator prompt), not every micro-edit.
- ❌ **Agents editing the same shared file concurrently** (W5) — the collision that corrupts the hub.
- ❌ **Treating unverified as false** — the bank is honest about *unknowns*; ❓ is a first-class status.
- ❌ **Human-facing README absorbing operational claims** (P10) — breaks the AGENTS/README separation.

---

## Appendix — How This Repo Already Embodies the Rules

Where the generic rules originated or are already demonstrated in this workspace (all references are real):

| Rule | Evidence in this repo |
|---|---|
| Front door AGENTS.md (P1) | Root `AGENTS.md` points to `.agents/rules/`, `.agents/skills/`, `memory-bank/` |
| Hub file (P5) | `memory-bank/document-plan.md` — inventory, maintenance rules, blocker instructions |
| Stable blocker ledger (P13) | `memory-bank/operational-blockers.md` — issues #1–#10, never-reused numbering, ✅/❓/🔶 states |
| Multi-agent review loop (5.4) | `memory-bank/review-edits/` — per-file, per-model reviews (deepseek, gpt/luna, glm) with PASS/FAIL verdicts |
| Evidence-only bank (D2) | `agent-rule-compliance-assessment.md` maps rules → `file:line`; `milestone-deliverables-assessment.md` verifies claims against real code |
| Compact resume (5.2) | `memory-bank/compact-context.md` — one-page orientation resume |
| Consistency audit (5.5–5.6) | `review-edits/cross-file-consistency--audit.md` — found & documented I1–I5 inconsistencies |
| Rule-compliance audit (5.6) | `agent-rule-compliance-assessment.md` per-rule evidence + CI-enforcement mapping |
| Changelog (5.7) | Keep-a-Changelog-style history; superseded `docs/HANDOFF.md` consolidated into `memory-bank/` |

This is the reference implementation the two deliverables codify. Copy the pattern, not the specifics: the rule set above is generic and transferable to any repo or workspace with independently operating agents.