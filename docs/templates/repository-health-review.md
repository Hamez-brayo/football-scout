# Repository health review — <date and scope>

## Snapshot

- Repository, visibility, default branch, exact live main SHA:
- Active work branches/SHAs and open PR head/base dependencies:
- Reviewers who actually participated; unavailable roles and limitations:
- Overall status: red / amber / green, with the reason:

## Evidence and ownership

| Area | Status | Dated source or exact command/result | Finding / next action | Owner |
| --- | --- | --- | --- | --- |
| Main protection | | Active ruleset target, rules, bypasses, branch protected flag | | |
| Branch capacity and recovery | | Live heads/default, PR bases, exact archive tips | | ARCHIVIST |
| Dependency monitoring | | Graph/alerts settings and scan scope | | SENTINEL |
| Dependency vulnerabilities | | Lock/ref audited, scanner version/time, severity counts and reachability limits | | SENTINEL |
| CI and merge gates | | Actual workflow and reported check names, run URLs/conclusions | | ORACLE |
| API/shared verification | | Commands, counts, skipped cases, isolation | | BREAKER |
| Mobile and Windows/iPhone pilot | | Automated checks separately from dated device acceptance | | BREAKER |
| Separate Next.js web app | | Web build/type checks; baseline versus new failures | | FORGE |
| Secrets and environments | | Presence/handling only; never values | | SENTINEL |
| Independent review | | Reviewer, exact diff/HEAD, unresolved findings | | AUDITOR |

Use passed / failed / blocked / skipped / not run for commands. Use red / amber /
green for assessed areas and explain the mapping. Missing evidence is not green.
Do not report security findings as confirmed attacks or an audit count as the
number of independently exploitable vulnerabilities.

## Decisions and next checkpoint

- Actions actually applied, exact targets, and read-only verification:
- Blocking findings, assigned next owner, concrete next step and acceptance:
- Pending PR/branch slot dependencies and work preserved locally:
- Human decisions still needed for a specific merge/deployment/operation:
- Next review trigger and link to the [session handoff](session-handoff.md):
