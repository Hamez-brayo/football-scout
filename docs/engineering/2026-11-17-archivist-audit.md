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
- ARCHIVIST: completed the read-only audit; made no profile/documentation edits.
- ORACLE: implemented the profile and bounded governance documentation after takeover.
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
- Independent final AUDITOR/SENTINEL profile/documentation review: approved for PR
  delivery, not merge approval; reviewer independently reran seven passing tests.
  Independent remote checks were sandbox-blocked; remote outcomes above are ORACLE evidence.

Application runtime suites/builds are not applicable: application source and
manifests are unchanged. Governance tooling is tested separately. Offline refs
are labelled stale and cannot certify a live `--check` result. A benign Node
module-type warning is expected when using native TypeScript from this CommonJS
repository; no application module-mode change was introduced to suppress it.

The governance checkpoint `8191f05` was pushed, adding the sixth permitted branch.
A fresh live `node scripts/archivist-audit.ts --check --json` passed with six heads
and actual default main. All existing retained SHAs were unchanged. Never add a seventh.
The cap is a documented workflow and on-demand audit, not a server-side GitHub
protection rule or a claim of automatic scheduled enforcement.

Resume with the inventory and [governance handbook](repository-governance.md).


## ARCHIVIST integration checkpoint

The delegated ARCHIVIST completed the independent read-only inventory. ORACLE
consolidated the standalone project agent profile, governance handbook, session
handoff and PR templates, documentation map and source-truth notes. This is an
on-demand role/profile, not an autonomous scheduled GitHub service. No personal
Codex configuration or model defaults were changed.

Local TOML schema, all relative Markdown links, cross-branch pilot references,
archive/inventory invariants and local environment-file preservation passed.
Profile/documentation publication is through a separate governance PR to main;
no permission to merge is inferred. Independent final review completed with no blocking findings; the reviewer
independently reran seven passing tests. PR delivery is supported, not merge approval.
The earlier independent pre-execution review found no blocker in the preservation
strategy subject to the remote checks, all of which were completed.

Next owner: the human for PR review and explicit merge approval. Current application development remains on `feature/iphone-windows-pilot`.
Once the governance PR is merged and no PR depends on its head, retire that
branch under the same policy to free a slot. No application services were changed;
the existing local pilot API still returned HTTP 200 during closeout.
