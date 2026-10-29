# Football Professional Network Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a persistent mobile football professional network covering all five requested areas.
**Architecture:** Add relational models and shared contracts, authenticated network services/routes,
then integrate the mobile home with profile, organisation, feed, people, message and opportunity flows.
**Tech Stack:** Existing Expo/React Native, Express/TypeScript, Prisma/PostgreSQL, Zod, Jest.
**Spec:** docs/superpowers/specs/2026-10-29-football-network-design.md

## Global Constraints
Existing React Native/Expo, Express/TypeScript, shared Zod and Prisma/PostgreSQL stay.
No migrations, seeds, production writes or secret changes; prepare SQL for review only.
All network routes authenticate via existing Firebase middleware; actor comes from auth.
No AI analysis, deployment or merge. Media uses HTTPS links; do not fabricate activity.
Explicit safe projections exclude passwords, email, phone, documents and DOB.

## Review Focus
- Actor spoofing and outsider reads must be rejected by services and tests.
- Private profiles/media must not leak through nested posts, connections or messages.
- Pending/declined connections must not allow messaging; duplicates/self requests fail safely.
- Only organisation owners publish on its behalf; only publishers close opportunities.
- Invalid/unsafe URLs and closed/expired opportunities must not become actionable links.

### Task 1: Persistent network API and contracts
Files: database/prisma/schema.prisma, a new additive migration SQL;
packages/shared/src/network.ts and index export; services/api/src/network/*;
services/api/src/routes/index.ts; API tests/Jest configuration and docs/api/network.md.
Interfaces: /api/network exposes GET/PATCH /me, GET /profiles and /profiles/:id;
GET/POST /organisations, GET/PATCH /organisations/:id;
GET/POST /connections, PATCH /connections/:id;
GET/POST /connections/:id/messages; GET/POST /posts, DELETE /posts/:id;
GET/POST /opportunities, PATCH /opportunities/:id (close).
Use shared DTOs for mobile. Lists return {items, page, limit, hasMore} in standard data envelope.
- [x] Add failing schema/service/route tests for core happy paths and Review Focus.
- [x] Implement additive models, safe selectors and focused service/controller/routes.
- [x] Generate client without contacting database; validate schema and type-check/build.
- [x] Run API tests and document endpoints, migration requirement and results; commit.

### Task 2: Mobile network experience
Files: apps/mobile/src/screens/HomeScreen.tsx; src/screens/network/*;
src/services/NetworkService.ts; focused tests if new state/formatting logic needs them.
Consumes: shared DTOs and /api/network contract from task 1, existing apiClient auth.
Produces: accessible Feed, People, Organisations, Opportunities and Messages navigation;
self profile editing, profile detail/connect; accept/decline requests and connected chats;
post composer/delete; organisation create/edit/detail; opportunity create/detail/close.
- [x] Add failing tests for API client/query/form behavior where practical.
- [x] Implement real persistent flows and explicit empty/loading/error/retry states.
- [x] Type-check mobile; run test suite; export Expo web bundle as a compilation check.
- [x] Commit and provide report with manual-device verification limitations.

### Task 3: Independent review, verification and delivery
- [x] WRENCH repairs the confirmed mobile authentication bridge: Firebase signup/custom-token
  sign-in and Firebase-protected /users/me replace mobile calls to local-JWT endpoints.
  Keep legacy JWT endpoints intact and reproduce the mismatch with isolated regression tests.
- [x] BREAKER runs relevant build/type-check/test commands and inspects integration.
- [x] AUDITOR independently reviews whole diff; SENTINEL reviews auth/privacy and writes.
- [x] FORGE fixes blocking findings; reviewers verify corrections.
- [x] AIRLIFT documents exact migration/release/rollback steps without executing.
- [x] Commit, push feature branch and open PR with checks and remaining blockers.

Implementation/checklist complete at source level. Migration, live Firebase/PostgreSQL and device acceptance remain unexecuted; see docs/engineering/football-network-verification.md.
