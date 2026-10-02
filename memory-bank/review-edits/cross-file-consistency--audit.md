# Cross-File Consistency Audit — Memory Bank

## Inconsistencies Found

### 🔴 I1: `document-plan.md` misclassifies R13 as resolved
- **document-plan.md** Historical Context: "`--reload` bind-mount restart loop (R13 gap)" — listed among other "resolved issues preserved to explain current config"
- **current-status.md**: R13 is listed as an **open gap** (🔶)
- **agent-rule-compliance-assessment.md**: R13 marked **Partial** — "intentional deviation"
- **Verification**: R13 is indeed an intentional deviation still open. The document-plan treats it as a resolved issue, which is misleading.
- **Fix**: Move R13 out of the resolved list and note it separately as an intentional deviation with a link to the assessment.

### 🟡 I2: `current-status.md` Next Priorities omit 2 of 6 gaps
- **current-status.md** lists 6 gaps (R1, R8, R13, R16, R17, R19) in the table
- But "Next Priorities" only mentions R1, R8, R16, R17 — **R13 and R19 are missing** from the priorities
- **Fix**: Either add R13 and R19 to the priority list, or note them as intentionally deferred.

### 🟡 I3: "8 CI-enforced" claim is stale/orphaned
- **agent-rule-compliance-assessment.md** says "8 CI-enforced" in the summary
- The old table listing which 8 (R1, R3, R14, R15, R16, R17, R19, R22) was removed during trimming
- R1 (unused deps) is not checked by CI. R22 (.dockerignore) is not used in CI. Real CI-enforced rules are closer to 6.
- **Fix**: Either remove the orphaned "8 CI-enforced" count, or re-add a table/list explaining which rules are CI-enforced.

### 🟢 I4: `docs/HANDOFF.md` says "22 rules" (stale)
- HANDOFF.md lines ~45 and ~159 still reference "22 rules"
- `.agents/rules/` now contains 23 rules (R23 was added)
- **Fix**: Update HANDOFF.md to say "23 rules" — but this is outside memory-bank scope.

### 🟢 I5: agent-rule-compliance-assessment.md refers to "unused user-event was removed"
- `user-event` package no longer exists in `package.json` (verified)
- The reference is accurate about history, but future readers may not know what it was
- **Fix**: No change needed unless also updating other docs — minor clarity note.

## Verified Consistent Claims

| Claim | Files that agree |
|-------|------------------|
| 23 rules | compact-context ✅, agent-rule-compliance-assessment ✅ |
| 6 gaps (R1, R8, R13, R16, R17, R19) | current-status ✅, compact-context ✅, agent-rule-compliance-assessment ✅ |
| 15 backend tests / 24 frontend tests | current-status ✅, tech-stack ✅, compact-context ✅, agent-rule-compliance-assessment ✅ |
| 9 routes | project-overview ✅, current-status ✅, compact-context ✅ |
| Blocker #10 (paused) | current-status ✅, compact-context ✅, project-overview ✅, agent-rule-compliance-assessment ✅ |
| No auth/DB/writes | current-status ✅, project-overview ✅ |
| Env-driven CORS/proxy | tech-stack ✅, compact-context ✅, current-status ✅ |
| Multi-stage Docker | tech-stack ✅, current-status ✅ |