# Repository security and quality reviews

## Main protection

On 18 November 2026, GitHub ruleset
[Vysion main protection](https://github.com/Hamez-brayo/football-scout/rules/27533157)
was created and independently verified through the GitHub API. It is active,
matches exactly `refs/heads/main`, and has no bypass actors. It blocks branch
deletion and non-fast-forward pushes, requires a pull request, and requires all
code review conversations to be resolved. Main remained at
`02d5a8e1ff9f16f1d424cb5b9761958656d9ff16` during configuration.

GitHub approving reviews are currently set to zero: the owner authors the PRs,
and agents operating with the owner's credentials are not distinct GitHub
reviewers. Independent agent review must be recorded honestly; explicit human
merge approval remains required by [AGENTS.md](../../AGENTS.md). When another
qualified reviewer with write access joins, reassess mandatory approvals and
approval of the latest push. Administrators can still edit rulesets; an empty
bypass list does not remove administrative control of repository settings.

Required status checks are not configured yet. Main has no workflow directory;
the draft [CI proposal #4](https://github.com/Hamez-brayo/football-scout/pull/4)
has historical jobs blocked by an account billing lock. GitHub labels their
conclusions failure, but no hosted build commands ran. Integrate and run suitable CI first, then
require its exact reported check names and verify the result. Do not select
invented checks or describe local tests as GitHub merge gates.

Linear history is not required while the stacked pilot PR chain is unresolved.
Merge, squash, and rebase remain available. Preserve the ancestry of active PR
bases; linear history is a workflow choice, not a substitute for verification.
Restrict creations/updates, deployment, signing, coverage, and code scanning
gates are not enabled by this baseline.

These settings follow GitHub's [ruleset documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
Public repositories support branch rulesets on GitHub Free. Settings protect
future branch updates; they do not repair existing dependencies or deploy code.

## Dependency monitoring

Dependency graph was off and was enabled on 18 November 2026. Dependabot alerts
were already on; both are now on. The previous inactive alert page and zero
advisory count were not evidence of safe dependencies. Enabling monitoring does
not patch packages, and alert results may take time to appear.

Automatic security/version update PRs were not enabled in this task: every
permitted remote branch slot is occupied. Review the existing auto-triage rule
and the [branch policy](repository-governance.md) before enabling automated PRs.
Do not dismiss alerts merely to produce a green dashboard. Follow GitHub's
[Dependabot setup instructions](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-dependabot-alerts).

Audit the default branch and active pilot separately. A finding in an npm audit
can represent an affected direct package, a transitive package, or a package
affected through its dependency chain. Counts are not proof of deployment,
reachability, exploitation, or a complete security assessment.

## Review cadence and responsibilities

Use the [health review template](../templates/repository-health-review.md) at
session handoff, before proposing a merge, and after dependency or protection
changes. A periodic review can be requested by the owner; no scheduled bot or
background agent is installed. Record only roles that actually participated.

- ORACLE consolidates scope, evidence, blockers, and the next owner.
- ARCHIVIST verifies live branches, PR dependencies, recovery records, and docs.
- SCOUT/WRENCH investigate and FORGE prepares bounded fixes.
- BREAKER runs applicable checks and distinguishes mocked, integration, and
  device results. A root build excludes the separate Next.js web application.
- AUDITOR independently reviews the diff; SENTINEL reviews security findings.
- AIRLIFT records release readiness only when requested. Merge and deployment
  remain separate human decisions.

An overall assessment remains red while required security or verification
findings are unresolved. Mark unavailable evidence blocked or not run; never
infer a pass from missing checks, zero tests, or a previous session's result.

## Recovery and change control

Re-read the live ruleset and branch status before changing protection. Record
the exact previous and proposed configuration, reason, and owner. Changes that
weaken protection require explicit human approval. Recover settings through a
reviewed edit; do not force-push or write to main to test protection. Preserve
verified audit evidence and small coherent commits without environment files,
credentials, generated build output, or local test accounts.
