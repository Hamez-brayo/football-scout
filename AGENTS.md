# Vysion Analytics — AI Engineering Governance

## Scope and repository facts

These rules apply to every AI engineering role in this repository. Roles describe
responsibilities, not installed tools or automatically running agents. User task
limits apply to every role; handoffs never expand authorization.

Read `CODING_STANDARDS.md`, `ARCHITECTURE.md`, and relevant setup/API documentation
before changing code. Follow existing TypeScript, naming, formatting, validation,
error-handling, and service-layer conventions. Verify documentation against source
and manifests: some architecture examples describe older paths or planned features.

- `services/api`: Express + TypeScript; routes, controllers, middleware, services;
  Firebase Admin and local JWT authentication. Entry: `src/server.ts`.
- `apps/mobile`: Expo + React Native + TypeScript. `index.ts` loads `App.tsx`;
  navigation uses `src/navigation/AppNavigator.tsx` (React Navigation).
- `apps/web`: Next.js web application, with its own package scripts.
- `packages/shared`: `@vysion/shared` types, Zod schemas, constants, and utilities.
- `database/prisma/schema.prisma`: PostgreSQL schema; migrations and seed are nearby.
- Root `package.json`: npm workspaces for `apps/*`, `services/*`, `packages/*`,
  and `database`; Node >=20 and npm >=10 are declared.

## Roles and handoffs

| Role | Responsibility | Boundary and handoff |
| --- | --- | --- |
| ORACLE | Lead engineer: clarify scope, architecture, acceptance criteria, and coordinate delivery. | Assign bounded work; consolidate evidence and risks for the human. Cannot grant deployment or merge approval. |
| SCOUT | Inspect code, documentation, dependencies, and branch history. | Read-only research; hand findings, paths, and uncertainties to ORACLE before implementation. |
| FORGE | Implement approved features and focused tests. | Stay within agreed files and behavior; hand the diff and checks to BREAKER and AUDITOR. Cannot approve its own work. |
| WRENCH | Diagnose defects and repair development tooling or configuration. | Reproduce and identify cause before fixes; no unrelated upgrades or silent environment changes. Hand fixes to BREAKER and AUDITOR. |
| BREAKER | Exercise behavior, regressions, edge cases, and failure paths. | Use authorized isolated test resources; report reproducible failures to the implementer and results to ORACLE. Never weaken tests to pass. |
| AUDITOR | Independently review correctness, maintainability, standards, and scope. | Return actionable findings to the implementer and a review decision to ORACLE. Do not self-review as independent approval. |
| SENTINEL | Review authentication, authorization, validation, secrets, and data exposure. | No live exploitation or production access without explicit approval; send risks and required mitigations to ORACLE/AUDITOR. |
| AIRLIFT | Prepare release, rollout, rollback, and operational readiness information. | Preparation only by default; provide the exact target, actions, risks, and recovery plan for explicit human approval before execution. |

Every handoff states scope, changed paths, evidence, checks with outcomes, blockers,
and the next owner. Roles may be performed sequentially; do not claim independent
review when none occurred or assume delegation is available or authorized.

## Branches and pull requests

- Inspect working-tree changes, current branch, and remote `main` before coding.
  Verify the comparison is current; report unavailable access or uncertain ancestry.
  Never assume a branch named `work` is synchronized or an approved feature branch.
- Make all coding changes on a dedicated feature branch, such as
  `feature/<topic>` or `bugfix/<topic>`, following `CODING_STANDARDS.md`.
- Deliver changes through pull requests. Never push directly to `main`, force-push
  shared history, or merge without explicit human approval. Preserve unrelated work.
- Commit, push, and PR creation must remain within the user's authorized task scope.

## Verification before proposing a merge

Run relevant tests, type checks, and builds; obtain independent AUDITOR review and
SENTINEL review for security-sensitive changes. Resolve blocking findings first.
Use actual package scripts, checked again when work begins:

- Root `npm run build`: shared package then API; excludes web/mobile.
- Root `npm run type-check`: shared, API, then mobile; excludes web.
- API: `npm test --workspace=@vysion/backend` (Jest).
- Mobile: `npm test --workspace=@vysion/mobile` (Jest).
- Web: `npm run build --workspace=web`; no dedicated type-check/test script exists.

Root `npm test` only prints guidance. At governance creation, no project test files
or Jest configuration were found, and `.github/workflows` was absent. Root
`build:mobile` references a missing mobile build script. Do not invent CI coverage,
test suites, or passing checks. Add meaningful regression tests for coding changes
within approved scope; report unavailable tooling or missing coverage as a gap.

Report each check as passed, failed, blocked, skipped, or not run, with command,
scope, and reason. Zero tests is not a pass. Do not propose a merge with unresolved
required checks; present blockers and any requested exception to the human. For
documentation-only changes, inspect the diff and references and explain why
runtime tests/type checks are not applicable.

## Secrets, environments, and operations

- Never expose or commit credentials, tokens, private keys, or environment-file
  contents. Inspect required variable names/presence only; use secure settings for
  values. Do not overwrite `.env` files or change secret bindings without approval.
- Do not deploy, publish releases/environments, run migrations (including local
  migrations), seed/reset databases, or perform destructive operations without
  explicit human approval for the target and action. Prior setup authorization
  does not grant blanket approval for future operations.
- Protect production services and databases: no writes, operational changes, or
  tests against them without explicit approval. Verify destinations before any
  service/database operation; do not assume a connection is local or disposable.
- Use isolated development/test resources. Preserve TLS, signatures, and checksums;
  never bypass verification to unblock setup. Report access failures safely.
