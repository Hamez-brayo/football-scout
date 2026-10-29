# Vysion interactive UI — first increment

This increment builds on merged PR #6. The mobile app is the professional football
network client; it uses React Navigation, not Expo Router. The separate Next.js
application is not the preview target. The original design screenshot was not
found in the checkout; this visual direction does not claim to reproduce it.

## Screen architecture

- Persistent primary destinations: Feed, Network, Opportunities, Messages.
- Profile editing and public profile are available from the header.
- Clubs & agencies open organisation discovery, detail, membership and opportunities.
- Network opens people discovery and professional profiles; connection requests and
  accepted conversations are handled by Messages.
- Authentication remains outside protected Home navigation.

## Install

Use Node >=20 and npm >=10. From the repository root:

```bash
npm ci
npm run db:generate
npm run build:shared
```

`db:generate` generates the Prisma client; it does not apply schema changes.
Configure a disposable development PostgreSQL database and a dedicated Firebase
project with Email/Password authentication enabled. The existing migration under
`database/prisma/migrations/202610290001_football_network` is required for network
storage. Review the target and migration before applying it yourself. No migration,
seed, production write or deployment was performed in this increment.

Copy `services/api/.env.example` to `services/api/.env` only if no file exists.
Set `DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`,
`FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET`, `NODE_ENV=development`,
`HOST=0.0.0.0`, `PORT=3002`. Keep Firebase Admin credentials server-side.
Set `CORS_ORIGINS=http://localhost:8081,http://127.0.0.1:8081` for local web;
add the exact browser LAN origin if opening it on another device. Do not use `*`.
Set a strong random `JWT_SECRET`; production rejects values shorter than 32 characters.

Copy `apps/mobile/.env.example` to `apps/mobile/.env` only if no file exists.
Set the public Firebase client configuration for the same development project:
`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`,
`FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`.
These values are bundled into the client; never put Firebase Admin keys there.
Set `API_URL=http://localhost:3002/api` for the local browser. For a phone use
`API_URL=http://<computer-LAN-IP>:3002/api`. Restart Expo after configuration changes.
Omitting API_URL uses Expo private-LAN detection, then localhost. `API_TIMEOUT` in
the older example is not consumed. Explicit URLs reject credentials, query strings
and fragments. Use HTTPS for a hosted development API.

## Launch the real application

Terminal 1, repository root:

```bash
npm run dev:backend
```

Terminal 2, repository root, browser preview:

```bash
npm run web --workspace=@vysion/mobile -- --port 8081
```

Open `http://localhost:8081`. For Expo Go on a compatible SDK 54 client:

```bash
npm run start --workspace=@vysion/mobile -- --lan
```

Scan the printed QR code. The phone and computer need network reachability;
localhost on a phone means the phone itself. Expo's tunnel tunnels Metro, not the
API. A compatible Expo Go version or development build is required; physical
Android/iOS acceptance has not been performed. No EAS build was submitted.

## Safe account creation and manual journeys

The existing database seed does not create Firebase passwords and is not a set
of usable login accounts. Register dedicated development emails through the app,
using a password of at least six characters. Choose Player/Talent, Scout, Coach,
Agent or Club. Use at least two accounts for networking tests.

1. Register account A and edit the profile. Add headline, location, expertise,
   previous clubs, achievements and HTTPS highlights. Save and reload.
2. Sign out; verify Home cannot be accessed. Sign back in and verify own data.
3. Register account B with another role. Search for A by name/headline; view A's
   public profile and send a connection request.
4. As A, accept the request in Messages. Exchange text with B and manually refresh.
5. Publish an update, confirm it appears after reload and delete your own post.
6. Create a club/agency page. Join/leave it, inspect members, and publish an
   organisation opportunity. Confirm only that organisation's opportunities appear.
7. Open an opportunity and use its external application link. This does not
   create an in-app application record.
8. Restart the app and check session restoration; disconnect the API and verify
   errors/retry rather than successful-looking writes. Test 390px and wide layouts.

Record platform, role, steps, expected/actual result, screen and API status when
reporting a bug. Do not include tokens or credentials.

## Feature status

“API implemented” means source and isolated tests exist, not live acceptance.
No fixture interaction is evidence of a successful database write.

| Area | Status in this increment | Limits |
| --- | --- | --- |
| Shell/navigation/design | Implemented | Navy/emerald identity; original screenshot unavailable |
| Authentication | Firebase/backend bridge implemented and audited | Live project/device acceptance pending; see verification report |
| Role selection | Implemented at registration/edit | Roles self-declared; no guided onboarding gate |
| Profiles | API read/edit + improved summary | No credential verification, career timeline or completion indicator |
| Feed | API publish/list/delete own post | Chronological, not personalised; HTTPS media links, no inline upload/player |
| Likes/comments/shares/saves | Missing | No simulated successful engagement controls |
| People discovery | API name/headline search + connect | Role/position/location filters and recommendations missing |
| Connections | Request/accept/decline implemented | Declined requests cannot yet be sent again |
| Organisations | API create/edit, members, scoped opportunities | Membership is self-declared; following missing |
| Opportunities | API publish/detail/close + external application link | No persisted in-app applications |
| Messages | API text for accepted connections | Manual refresh; no real-time delivery/read receipts |
| Notifications | Missing | No fake notification count |
| Fixture preview | Separate test-only UI harness | In-memory fixtures; no Firebase, backend or database |
| Full end-to-end validation | Incomplete | Browser fixtures and isolated tests are not live Firebase/Postgres E2E |
| AI video analysis | Deferred | Outside this increment |

## Next increments

Add persisted post engagement and following with schema/authorization tests, then
notifications, role/position/location discovery filters and guided profile onboarding.
Perform live acceptance against approved isolated Firebase/PostgreSQL resources
before calling any of these flows production-ready. Keep delivery through reviewed
feature PRs; do not merge this increment automatically.

## Explore the UI without configuring services

The fixture preview bundles the actual HomeScreen with test-only API/auth modules.
It is separate from the production Expo entry and never contacts Firebase or a
live backend. Synthetic accounts, connections and posts are labelled on screen.
Changes are kept in memory and reset when the page reloads. This preview cannot
validate registration, session restoration or database persistence.

```bash
node scripts/ui-smoke.mjs --serve
```

Open `http://127.0.0.1:8090`; stop with Ctrl+C. Try publishing a post, searching
people, editing a profile, opening club opportunities and sending a message.
The fixture's sign-out action displays an explicit test-session error; test actual logout in Expo.

For automated browser smoke checks and screenshots:

```bash
npx playwright install chromium
node scripts/ui-smoke.mjs
```

This checks the rendered HomeScreen at desktop and 390px widths using fixture
responses. Browser installation was blocked in this execution environment by a
truncated/non-ZIP CDN download. Therefore browser assertions and screenshots were
not executed/captured here; do not interpret the presence of the test script as
passing browser evidence. The fixture bundle and localhost server were checked.
