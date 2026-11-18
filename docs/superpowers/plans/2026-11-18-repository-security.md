# Repository Security Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement tasks with bounded ownership and independent review.

**Goal:** Protect main, activate monitoring, assess repository health, and prepare verified dependency remediation.

**Architecture:** GitHub settings provide main protection and dependency alerts. Changes to dependencies and documentation use feature branches, with live evidence and human-controlled integration.

**Tech Stack:** GitHub rulesets/Dependabot, npm workspaces, Next.js web, Expo mobile, Express API, Markdown.

**Spec:** [Authorized design](../specs/2026-11-18-repository-security-design.md).

## Global constraints

- At most six remote heads; preserve stacked PR bases and unique work.
- No main writes, merge, deployment, migrations, database writes, secret reads, or environment edits.
- Baseline Next.js web and active Expo pilot are distinct verification scopes.
- A vulnerability count and a local passing suite do not certify production safety.

## Review focus

- Wrong branch patterns or bypass actors: inspect persisted ruleset and main protected flag.
- Solo-owner review deadlock: verify zero mandatory GitHub approvals and documented human approval policy.
- Missing CI names: do not require absent checks; inspect real workflow runs.
- Stale/nested locks: audit all authoritative manifests and lockfiles after updates.
- Pilot regressions: test API/mobile and retain the user's device acceptance as historical until retested.

## Task 1: Main protection and monitoring

- [x] Inspect live metadata, main, existing rulesets and official documentation.
- [x] Obtain independent AUDITOR review of exact baseline.
- [x] Enable graph; verify graph and alerts on, preserve the branch cap.
- [x] Save active ruleset 27533157 and independently verify exact main/no bypass/deletion/non-fast-forward/PR/thread rules.

## Task 2: Health review and recoverable governance checkpoint

Files: `docs/engineering/repository-security.md`, dated health audit,
`docs/templates/repository-health-review.md`, documentation map and handbook.

- [x] Audit main lock and copied pilot lock with npm's advisory registry; preserve raw results in ignored scratch.
- [ ] Consolidate live branch/PR/CI evidence and actual agent participation.
- [ ] Check links/diff and obtain independent documentation review.
- [ ] Commit/push the reviewed documentation to governance PR #10 without merging.

## Task 3: Focused dependency remediation

Files: affected package manifests/locks, web source only when compatibility fixes
are necessary, and a dated verification/handoff record.

- [ ] Create a dedicated local feature branch after the governance checkpoint; do not publish a seventh head.
- [ ] Verify patched Next.js 15 candidate and compatible auth/YAML patches against official registry/advisories.
- [ ] Establish install/build baseline with safe isolated configuration; do not contact databases or production APIs.
- [ ] Make bounded dependency changes and regenerate locks without forceful blanket updates.
- [ ] Re-audit, build web, run relevant shared/API/mobile checks and inspect regressions. Record all remaining findings.
- [ ] Obtain independent AUDITOR/SENTINEL review; prepare focused PR delivery when a branch slot is available.
- [ ] Record exact branch/HEAD, outcomes, pending device retest and next owner; request only the concrete human decision still required.
