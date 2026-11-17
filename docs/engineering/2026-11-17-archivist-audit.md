# ARCHIVIST repository cleanup — 17 November 2026

## Authorization and design

The user requested actual GitHub cleanup to `main` plus no more than five other
branches, and implementation of ARCHIVIST as repository governance/documentation
agent. Scope includes preserving old work, organizing refs and documentation,
commits/push/PR delivery. No merge, main rewrite, deployment, database operation,
credential change or unrelated working-tree cleanup is authorized.

Use a small trunk-oriented workflow rather than permanent develop/release branches.
Retain the current pilot and its stacked PR base, the open CI and product proposals,
and this governance branch. Archive all six retired branch tips as annotated tags,
verify their remote peeled SHAs, then delete only the audited branch refs using
exact-SHA leases. This preserves unique work without consuming branch slots.

## Plan and ownership

- SCOUT/ARCHIVIST: completed independent read-only ancestry and documentation audit.
- ORACLE: owns remote mutation, snapshot register, audit tool and final checks.
- ARCHIVIST: implements the project agent profile and bounded governance docs.
- AUDITOR/SENTINEL: independently review source, authorization and recovery safety.

Current execution status: **six retired branches archived and removed; existing retained tips unchanged**.
The machine-readable [branch inventory](branch-inventory.json) holds all original
full SHAs, archive tags, retained purposes and operation outcomes.

## Evidence before cleanup

Live origin had 11 heads and no tags. Main remains the default branch at
`02d5a8e1ff9f16f1d424cb5b9761958656d9ff16`. Four retired tips are actual ancestors
of main. Old workflow and auth tips contain 12 and 10 exclusive commits respectively;
neither is safe to discard. PR 9 depends on the retained player-development base.
PRs 4 and 8 remain open. PR 2 was closed as archived/unmerged after its
source tip had a verified remote archive tag. PR 1 was already closed/unmerged.

The running pilot worktree and local-only `feature/vysion-engineering` branch are
untouched. No application services are restarted by repository housekeeping.

## Secret hygiene

Only the tracked root `.env` filename/presence was inspected, not its contents.
Governance removed it from Git tracking while preserving the local file.
This does not erase history or rotate credentials. Any historical credential
assessment/remediation belongs to SENTINEL and the owner, without printing values
or performing an unapproved history rewrite.

## Verification and handoff

Completed checks so far:

- Live GitHub snapshot and PR dependencies: passed; main is the default branch.
- Six annotated archive tags: pushed and verified by exact remote peeled SHA.
- Six branch deletions: atomic, exact-SHA leased; verification passed.
- Existing retained branch tips and pilot/base dependency: unchanged.
- Audit tool regressions: seven passed; original cap/default-main regressions
  failed before implementation/fix, then passed.
- Live audit after retirement, before governance push: passed, five of six slots.
- Standalone TypeScript strict check: passed; rerun after final source changes.
- Root environment index removal: passed; local file still present, values unread.
- Independent final profile/documentation review: pending at this checkpoint.

Application runtime suites/builds are not applicable: application source and
manifests are unchanged. Governance tooling is tested separately. Offline refs
are labelled stale and cannot certify a live `--check` result. A benign Node
module-type warning is expected when using native TypeScript from this CommonJS
repository; no application module-mode change was introduced to suppress it.

The final governance push adds the sixth permitted branch. Verify with
`node scripts/archivist-audit.ts --check` after pushing; never add a seventh.
The cap is a documented workflow and on-demand audit, not a server-side GitHub
protection rule or a claim of automatic scheduled enforcement.

Resume with the inventory and [governance handbook](repository-governance.md).
