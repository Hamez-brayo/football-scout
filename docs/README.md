# Vysion documentation map

## Start here

- [Repository governance and ARCHIVIST](engineering/repository-governance.md): branch
  limit, active work map, agent invocation, cleanup/recovery and session checkpoints.
- [17 November recovery inventory](engineering/branch-inventory.json) and
  [17 November cleanup evidence](engineering/2026-11-17-archivist-audit.md).
- [Engineering rules](../AGENTS.md) and [coding standards](../CODING_STANDARDS.md).
- [Main protection and repository security reviews](engineering/repository-security.md)
  and the [health review template](templates/repository-health-review.md).
- [18 November repository health assessment](engineering/2026-11-18-repository-health-audit.md):
  security findings, CI blockers, evidence limits and assigned next actions.
- [20 November health review and handoff](engineering/2026-11-20-repository-health-review.md):
  current main protection, six-branch map, security patch checks and next priorities.
- [Architecture](../ARCHITECTURE.md): observe the current-source note before using
  historical examples. Actual entry points are mobile `App.tsx`/React Navigation
  and API `services/api/src/server.ts`.

## Current pilot and pending work

The working SDK 58 local pilot lives on `feature/iphone-windows-pilot`, not main
until its review chain is approved. Its [launch guide](https://github.com/Hamez-brayo/football-scout/blob/feature/iphone-windows-pilot/docs/engineering/pilot-quickstart.md)
and [verification ledger](https://github.com/Hamez-brayo/football-scout/blob/feature/iphone-windows-pilot/docs/engineering/2026-11-17-pilot.md)
cover iPhone/Windows setup and the limits of verified behavior. PR #9 targets its
retained player-development base. These external branch links describe current
work, not a claim that it has merged into main.

[CI proposal #4](https://github.com/Hamez-brayo/football-scout/pull/4) and
[product-direction proposal #8](https://github.com/Hamez-brayo/football-scout/pull/8)
remain pending. Do not claim their checks/features are integrated.

## Delivery references

- [Network API](api/network.md).
- [Network rollout/acceptance](engineering/football-network-release.md).
- [Interactive UI preview](engineering/interactive-ui-preview.md) and
  [historical verification](engineering/interactive-ui-verification.md).
- [Session handoff template](templates/session-handoff.md).
- [PR template](../.github/PULL_REQUEST_TEMPLATE.md).

Read package scripts and current source before following older setup examples.
No documentation example grants authorization for migration, seeding, deployment
or production writes.
