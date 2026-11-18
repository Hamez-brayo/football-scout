# Repository health audit — 18 November 2026

## Scope and evidence ownership

ARCHIVIST assessed repository governance, branch capacity, open PR dependencies and
the distinction between local validation and hosted CI. This report is an audit
checkpoint, not merge, deployment, cleanup or database authorization.

ARCHIVIST independently read the repository governance documents, branch inventory,
package scripts, test-file inventory and GitHub connector repository/branch/PR
metadata. That connector snapshot showed default `main`, six branches and four
open PRs. Its PR #10 head was then
`1f818572e61cd12f4c2b086c7dd78753b4f99174`. The initial working tree was clean on
`chore/archivist-governance` at the same SHA. An SSH `git ls-remote` attempt was
blocked; an escalated retry produced no evidence before interruption. Therefore
ARCHIVIST does not claim an independently refreshed live-ref or CI-run audit after
that snapshot.

Subsequent settings, audit counts and checkpoint updates below are explicitly
ORACLE-supplied evidence from this session. ORACLE reports that independent
`governance_review` verified the persisted main ruleset and protection state. The
prior governance checkpoint is `ea51325`, pushed to PR #10. This report was
subsequently consolidated by ORACLE for the next documentation checkpoint;
the PR commit list records its publication SHA.

## Health assessment

| Area | Status | Evidence and practical limit | Next owner |
| --- | --- | --- | --- |
| Dependency security | **RED** | ORACLE ran lockfile-only npm audits: main baseline 98 package findings (12 critical, 46 high, 35 moderate, 5 low); pilot 82 (10 critical, 41 high, 27 moderate, 4 low). These include metavulnerabilities and do not establish exploitability or deployed exposure. Dependency patches are not yet delivered. | ORACLE / implementer, then independent AUDITOR and SENTINEL |
| Hosted CI | **RED** | PR #4 is a draft CI proposal. Its historical run created three jobs that never started because of an account billing lock. No Ubuntu build/type-check success is established. ORACLE reports no workflows/checks on current main. | Owner resolves account access; CI implementer refreshes proposal and evidence |
| Web verification | **RED** | PR #4 records a local web build failure at `apps/web/src/app/(dashboard)/talent/layout.tsx:49`: `logout` absent from `AuthContextType`. This is historical branch-specific evidence, not a new run. Web dependencies remain unpatched; current main web build has not been proved here. | ORACLE / implementer, then BREAKER |
| Historical secrets | **RED** | PR #10 removes a tracked root `.env` from its branch while retaining the local file. Historical commits/tags remain. Main has not received that PR. No values were inspected by this audit, and no credential assessment, rotation or history remediation is established. | Owner / SENTINEL |
| Pilot delivery | **AMBER** | Draft PR #9 targets `feature/player-development-network`, which must be retained. PR evidence describes 17 November local registration and iPhone success; no fresh device test occurred in this audit. Full native acceptance and integration of the underlying branch remain pending. | ORACLE / pilot owner |
| Main protection | **GREEN, bounded** | ORACLE and independent reviewer verified active ruleset [27533157](https://github.com/Hamez-brayo/football-scout/rules/27533157), exact `refs/heads/main`, no bypass actors, deletion/non-fast-forward blocks, PR required, zero approvals for the solo-owner workflow, resolved threads required. `protected=true`; main tip remains `02d5a8e1ff9f16f1d424cb5b9761958656d9ff16`. No required CI checks or linear-history rule is claimed. Classic protection's `enabled=false` does not negate the active ruleset. | Owner retains merge authority |
| Security monitoring | **GREEN for enablement; RED findings remain** | ORACLE verified saved UI state: Dependency graph and Dependabot alerts On. Graph had been Off; alerts were already On. Automatic security updates remain Off to preserve branch-cap discipline. Monitoring enablement does not remediate findings. | Owner / ORACLE |
| Branch capacity and recovery | **GREEN at ceiling** | Connector snapshot contained main plus five branches; ORACLE's latest live verification retained the same six. No capacity remains for another same-repository remote branch. Existing archive inventory preserves six retired tips; ARCHIVIST did not freshly verify remote tags during this audit. | ARCHIVIST / ORACLE |
| Documentation checkpoint | **GREEN, bounded** | ORACLE reports six reviewed documentation files committed and pushed at `ea51325` in PR #10; 25 local links, whitespace check and 7/7 audit-tool tests passed. Application correctness is outside that documentation proof. | ORACLE consolidates this report |

Overall status is **RED** because dependency, CI, web-validation and historical
secret-assessment gaps remain. Protection and monitoring improvements reduce
future risk but do not close these gaps.

## Dependency evidence and count boundaries

ORACLE verified that the governance branch's manifests and lockfile matched
`origin/main` before running the main baseline command:

```text
npm audit --package-lock-only --ignore-scripts --json
```

It used explicit Node/npm-cli paths and escalated registry access after a sandbox
network failure. Raw evidence is preserved in ignored local files
`.archivist/security-audit/main-audit.json` and
`.archivist/security-audit/pilot-audit.json`; these are not delivery artifacts.
The main critical-package list supplied by ORACLE is `@auth/core`,
`@auth/prisma-adapter`, `concurrently`, `fast-xml-parser`, `handlebars`, `next`,
`next-auth`, `protobufjs`, `proxy-addr`, `shell-quote`, `tar` and
`websocket-driver`. Remediation requires compatibility checks; an indiscriminate
audit fix is not an approved implementation plan.

After monitoring processed the graph, ORACLE's GitHub push notification reported
395 default-branch findings: 21 critical, 198 high, 144 moderate and 32 low.
GitHub and npm counts have different scopes and aggregation; do not add them or
represent either as a count of confirmed exploitable flaws. Actual deployment
versions and exposure are unknown in this audit.

## Branches, PR dependencies and unique work

The connector independently identified the following branch names and PR
metadata. Full SHAs below are from that snapshot unless stated otherwise.

| Branch | Tip / PR | Dependency and preservation requirement |
| --- | --- | --- |
| `main` | `02d5a8e1ff9f16f1d424cb5b9761958656d9ff16` | Default integration branch; ORACLE subsequently confirmed unchanged. |
| `chore/archivist-governance` | Latest ORACLE checkpoint `ea51325`; [PR #10](https://github.com/Hamez-brayo/football-scout/pull/10) targets main, open and not draft at connector snapshot | Governance/profile/tooling work remains unmerged. New report is not part of the reported checkpoint. |
| `codex/minimal-ci` | `854981f9be316a010c59218d9d527bbc297cefed`; [PR #4](https://github.com/Hamez-brayo/football-scout/pull/4) targets main, draft | One workflow proposal; historical local results and blocked hosted jobs do not make it ready to merge. |
| `feature/strategic-product-checkpoint` | `1c1ee77d691d16877486700b105e12cc0455f6ba`; [PR #8](https://github.com/Hamez-brayo/football-scout/pull/8) targets main, draft | Product-direction documentation remains unique/unmerged. |
| `feature/iphone-windows-pilot` | `e3b392bd1ff7af63800cea175d78c07c31c3e149`; [PR #9](https://github.com/Hamez-brayo/football-scout/pull/9), draft | Two pilot commits target the player-development branch, not main. Preserve its history and base. |
| `feature/player-development-network` | `cb804d9e2c67c87c8d7e658d3ac546b602cd1625` from repository inventory and PR #9 base | Active PR #9 dependency; deletion would break the review chain. No open integration PR for this base appeared in the four-PR connector result. |

All four PRs were open and reported mergeable by the connector; that is conflict
metadata, not review approval, passing checks or integration readiness. No
GitHub review submissions or required-check configuration were independently
retrieved by ARCHIVIST. PR #4's metadata base SHA was older than live main, so its
proposal and documentation need review against the intended target before use.

The 17 November inventory records four merged and two historical unmerged
branches preserved with annotated archive tags. In particular, archived auth
unification and workflow-hardening implementations must not be described as
merged or discarded. Their exact recovery SHAs remain in
[branch-inventory.json](branch-inventory.json). Do not restore historical source
to a remote branch without reviewing dependencies and tracked sensitive files.

## Safe delivery route under the six-head cap

Prepare the bounded dependency fix on a local-only dedicated branch from a
freshly verified target. Independent main remediation starts from main; a pilot
fix starts from the pilot branch to retain its dependencies. Local branches do
not consume GitHub remote branch slots.

For this session, a local security branch may start from the reviewed governance
checkpoint: its application manifests/source still match verified main, and the
stack avoids checking out main's tracked `.env` over the preserved local file.
Keep dependency edits separate from governance PR #10. If #10 is merged with its
ancestry preserved, the security branch can target updated main after a slot is
available; otherwise reassess the base and isolate its application-only diff.

Do not push a seventh same-repository head or delete an active base to obtain a
slot. Before a separate same-repository security PR can be published, the owner
must authorize a specific eligible branch retirement or complete and explicitly
approve a PR merge followed by dependency-checked retirement. PR #10 is a
potential future slot after approval and preservation checks, not an approved
deletion now. Reaudit live refs and all PR heads/bases, preserve/verify exact
archive tips where required, then publish the separate security branch only once
capacity exists. Do not mix unrelated security changes into the governance PR.

This session's initial authorization did not permit ARCHIVIST to merge, delete,
push, change settings or alter application code. No such action was performed by
ARCHIVIST. ORACLE's separately authorized settings work is reported above.

## Actual checks and remaining acceptance work

| Check / command | Scope | Status | Evidence / limitation |
| --- | --- | --- | --- |
| GitHub connector `get_repo`, `search_branches`, `search_prs`, four `get_pr_info` calls | Repository default, branch names, open PR metadata | Passed | Independently returned public repo/default main, six branch names and PRs #4/#8/#9/#10. Snapshot preceded ORACLE's `ea51325` push. |
| `git status --short --branch`, `git rev-parse HEAD`, document/manifest/test inventory reads | Initial local audit | Passed | Clean governance branch at `1f818572e61cd12f4c2b086c7dd78753b4f99174`; API/mobile Jest configs and tests exist on that tree. |
| `git ls-remote --symref origin ...` | Independent live SHA/default/tag verification | Blocked | Sandbox SSH connection denied; escalated retry yielded no usable result before interruption. Local tracking refs are not substituted for live proof. |
| Commit statuses / workflow-run API retrieval | Fresh CI conclusions | Not run | Calls following the interrupted ref check did not return results. Historical PR #4 run evidence remains explicitly historical. |
| [Actions run 40769566429](https://github.com/Hamez-brayo/football-scout/actions/runs/40769566429) | PR #4 historical hosted CI | Blocked | PR body reports all three jobs never started due to billing lock. GitHub failure labels do not prove application commands ran. |
| Main and pilot lockfile npm audits | Dependency baseline | Failed vulnerability gate; scans completed | ORACLE-supplied JSON counts above. Valid completed scanner results contain critical/high findings. |
| Saved main ruleset and monitoring settings | Repository settings | Passed | ORACLE observed saved settings; independent reviewer confirmed main protection. No required CI gate is claimed. |
| `node --test scripts/archivist-audit.test.ts` | Governance tool | Passed | ORACLE reports 7/7 tests for `ea51325`; not rerun by ARCHIVIST. |
| Local documentation links and `git diff --check` | Six-file ORACLE documentation checkpoint | Passed | ORACLE reports 25 links and whitespace checks. This new report was not included in those earlier checks. |
| API/mobile tests, root build/type-check, web build | Current application state | Not run by ARCHIVIST | Read-only governance audit; no services/database operations. Existing PR validation is historical and branch-specific. |
| Application runtime tests for this new Markdown report | Documentation-only addition | Skipped | No runtime code changed; review document facts, references and diff instead. |

### ORACLE baseline follow-up before dependency edits

- `npm ci --ignore-scripts --no-audit --no-fund`: passed in the isolated
  governance worktree, installing 1,861 packages. No lifecycle scripts ran.
- `npm run build --workspace=web`: initially blocked by sandbox denial of the
  existing Google Fonts request. Network-enabled retry compiled with Next.js
  15.2.4, then failed lint with 43 error lines and 13 warnings. Existing issues
  include unused imports/variables, explicit `any`, unescaped JSX text, an empty
  interface, and the global Prisma `var`. Type validation and a successful final
  build are not established. No lint rule was disabled.
- `npm ls next eslint --all`: failed with `ELSPROBLEMS`. Installed web Next.js
  15.2.4, eslint-config-next 15.2.4 and ESLint 9.23.0 disagree with the manifest's
  Next/config 14.0.4 and ESLint `^8`. A stale nested web lock is present, in
  addition to the root workspace lock. Correcting dependency/lock consistency
  is part of the focused security patch, not evidence the legacy app works.
- Strict standalone TypeScript check of the governance audit tool and tests:
  passed. GitGuardian's check on `89c05e8` also reported success; that check is
  not a dependency, application build, or comprehensive secret-history audit.

Raw baseline install/build logs remain under ignored
`.archivist/security-audit/`. These are fresh ORACLE results, separate from
ARCHIVIST's read-only inventory and the older PR #4 observations.

Root `npm test` prints guidance and is not an application test suite. Root build
covers shared/API; root type-check covers shared/API/mobile. Both exclude the web
app. API/mobile committed tests now exist on the inspected governance tree, so
PR #4's older no-tests statement must not be generalized to current main or
pilot. Web has a build script but no dedicated type-check/test script. The root
`build:mobile` command references a missing mobile build script.

The 17 November pilot PR reports 71 API tests passed with one opt-in integration
test skipped, 55 mobile tests passed and 11 launcher checks passed, plus local
build/type-check and browser/device observations. These are preserved historical
claims, not new audit results or proof of hosted CI.

## Role accounting and handoff

This was not a completed all-role review. ARCHIVIST performed the bounded audit;
ORACLE ran dependency audits and settings work; independent `governance_review`
performed AUDITOR review and confirmed protection. The SENTINEL dependency agent
failed on a usage limit before findings; `governance_review` also provided bounded
SENTINEL-style dependency and web source findings. This is source advice, not
approval of a patch that has not been implemented. No separate FORGE, BREAKER or AIRLIFT
session completed for the pending security patch. Prior PR reviews do not
constitute independent approval of work that has not yet been implemented.

Changed path for this handoff:
`docs/engineering/2026-11-18-repository-health-audit.md` only. No application files,
secrets, environment files, generated output or Git refs were changed by
ARCHIVIST. ORACLE owns factual/link checks and independent review before publication.

Next owner: **ORACLE**. Preserve the six-head cap and current main tip; review
this report, prepare the bounded web/dependency implementation locally, obtain
meaningful regression/build evidence and independent AUDITOR/SENTINEL review,
then resolve a specifically authorized publication route. Hosted CI access,
current web correctness, historical credential assessment, full pilot acceptance
and the PR #9 base integration remain explicit blockers or unfinished work.
