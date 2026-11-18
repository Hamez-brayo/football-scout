# Vysion repository governance

## Where work belongs

`main` is the default reviewed integration branch. A merge is not a deployment or
proof of production readiness. GitHub may have **at most five other branches**;
this is a ceiling, not a target. Do not add a permanent `develop` branch for the
current small-team pilot workflow.

| Branch | Purpose / next action |
| --- | --- |
| `main` | Reviewed integration; human-approved PR merges only |
| `feature/iphone-windows-pilot` | Current application work and personal tests, draft PR #9 |
| `feature/player-development-network` | Temporary base/dependency of PR #9; retain until its review chain is resolved |
| `codex/minimal-ci` | Pending CI proposal, PR #4; inspect actual checks before adoption |
| `feature/strategic-product-checkpoint` | Pending product-direction documentation, PR #8 |
| `chore/archivist-governance` | Agent/profile, governance tooling and cleanup delivery |

This table is a dated working map, not six permanent branches. Current pilot fixes
start from the pilot branch and target it through a focused PR; branching those
fixes from older main would omit the pilot dependencies. New independent work
starts from freshly checked origin/main. Preserve stacked PR bases until no open
PR depends on them. Retire merged branches after that dependency check.

The exact 17 November cleanup and recovery SHAs are recorded in
[branch-inventory.json](branch-inventory.json) and the
[audit record](2026-11-17-archivist-audit.md). Future sessions must inspect live
GitHub state rather than treating this snapshot as current indefinitely.

## ARCHIVIST's interface

ARCHIVIST owns repository/documentation audits, branch inventories, recovery
records, PR descriptions/templates, navigation between engineering documents,
and session-closeout evidence. ORACLE sets scope and consolidates the result;
AUDITOR independently reviews correctness and SENTINEL handles secret/security
concerns. ARCHIVIST does not approve its own work or grant merge/deploy authority.

The project profile is [archivist.toml](../../.codex/agents/archivist.toml).
It uses the supported standalone Codex agent format and inherits the caller's
model and permissions. Compatible clients discover project agents in trusted
repositories; open a fresh session on a branch containing this profile if needed.
The current app tool may require explicit delegation with the profile instructions.
A checked-in profile is not evidence that every existing session loaded it.
No global config, background service, scheduled GitHub bot or paid service is installed.

Example requests:

- "ORACLE, delegate a read-only repository audit to ARCHIVIST."
- "ARCHIVIST, verify branch count, open PR dependencies and documentation drift."
- "ARCHIVIST, close out this authorized task with a recoverable checkpoint and handoff."

Give a concrete objective, target repository/branches, permitted mutations and
required evidence. Default to read-only when no changes were requested. Existing
task authorization remains valid: do not add another approval round for routine
checks, reversible edits or already authorized cleanup. A new role does not expand
that authorization to unrelated deletion, history rewriting or external operations.

## Read-only audit command

With Node 24 available (as on the pilot PC), run from the repository root:

```powershell
node scripts/archivist-audit.ts --check
node --test scripts/archivist-audit.test.ts
```

This tooling runtime does not change the application engines declared on each
branch. The audit reads live origin refs and its symbolic default: main must
exist, remain the default, and total heads must be six or fewer. `--json` produces
machine-readable evidence. Network/format failures are blocked checks, not passes.
`--offline` is a labelled local tracking snapshot; combining it with `--check`
is refused. The tool never fetches, edits, commits, pushes or deletes anything.

The cap is enforced by workflow discipline and this on-demand check. The
[main protection ruleset](repository-security.md) added on 18 November protects
main; it does not enforce the branch count. No automatic cleanup workflow or
required CI status check is configured by this governance change.
If all slots are occupied, finish/archive authorized inactive work or use the
appropriate existing task branch. Do not delete active work to create a slot.

## Safe cleanup and recovery

1. Check local status, worktrees, live main/default, all remote heads and open PR
   heads/bases. Record full tip SHAs, ancestry and unique commits. Squash merges
   require patch/PR evidence; names and age alone never prove a branch is disposable.
2. Classify as active, dependency, merged or historical unmerged work. Keep active
   PR dependencies. Closing a stale proposal as archived is not merging its work.
3. For an authorized deletion, create an annotated `archive/YYYY-MM-DD/<branch>`
   tag at the exact original tip, with reason and PR provenance. Push that tag
   and verify its remote peeled SHA before removing the source branch.
4. Reread source refs and PR dependencies immediately before deletion. Refuse on
   unexpected changes; use exact-SHA guards and atomic deletion where supported.
   Never move an existing archive tag or update shared branch history by force.
5. Verify the retained tips, default main, branch count, PR dispositions and all
   recovery tags remotely. Update the inventory and handoff with actual outcomes.

Tags preserve the complete reachable history without consuming branch slots.
For example, recover the archived workflow proposal locally with:

```powershell
git fetch origin tag archive/2026-11-17/chore/repository-workflow-hardening
git switch -c restore/workflow-hardening 'archive/2026-11-17/chore/repository-workflow-hardening^{commit}'
git rev-parse HEAD
```

Compare HEAD to `2e042a84168dba84403ac18bc93f9d8b86818dd5` in the inventory.
Restoration does not reopen its PR or restore operational services/data. Historical
source may contain obsolete dependencies or tracked environment files: review
and remove sensitive artifacts from tracking before publishing recovered changes.
A future remote restoration also needs an available branch slot and task scope.

## Documentation and session checkpoints

Use [docs/README.md](../README.md) as the document map. Verify commands against
current manifests and source paths. Mark legacy examples and planned features as
such. Link canonical documents instead of copying conflicting instructions.

Before sustained work, establish a recoverable checkpoint strategy. Commit small,
coherent, checked changes; where recovery requires an unfinished checkpoint,
label it unverified and list missing checks. Before ending or handing off, record:

- branch, HEAD, remote push state and PR/base;
- completed scope and exact changed paths;
- command, scope, passed/failed/blocked/skipped/not-run result and limitations;
- unfinished/untracked work, where it is preserved and who owns the next step.

Use the [session handoff template](../templates/session-handoff.md). Checkpointing
is not blanket permission to commit everything. Inspect staged paths; exclude
credentials, environment files, generated output, local bundles and disposable
test data. Preserve unrelated work. Do not claim all tests pass from root npm test
or a zero-test run. Application suites need not run for documentation-only edits,
but test new tooling and check links/TOML/diffs. Keep honest evidence in the PR.

A tracked root `.env` was removed from tracking by this governance change while
its local file was retained. Old commits/tags remain unchanged. SENTINEL and the
owner must assess any real historical credentials separately; no values were read,
no rotation performed and no history rewritten during this cleanup.
