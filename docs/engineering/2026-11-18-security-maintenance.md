# Security maintenance checkpoint — 18 November 2026

## Scope and current owner

ORACLE coordinates dependency remediation and repository quality assessment.
The owner authorized security monitoring/protection, then explicitly approved
merging governance PR #10 with a merge commit and retiring only its branch after
archive/dependency verification. The application security patch remains a
separate, unmerged task on `bugfix/web-dependency-security`.

The owner confirmed no application has been deployed: use is local pilot testing.
A Vercel metadata read was denied by the connected account scope; no extra
access was granted, no production endpoint was tested, and no deployment ran.

## Completed governance integration and recovery

- PR #10 merged as `4078d7662f09c18e792ecd45357569e4183c34df`, preserving ancestry.
- Its exact final head `cd00996a7fc4847f087099fbcf5218b518295b1d` was preserved
  before merging in annotated tag
  `archive/2026-11-18/chore/archivist-governance`.
- Remote tag object `43852e7e08c9319a5fc6004398455a70719e1007` and peeled commit
  `cd00996a7fc4847f087099fbcf5218b518295b1d` were verified through `git ls-remote`.
- Fresh open-PR inspection found no governance-base dependency. After the merge
  was confirmed, the remote governance branch was deleted with an exact-SHA
  lease. Local branches/worktrees and earlier archive tags were preserved.
- Main reports `protected=true`; active ruleset
  [27533157](https://github.com/Hamez-brayo/football-scout/rules/27533157) remains
  the main-only PR/deletion/force-push/conversation baseline.
- Five remote heads remained after retirement. Recheck capacity before publishing
  the security branch; main plus five is still the ceiling.

The local security branch was fast-forwarded to the approved main merge before
application edits. Local `.env` contents were not read or overwritten.

## Baseline evidence before the patch

Full dependency baseline: main lock 98 affected-package entries (12 critical,
46 high, 35 moderate, 5 low); pilot lock 82 (10 critical, 41 high, 27 moderate,
4 low). GitHub subsequently reported 395 default-branch alerts (21 critical,
198 high, 144 moderate, 32 low). These counts have different aggregation and are
not counts of confirmed exploitable flaws. See the
[health assessment](2026-11-18-repository-health-audit.md).

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Locked install with lifecycle scripts disabled | Passed | 1,861 packages; Node 24.14.0 with explicit installed npm CLI because the global npm PowerShell shim is broken. |
| Web build | Failed | Sandbox initially blocked Google Fonts. Network-enabled retry compiled Next.js 15.2.4, then failed 43 lint errors and 13 warnings. Type validation/final build success is not established. |
| `npm ls next eslint --all` | Failed | Nested Next/config 15.2.4 and ESLint 9.23.0 conflict with declared Next/config 14.0.4 and ESLint `^8`; stale nested web lock exists. |
| Default API Jest discovery | Failed | Windows-expanded `<rootDir>` glob matched zero tests; zero tests is not a pass. This portability fix already exists separately on the pilot branch. |
| API with portable CLI discovery | Passed | 6 suites, 48 tests. Command: `node node_modules/jest/bin/jest.js --config services/api/jest.config.json --testMatch '**/tests/**/*.test.ts' --runInBand`. Assertions/config transforms were retained. |
| Mobile with portable CLI discovery | Passed | 7 suites, 40 tests. Same command with `--config apps/mobile/jest.config.json`. This is the main-derived SDK 54 source, not a new SDK 58 device test. |

Prisma types were generated from an exact schema copy under ignored
`.archivist/prisma-generate/`, with its own minimal package manifest and an unused
`127.0.0.1:1` database URL. No environment file was loaded, migration/seed ran,
or database was connected. The official engine download retained TLS/checksum
verification. Raw baseline/audit logs are in ignored `.archivist/security-audit/`.

## Patch and validation progress

This is an **unverified recovery checkpoint**, not a merge-ready application fix.
FORGE prepared the manifest/README changes; its package-manager call stalled and
was interrupted without a confirmed process/session. ORACLE verified there was
no matching npm lockfile process, then regenerated and installed the lock.

The root workspace lock is authoritative; the obsolete nested web lock was
removed. Resolved versions are Next/config 15.5.29, next-auth 4.24.15, Prisma
adapter 2.11.3 with Auth.js core 0.41.3, and js-yaml 3.15.2/4.3.2. Removing the
stale lock initially downgraded the effective web React version; independent
review caught this before delivery. Web React/DOM now explicitly resolve 19.1.10
with compatible 19.1 types. Mobile React/DOM remain 19.1.0.

Next.js 15 is a bounded security backport, supported only through 31 January
2027 under the [upstream policy](https://nextjs.org/support-policy). Plan a
supported-major migration before that deadline. The two inbox advisories are
absent from the post-change audit; Next still has a moderate transitive PostCSS
finding. This does not establish a clean dependency tree.

API/mobile test discovery now uses the portable glob already present on the
pilot branch. No test assertion, transform, lint rule, auth architecture or
database schema was weakened or changed. The live SDK 58 pilot worktree is
separate and was not modified.

| Post-change check | Actual result | Limit |
| --- | --- | --- |
| Clean locked install, lifecycle scripts disabled | Passed; 1,813 packages | Before the final compatible-transitive/lint-tooling correction below. |
| Root `npm run build` | Passed | Shared/API only. |
| Root `npm run type-check` | Passed | Shared/API/mobile only. |
| API `npm test --workspace=@vysion/backend -- --runInBand` | Passed; 48 tests / 6 suites | Mocked persistence, local ephemeral HTTP; no database writes. |
| Mobile `npm test --workspace=@vysion/mobile -- --runInBand` | Passed; 40 tests / 7 suites | Main-derived source; no new physical-device acceptance. |
| Full lockfile audit | Failed vulnerability gate; 90 findings: 8 critical, 43 high, 36 moderate, 3 low | The main baseline was 98 with 12 critical. Not a clean-security result. |
| Web build | Failed | Next 15.5.29 compiles; lint has an ESLint API/options mismatch, then type checking stops on existing `logout`/`signOut` mismatch. |
| Direct web TypeScript check | Failed; 46 diagnostic lines | Baseline was 60; existing legacy source errors remain. |

Next local actions: correct web lint tooling to match the existing flat config;
refresh compatible vulnerable transitive packages within their declared major
ranges; repeat affected checks and obtain final independent review. No forced
blanket upgrade or source-error suppression is authorized by this checkpoint.

## Outstanding ownership

- ORACLE/FORGE: finish and verify the focused dependency diff, then deliver a PR
  within branch capacity. No application merge is approved by this checkpoint.
- AUDITOR/SENTINEL: independently review the actual patch and remaining risks.
- Owner: resolve the GitHub account billing lock before hosted CI can execute;
  no billing or payment changes were attempted by agents.
- ORACLE: refresh the pending CI proposal against current source and name real
  successful checks before making them required.
- Owner/SENTINEL: assess historical credentials without publishing values;
  removing `.env` from tracking does not rotate credentials or erase history.
- Pilot owner/BREAKER: retain PR #9's player-development base and complete native
  feature acceptance separately. Prior iPhone success is historical evidence.
