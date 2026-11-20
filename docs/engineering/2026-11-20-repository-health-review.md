# Repository health review — 20 November 2026

## Scope and evidence

Status: **RED** while dependency findings, web source/build errors and hosted CI gaps remain.
This is a recoverable review checkpoint, not application merge or deployment approval.
ARCHIVIST freshly inspected GitHub through connector GETs only: repository/default,
remote branches, ruleset, open PR metadata, check runs, workflow runs/jobs and main's
`.github` directory. That audit changed no settings, refs, services, databases or environment files.
ORACLE also prepared the dependency/configuration patch in draft PR #11. Results
below are local evidence for that branch, not security results for unchanged main.

## Completed work and current branches

- Default main is `4078d7662f09c18e792ecd45357569e4183c34df`, with `protected=true`.
- [Ruleset 27533157](https://github.com/Hamez-brayo/football-scout/rules/27533157)
  is active for exact `refs/heads/main`, with no bypass actors and user bypass `never`.
  It blocks deletion/non-fast-forward and requires a PR plus resolved review threads.
  Required approvals are zero; no required CI or linear-history rule is claimed.
- Prior records establish owner-approved PR #10 merge, exact governance tip `cd00996`
  preserved under `archive/2026-11-18/chore/archivist-governance`, remote peeled-tip
  verification and retirement. Archive verification was not repeated in this audit.
- Prior records show Dependency graph and Dependabot alerts enabled; automatic
  security updates remained Off. These settings were not freshly reread here.
- Exactly six remote heads remain: main plus the five below. No branch slot is free.

| Branch | Live tip | PR / dependency |
| --- | --- | --- |
| `bugfix/web-dependency-security` | `050ef42` at audit; final delivery follows this checkpoint | #11 draft → main; not merge-ready |
| `codex/minimal-ci` | `854981f9be316a010c59218d9d527bbc297cefed` | #4 draft → main; `mergeable=false` |
| `feature/strategic-product-checkpoint` | `1c1ee77d691d16877486700b105e12cc0455f6ba` | #8 draft → main; `mergeable=false` |
| `feature/iphone-windows-pilot` | `e3b392bd1ff7af63800cea175d78c07c31c3e149` | #9 draft → player-development base |
| `feature/player-development-network` | `cb804d9e2c67c87c8d7e658d3ac546b602cd1625` | Active #9 base; retain |

PRs #4 and #8 now report conflicts in GitHub mergeability metadata and need target
refresh/review. PRs #11 and #9 report `mergeable=true`; this proves neither review
approval nor passing checks. No further branch deletion or application merge is authorized.

## Checks and limitations

| Check / scope | Status | Actual evidence |
| --- | --- | --- |
| Live repository, branches and main ruleset | Passed | Fresh connector responses confirm default main, six heads and protection above. |
| PR #11 hosted secret scan | Passed, bounded | Only check run: GitGuardian success, one commit scanned. Does not clear historical secrets or dependency findings. |
| PR #11 hosted build/test CI | Not established | No PR-triggered Actions runs returned; main `.github` contains only `PULL_REQUEST_TEMPLATE.md`. |
| PR #4 historical Actions | Blocked | Run 40769566429 has three failure-labelled jobs, with no exposed steps/log links. PR record says jobs never started due to billing lock. |
| Direct billing annotation proof | Blocked | Connector rejected the check-run annotations endpoint. Billing reason is PR-record evidence, not a newly verified annotation. |
| `npm ci --ignore-scripts --no-audit --no-fund --prefer-offline` | Passed | Final lock installed 1,871 packages, lifecycle scripts disabled. |
| `npm ls firebase-admin google-gax protobufjs shell-quote websocket-driver --all` | Passed | Admin 14.5.1; Gax 6.17.0/protobuf 7.6.6; shell-quote 1.12.0; driver 0.8.0. |
| `npm run build` | Passed | Shared/API only; includes modular Firebase configuration. |
| `npm run type-check` | Passed | Shared/API/mobile only; excludes web. |
| `npm test --workspace=@vysion/backend -- --runInBand` | Passed | 58 tests / 7 suites, including 10 new Firebase config cases. Mocked persistence; no database writes. |
| `npm test --workspace=@vysion/mobile -- --runInBand` | Passed | 40 tests / 7 suites on main-derived SDK 54 source; no physical-device test. |
| `node --test scripts/dependency-compatibility.test.ts scripts/archivist-audit.test.ts` | Passed | 4 real offline consumer contracts plus 7 governance-tool cases; contracts independently repeated by SENTINEL. |
| Standalone contract-test strict `tsc --noEmit` | Passed | ES2022, esnext/bundler, Node types, strict; Node execution itself does not type-check. |
| `npm audit --package-lock-only --json` | Failed vulnerability gate | Final lock: 68 findings, 0 critical, 33 high, 33 moderate, 2 low. |
| Same audit with `--omit=dev` | Failed vulnerability gate | 57 findings: 0 critical, 26 high, 30 moderate, 1 low; not a reachability analysis. |
| `npm run lint --workspace=web` | Failed source checks | Tooling crash resolved; final toolchain reports 21 errors / 33 warnings. No exclusions or disabled rules added. |
| `npm run build --workspace=web` | Failed | Next 15.5.29 compiles, then fails source lint. Direct type checking also fails; no production build success. |
| `tsc --noEmit --incremental false --project apps/web/tsconfig.json` | Failed | 46 diagnostics, all present in the saved baseline of 60; zero added diagnostics. |
| Independent AUDITOR / SENTINEL | Passed for draft delivery | No newly introduced blocking finding; remaining security/web/CI gaps keep merge readiness RED. Final results supplied for closeout review. |
| Documentation links / `git diff --check` | Passed | 35 local links in 9 changed/new Markdown files; no missing targets or whitespace errors. |

[PR #4](https://github.com/Hamez-brayo/football-scout/pull/4)'s historical
[run 40769566429](https://github.com/Hamez-brayo/football-scout/actions/runs/40769566429)
contains shared/API build, shared/API/mobile types and web-build failure labels.
Those labels are not evidence that application commands executed. The owner must
resolve the recorded billing block before executed CI can be established; this
review does not authorize billing changes. PR #4 also needs its conflicts resolved.

The candidate for draft [PR #11](https://github.com/Hamez-brayo/football-scout/pull/11)
uses one root lockfile, Next/config 15.5.29, next-auth 4.24.15, Prisma adapter
2.11.3, web React/DOM 19.1.10 and portable Windows Jest discovery. Firebase Admin
14.5.1 is directly declared in API/web; API imports were migrated to modular entry
points. Node >=22.18 is now required ([SDK needs >=22](https://firebase.google.com/support/release-notes/admin/node);
contract tests use [native TS enabled in 22.18](https://nodejs.org/api/typescript.html)).
Node 24.14/npm 11.9 were tested, using the installed npm CLI because the global
PowerShell shim is broken. No global installation or environment file changed.

Parent-qualified npm overrides did not reach workspace consumers during testing.
The obsolete Admin 11/Gax 3 chain was replaced instead of hand-editing resolutions.
Only the working root shell-quote override remains. Faye permits driver >=0.5.1;
the resolved 0.8.0 is covered by an offline RFC 6455 handshake/masked-frame test.
Web ESLint 9 uses its own 8.73.0 TypeScript plugin/parser and flat config to avoid the
hoisted API's legacy plugin. Existing Next warning severities were preserved.

Prisma types were generated from an exact schema copy in ignored scratch, its
own package manifest and unused localhost port 1 URL. No environment file was
loaded or database contacted; no migration/seed ran. Custom-token RS256 signing
uses an ephemeral generated test key; it does not validate cloud ID-token
verification, revocation, emulator integration or production credentials.

## Security and pilot context

Prior Nov18 lockfile audits reported main **98 affected-package findings / 12
critical**, and pilot **82 / 10 critical**. A GitHub default-branch notice reported
**395 findings / 21 critical**. These are historical baselines with different
aggregation/scopes, including npm metavulnerabilities; do not add or equate them,
or describe them as confirmed exploitable flaws. Updated full audit reduced the
main-derived count from 98 to 68 and critical from 12 to zero. The inbox advisories
GHSA-2xp9-vwfh-vxw4 and GHSA-2883-xcg3-v3hh are absent from the updated audit.
Main and the separate pilot retain their old dependencies until reviewed changes
are integrated; GitHub default-branch alerts need not close for an unmerged PR.
Historical credential assessment is not cleared by a successful one-commit scan.

Remaining findings include API/client HTTP dependencies, older mobile navigation
and Firebase client trees, validation/tooling packages and Next's PostCSS chain.
Some require major migrations. [Next 15's backport support ends 31 January 2027](https://nextjs.org/support-policy);
plan its supported-major migration. No remaining alerts were dismissed.

The owner confirmed local Expo pilot use and no deployments. PR #9 remains draft;
17 November iPhone registration/browser observations are historical acceptance,
not a new device test. Preserve its base and review chain; full native acceptance
and the broader dependency backlog remain unfinished.

## Ownership and next priorities

Actual roles: ARCHIVIST performed this fresh GitHub audit and earlier bounded
FORGE web-file edits. Root performed ORACLE/WRENCH/BREAKER work.
`governance_review` performed independent AUDITOR review. The dedicated Nov18
SENTINEL attempt failed on quota; it resumed Nov20, reviewed the security diff
and independently executed the four offline contracts. ARCHIVIST also implemented
the modular config/tests; its own implementation is not an independent approval.
AIRLIFT has no applicable release operation; nine independently running bots are
not claimed. Final security review must cover the implementation actually delivered.

1. Owner resolves the recorded GitHub billing lock; ORACLE/CI implementer refreshes
   conflicted #4, proves executed checks, then adds their exact names to main's ruleset.
2. ORACLE/FORGE repairs the legacy web source/auth/type blockers in a bounded task;
   BREAKER reruns web lint/types/build. Security PR #11 stays draft until required
   checks and further security findings are resolved or explicitly considered.
3. SENTINEL prioritizes remaining high findings by consumer/exposure; pilot owner
   preserves #9's base and retests SDK 58 native flows after integrating fixes.
4. ARCHIVIST refreshes conflicted product-doc PR #8 and retires branches only after
   approved merges, exact-tip archives and fresh dependency checks.

Worktree: `C:/Users/hamez/.codex/worktrees/vysion-archivist/football-scout`.
Delivery branch: `bugfix/web-dependency-security`, based on main `4078d766`;
prior pushed checkpoint `050ef42`, draft [PR #11](https://github.com/Hamez-brayo/football-scout/pull/11).
Final delivery commit/push confirmation is recorded in that PR and the session reply.
Ignored audit logs, installs and generated files remain local; no secrets, `.env`,
generated artifacts or unrelated work are part of delivery. No application merge,
deployment, migration or further branch retirement is approved. Next owner: **ORACLE**.
