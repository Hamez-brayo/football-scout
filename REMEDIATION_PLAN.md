| C1.2 | Web Session Alignment: Implement session exchange, backend JWT storage, AuthContext/session lifecycle, and API client refactor in web app | `apps/web/src/contexts/AuthContext.tsx`, `apps/web/src/lib/auth.ts`, `apps/web/src/lib/session.ts`, `apps/web/src/components/auth/SignInForm.tsx`, `SignUpForm.tsx` | Web app calls /auth/session after Firebase login, stores backend JWT, uses JWT for all protected API requests, and mirrors mobile session lifecycle | C1.1 | GitHub Copilot | Review | JWT expiry/refresh edge cases must be handled; ensure no Firebase tokens are sent to protected endpoints. | `remediation/auth-unification` |
# Remediation Plan - Tracked Execution Board

Date: 2026-03-17
Project: Vysion Analytics
Scope: Mobile auth/query architecture stabilization and production-readiness remediation
Status: Active execution board
Owner: Engineering

## Purpose
This document is a commit-ready execution board for remediation work. It is structured for ongoing updates during implementation and verification.

Primary goals:
- Unify authentication into one coherent production-ready model.
- Align mobile, backend, shared constants, and architecture documentation.
- Move the mobile data layer onto real React Query hooks.
- Preserve RHF + Zod form strengths while improving UX and consistency.
- Establish clear verification gates per phase.

## Recommended Direction
Use Firebase Auth as the identity and session source of truth for mobile.
The backend should verify Firebase ID tokens and return application user data.
Avoid running a second, parallel backend-JWT auth flow for the mobile app.

## Board Conventions
- Status values: `Todo`, `In Progress`, `Blocked`, `Review`, `Done`
- Owner: left blank for assignment
- Risk/Rollback Notes: left blank for live updates during execution

---

## Phase Overview

| Phase | Priority | Focus | Estimated Duration | Exit Criteria |
|---|---|---|---|---|
| Phase 1 | Critical | Auth unification and backend contract alignment | 2 to 4 days | One auth source of truth, stable session contract, manual auth flow passes |
| Phase 2 | High | React Query adoption and auth-cache integration | 1 to 2 days | Read operations moved to query hooks, logout/query lifecycle verified |
| Phase 3 | Medium | Shared constants, repo boundary cleanup, UI tokenization | 1 to 2 days | Constants aligned, token module introduced, docs updated |
| Phase 4 | Minor | UX polish, placeholder replacement, regression hardening | 1 day | Home screen proves post-auth live data and forms are refined |

---

## Phase 1: Critical

### Objective
Establish one coherent auth model and make the mobile/backend session contract correct and testable.

### Dependencies
- None. This phase must be completed before meaningful React Query adoption.

### Execution Board

| Task ID | Description | Affected Files | Expected Outcome | Dependencies | Owner | Status | Risk/Rollback Notes | Suggested Branch |
|---|---|---|---|---|---|---|---|---|
| C1 | Choose and enforce a single auth model (Firebase-first for mobile) | `apps/mobile/src/contexts/AuthContext.tsx`, `apps/mobile/src/services/AuthService.ts`, `services/api/src/routes/auth.ts`, `services/api/src/middleware/auth.ts`, `ARCHITECTURE.md` | Firebase is the only mobile auth/session authority; backend JWT mobile flow is removed or isolated | None | GitHub Copilot | In Progress | C1 refined to hybrid model (see C1.1); original pure Firebase-first API calls replaced. | `remediation/auth-unification` |
| C1.2-A | Web Foundation Refactor: Remove legacy auth, centralize API client and token management, prepare for session integration | `apps/web/src/lib/auth.ts`, `apps/web/src/lib/prisma.ts`, `apps/web/src/lib/apiClient.ts`, `apps/web/src/lib/token.ts`, `apps/web/src/contexts/AuthContext.tsx`, `apps/web/src/hooks/useProfile.ts`, `apps/web/src/hooks/useMedia.ts` | No NextAuth/Prisma code remains, all API calls use API client, token utility works, no Firebase tokens sent to backend | C1.1 | GitHub Copilot | In Progress | Must verify all fetches are replaced, no legacy code remains | `remediation/auth-unification` |
| C2 | Standardize auth response contract (`/auth/me`, verify/session endpoints) | `apps/mobile/src/api/auth.ts`, `services/api/src/routes/auth.ts` | Mobile/backend payloads are shape-compatible and typed consistently | C1 |  | Todo |  | `remediation/auth-unification` |
| C3 | Add Firebase persistence for React Native | `apps/mobile/src/config/firebase.ts`, `ARCHITECTURE.md` | Session survives cold restart using RN-compatible persistence | C1 |  | Todo |  | `remediation/auth-unification` |
| C4 | Wire backend auto-heal endpoint into mobile session sync | `apps/mobile/src/contexts/AuthContext.tsx`, `apps/mobile/src/services/AuthService.ts`, `services/api/src/routes/auth.ts` | Valid Firebase user with missing backend profile is reconciled, not forced-logout | C1, C2 |  | Todo |  | `remediation/auth-unification` |
| C5 | Centralize logout orchestration | `apps/mobile/src/services/AuthService.ts`, `apps/mobile/src/contexts/AuthContext.tsx`, optional backend signout route | One deterministic logout path clears session, headers, and cached app data | C1, C2 |  | Todo |  | `remediation/auth-unification` |
| C6 | Narrow AuthContext public surface | `apps/mobile/src/contexts/AuthContext.tsx`, `apps/mobile/src/hooks/useAuth.ts` | Context exposes app session state cleanly and hides unnecessary Firebase internals | C1, C5 |  | Todo |  | `remediation/auth-unification` |

### Implementation Notes

#### C1. Auth model unification
1. Declare Firebase Auth as the canonical mobile auth authority.
2. Keep backend verification of Firebase ID tokens.
3. Deprecate or isolate mobile usage of `/api/auth/register` and `/api/auth/login`.
4. Keep backend-local JWT flow only if explicitly needed by another client.
5. Update architecture docs accordingly.

Pseudo-flow:
```ts
Firebase signIn -> onIdTokenChanged -> getIdToken -> backend verify session -> receive app user
```

#### C2. Auth contract alignment
1. Define a canonical auth/session response type.
2. Make backend return that shape consistently from `/auth/verify-token` (or canonical equivalent) and `/auth/me`.
3. Update mobile parsing and TypeScript types.

Suggested type:
```ts
type SessionResponse = {
  success: boolean;
  data: {
    user: AuthUser;
    appToken?: string;
  };
  timestamp: string;
};
```

#### C3. React Native Firebase persistence
1. Replace plain `getAuth(app)` initialization with RN persistence setup.
2. Verify cold boot restores auth state.
3. Keep docs in sync with implementation.

Pseudo-code:
```ts
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

#### C4. Backend auto-heal integration
1. Rework `AuthService.getBackendUser` into a canonical session verify call.
2. Use backend verification endpoint after login and token refresh.
3. Remove forced logout fallback in backend-user-missing case.

#### C5. Logout centralization
1. One AuthService method should clear API auth header, clear cache, and sign out Firebase.
2. If signout/revocation endpoint is retained, call it from the same path.

#### C6. Context surface cleanup
1. Reduce public context to user/session/loading/actions.
2. Keep Firebase internals private unless explicitly required by UI.

### Verification Gate: Phase 1

Manual checks:
- Fresh install shows Login/Register.
- Register creates Firebase identity and backend app user.
- Login restores app user via backend verification.
- Cold restart restores session without manual re-login.
- Missing backend user auto-heals and does not force-logout.
- Logout returns to auth flow and clears protected state.

Automated checks:
- Unit: AuthService session verification logic, logout orchestration, response parsing guards.
- Integration: backend `/auth/verify-token`, `/auth/me`, backend user reconciliation flow.
- Mobile: AuthContext initialization and state transitions on login/logout/refresh.

Phase 1 exit criteria:
- Exactly one mobile auth model remains active.
- Mobile/backend auth payloads are aligned.
- Firebase persistence is enabled and verified.
- Missing backend user no longer causes forced logout.

---

## Phase 2: High

### Objective
Make React Query the real mobile data layer rather than just infrastructure.

### Dependencies
- Phase 1 complete (auth/session semantics must be stable first).

### Execution Board

| Task ID | Description | Affected Files | Expected Outcome | Dependencies | Owner | Status | Risk/Rollback Notes | Suggested Branch |
|---|---|---|---|---|---|---|---|---|
| H1 | Introduce concrete query hooks | `apps/mobile/src/hooks/queries/*`, `apps/mobile/src/services/UserService.ts`, `apps/mobile/src/services/AuthService.ts` | Backend reads are query-driven instead of ad hoc service calls from UI | Phase 1 |  | Todo |  | `remediation/react-query-adoption` |
| H2 | Tie query cache to auth lifecycle | `apps/mobile/src/contexts/AuthContext.tsx`, `apps/mobile/App.tsx`, `apps/mobile/src/hooks/queries/queryKeys.ts` | Cache lifecycle is predictable across login, refresh, and logout | H1 |  | Todo |  | `remediation/react-query-adoption` |
| H3 | Add mutation hooks for profile/session writes | `apps/mobile/src/hooks/queries/*`, `apps/mobile/src/services/UserService.ts` | Mutations invalidate/refresh caches correctly | H1 |  | Todo |  | `remediation/react-query-adoption` |
| H4 | Replace Home placeholder with query-driven shell | `apps/mobile/src/screens/HomeScreen.tsx` | First real post-auth screen proves query-driven authenticated data | H1, H2 |  | Todo |  | `remediation/react-query-adoption` |

### Implementation Notes

#### H1. Query hook foundation
1. Add `useCurrentUserQuery`.
2. Add `useProfileQuery`.
3. Keep service layer thin and side-effect free.
4. Use centralized `queryKeys.ts` keys.

Suggested files:
- `apps/mobile/src/hooks/queries/useCurrentUserQuery.ts`
- `apps/mobile/src/hooks/queries/useProfileQuery.ts`
- `apps/mobile/src/hooks/queries/useUpdateProfileMutation.ts`

Pseudo-code:
```ts
export function useCurrentUserQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => AuthService.getCurrentUser(),
    enabled,
  });
}
```

#### H2. Auth-cache integration
1. Prime or invalidate current-user query after successful session verification.
2. Clear entire cache on logout.
3. Ensure authenticated queries are disabled until session resolves.

#### H3. Mutation adoption
1. Add profile update mutation hook.
2. Invalidate profile and current-user keys after successful writes.
3. Normalize backend errors in mutation layer.

#### H4. Home shell hardening
1. Render current-user/profile data.
2. Handle loading and error states explicitly.
3. Keep one logout action and one backend-driven widget.

### Verification Gate: Phase 2

Manual checks:
- Login leads to Home with current-user/profile data.
- Re-open or refresh reproduces expected query loading behavior.
- Logout clears protected data immediately.
- Profile updates reflect after invalidation.

Automated checks:
- Hook tests: `useCurrentUserQuery`, `useProfileQuery`, profile mutation invalidation behavior.
- Integration tests: UserService profile endpoints.
- Screen tests: Home loading/error/success rendering.

Phase 2 exit criteria:
- Query hooks exist and are used by screens.
- Logout clears cache.
- Authenticated data is not fetched directly in UI components.

---

## Phase 3: Medium

### Objective
Clean repo boundaries, align shared contracts, and introduce tokenized UI foundations.

### Dependencies
- Phase 1 strongly recommended complete.
- Auth contract must be stable before shared constants alignment.

### Execution Board

| Task ID | Description | Affected Files | Expected Outcome | Dependencies | Owner | Status | Risk/Rollback Notes | Suggested Branch |
|---|---|---|---|---|---|---|---|---|
| M1 | Align shared API constants with backend routes | `packages/shared/src/constants/index.ts`, backend auth routes, mobile API/service files | Shared constants become canonical contract source | Phase 1 |  | Todo |  | `remediation/shared-contracts-and-ui-tokens` |
| M2 | Replace inline endpoint strings with shared constants | `apps/mobile/src/api/auth.ts`, `apps/mobile/src/services/UserService.ts` | Drift reduced and refactors safer | M1 |  | Todo |  | `remediation/shared-contracts-and-ui-tokens` |
| M3 | Introduce mobile design token module | `apps/mobile/src/components/ui/*`, new token file | Colors/spacing/type become centralized | None |  | Todo |  | `remediation/shared-contracts-and-ui-tokens` |
| M4 | Refactor UI components to consume tokens | `apps/mobile/src/components/ui/Button.tsx`, `Input.tsx`, `Typography.tsx`, `Container.tsx` | Styling consistency and maintainability improve | M3 |  | Todo |  | `remediation/shared-contracts-and-ui-tokens` |
| M5 | Update architecture docs and deprecate legacy references | `ARCHITECTURE.md`, related docs | Documentation matches implementation reality | Phase 1, M1 |  | Todo |  | `remediation/shared-contracts-and-ui-tokens` |

### Implementation Notes

#### M1. Shared constants alignment
1. Reconcile mismatched auth route constants.
2. Remove stale endpoint names.
3. Ensure constants and backend routes match exactly.

Examples to reconcile:
- `SIGN_IN`
- `VERIFY_TOKEN`
- `/signin` vs `/login`
- `/verify` vs `/verify-token`

#### M2. Inline endpoint replacement
1. Update mobile auth API wrapper to use shared constants.
2. Update UserService to use shared constants.
3. Add lightweight route-resolution tests where useful.

#### M3. Token module creation
1. Add `apps/mobile/src/theme/tokens.ts`.
2. Define semantic colors, spacing, radius, and type scales.
3. Keep token names semantic, not literal.

Pseudo-code:
```ts
export const colors = {
  surface: '#ffffff',
  textPrimary: '#0f172a',
  textMuted: '#64748b',
  primary: '#1e40af',
  danger: '#ef4444',
};
```

#### M4. UI component token migration
1. Move hardcoded values out of Button/Input/Typography/Container.
2. Ensure accessibility behavior remains unchanged.

#### M5. Documentation alignment
1. Rewrite auth flow section to match final implementation.
2. Remove contradictory token storage/session claims.
3. Document query-hook architecture and shared constants usage.

### Verification Gate: Phase 3

Manual checks:
- Shared constants resolve to correct backend routes.
- UI appears visually unchanged after token refactor.
- Documentation is consistent and understandable.

Automated checks:
- Unit tests for shared constant consumers where added.
- Component snapshot/behavior tests for tokenized UI components.
- Full monorepo type-check after migration.

Phase 3 exit criteria:
- Shared constants are authoritative and consumed.
- UI token module exists and components use it.
- Architecture docs match implementation.

---

## Phase 4: Minor

### Objective
Polish UX, replace remaining placeholders, and harden release validation.

### Dependencies
- Phase 1 and Phase 2 should be complete.
- Phase 3 recommended for consistency.

### Execution Board

| Task ID | Description | Affected Files | Expected Outcome | Dependencies | Owner | Status | Risk/Rollback Notes | Suggested Branch |
|---|---|---|---|---|---|---|---|---|
| N1 | Improve auth form UX polish | `apps/mobile/src/screens/LoginScreen.tsx`, `RegisterScreen.tsx` | Better autofill, keyboard flow, and error handling | Phase 1 |  | Todo |  | `remediation/polish-and-release-gates` |
| N2 | Replace Home placeholder with lightweight dashboard shell | `apps/mobile/src/screens/HomeScreen.tsx` | Post-auth UX feels real and validates live data behavior | Phase 2 |  | Todo |  | `remediation/polish-and-release-gates` |
| N3 | Clean minor public API redundancy | `apps/mobile/src/hooks/useAuth.ts`, `apps/mobile/src/contexts/AuthContext.tsx` | Smaller, cleaner import surface | Phase 1 |  | Todo |  | `remediation/polish-and-release-gates` |
| N4 | Add regression checklist and release gate notes | Docs/tests | Stronger confidence before multi-user rollout | All prior phases |  | Todo |  | `remediation/polish-and-release-gates` |

### Implementation Notes

#### N1. Form UX improvements
1. Add autofill hints.
2. Add keyboard next/submit behavior.
3. Normalize server-side field errors.
4. Improve loading/error accessibility messaging.

#### N2. Home shell completion
1. Show signed-in identity/profile summary.
2. Add one or two backend-driven widgets.
3. Validate logout path from real shell.

#### N3. API surface cleanup
1. Pick one public import path for `useAuth`.
2. Remove redundant public re-export pattern.

#### N4. Regression and release gates
1. Document manual smoke test cases.
2. Add release verification notes.
3. Ensure auth lifecycle edge cases are explicitly covered.

### Verification Gate: Phase 4

Manual checks:
- Form interactions are smooth with keyboard and validation.
- Home reflects live session/data state.
- Repeated login/logout cycles remain stable.

Automated checks:
- Form screen tests.
- Component behavior tests for refined interactions.
- End-to-end smoke test if infra is available.

Phase 4 exit criteria:
- Forms are polished.
- Home is no longer placeholder-only.
- Final release checklist and gates exist.

---

## Dependency Graph

```text
C1 Auth model decision
 -> C2 Response contract alignment
 -> C3 Firebase persistence
 -> C4 Backend auto-heal session sync
 -> C5 Centralized logout
 -> C6 Narrow AuthContext

Phase 1 complete
 -> H1 Query hooks
 -> H2 Auth-cache lifecycle integration
 -> H3 Mutation hooks
 -> H4 Query-driven Home screen

Phase 1 + stable routes
 -> M1 Shared constants alignment
 -> M2 Replace inline endpoints

M3 Token module
 -> M4 UI token refactor

Phase 1 + M1
 -> M5 Architecture doc update

Phase 2
 -> N2 Real Home screen
```

---

## Testing Matrix

| Area | Manual Test | Automated Test |
|---|---|---|
| Auth startup | Cold launch restores session correctly | AuthContext initialization unit test |
| Auth login | Login creates valid session and app user | AuthService integration/unit tests |
| Auth register | Register creates Firebase identity and backend user | Backend auth route integration tests |
| Auth recovery | Missing backend user auto-heals | Backend verify-token integration test |
| Logout | Clears session, headers, and protected UI | Auth/logout orchestration test |
| React Query current user | Home renders current user from query | Query hook test |
| React Query profile | Profile query loads and refreshes properly | Query + UserService integration test |
| Forms | Validation and keyboard behavior work | Screen/component tests |
| Shared constants | Endpoints resolve to live routes | Type and usage verification |
| UI tokenization | Visual consistency remains intact | Component snapshot/visual regression if available |

---

## Full Production Readiness Checklist

### Auth Unification
- [ ] One mobile auth source of truth selected and enforced
- [ ] Firebase persistence configured for React Native
- [ ] Backend session verification endpoint is canonical
- [ ] `/auth/me` or equivalent response shape matches mobile expectations
- [ ] Missing backend user reconciles automatically
- [ ] Logout is centralized and deterministic

### Query Adoption
- [ ] QueryClient is actively used by data screens
- [ ] Current-user query exists
- [ ] Profile query exists
- [ ] Mutation hooks invalidate related caches correctly
- [ ] Logout clears cache and prevents stale protected data

### Backend Contract Alignment
- [ ] Shared constants match backend routes
- [ ] Mobile services consume shared constants
- [ ] Backend and mobile auth flows are documented consistently
- [ ] No parallel conflicting auth path remains for mobile

### Forms and UI Tokenization
- [ ] Login/Register remain RHF + Zod based
- [ ] UX refinements are applied
- [ ] Button/Input/Typography/Container use centralized tokens
- [ ] Accessibility props remain present after refactor

### Home Screen Post-Auth Verification
- [ ] Home is query-driven, not placeholder-only
- [ ] Home renders authenticated user/session data
- [ ] Home proves end-to-end auth + query architecture

---

## Suggested Branch Strategy
- Branch 1: `remediation/auth-unification`
- Branch 2: `remediation/react-query-adoption`
- Branch 3: `remediation/shared-contracts-and-ui-tokens`
- Branch 4: `remediation/polish-and-release-gates`

This sequencing reduces merge risk by stabilizing contracts before UI and polish work.

---

## Next Session Start Point
- Start with Phase 1, Task C1.
- Do not begin React Query hooks before auth contract unification.
- Update architecture docs within the same phase as auth contract changes.
- Treat shared constants as contract-critical, not optional cleanup.
