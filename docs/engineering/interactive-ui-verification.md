# Interactive UI increment — verification and remaining limits

## Authentication changes

- API URL config is honored; LAN detection remains available when unset.
- Native Firebase initialization explicitly uses AsyncStorage persistence; browser
  initialization remains separate. Native and web bundle compilation are checked,
  but physical-device cold-start restoration is not established by compilation.
- Sign-out token revocation requires authentication and uses the verified Firebase
  UID, not an arbitrary body userId.
- Production rejects absent/short legacy JWT secrets. Development CORS defaults
  include Expo web 8081; explicit CORS_ORIGINS still override defaults.
- Temporary backend failures retain a previously confirmed session and mounted
  screen/drafts. Initial sync failure stays outside protected Home and exposes
  Retry session/Return to sign in. Invalid/disabled identities are rejected.
- Registration still spans Firebase and PostgreSQL without cross-system rollback;
  partial-account recovery remains an outstanding issue.

## Evidence

Final commands and review status are recorded in the PR. Unit/regression tests
replace external Firebase/database dependencies; they are not full live E2E tests.
The test-only browser bundle replaces auth and network modules at esbuild time,
without adding a production authentication bypass.

No live credentials were inspected. No database migration, seed, destructive
operation, live account creation, deployment or merge was executed.

Screenshots and browser-rendered assertions are blocked by unavailable Chromium;
standard Playwright browser download failed with truncated/non-ZIP data. The
interactive fixture server is available as a reproducible local command, not a
hosted preview. Expo Go/device and live Firebase/PostgreSQL journeys remain
unverified. The separate Next.js application was not changed or built; its older
React dependency is not evidence of a reproduced Expo preview conflict.

## Acceptance still required

Follow interactive-ui-preview.md with dedicated development resources. Confirm
registration, persistence after restart, two-account connection/message flow,
private profile access, failure/retry and save/reload against the real database.
A live-resource acceptance result must name the test target without exposing secrets.

## Executed checks (29 October 2026)

| Command / review | Outcome | Scope |
| --- | --- | --- |
| `npm ci --ignore-scripts` | Passed | Locked dependency installation; no install hooks |
| `npm ci --ignore-scripts --dry-run` | Passed | Final harness manifest/lock compatibility |
| `npm run db:generate` | Passed | Prisma generation only, no DB operation |
| `npm test --workspace=@vysion/backend -- --runInBand` | Passed | 6 suites, 48 tests |
| `npm test --workspace=@vysion/mobile -- --runInBand` | Passed | 7 suites, 40 tests |
| `npm run build` | Passed | Shared package and API; excludes Next/mobile |
| `npm run type-check` | Passed | Shared, API and mobile, including fixture sources |
| `npx expo export --platform web --platform android --output-dir /tmp/vysion-final-export` | Passed | Both Expo bundles; no runtime/device acceptance implied |
| `node scripts/ui-smoke.mjs --serve` | Passed | Bundle + self-request HTTP 200/banner; no browser assertions |
| `node scripts/ui-smoke.mjs` | Blocked | Missing Chromium; no completed browser checks |
| `git diff --check` | Passed | Whitespace/conflict check |
| Independent AUDITOR/SENTINEL review | Passed at source level | Two blocking auth findings fixed and rechecked |
| Live Firebase/PostgreSQL/device E2E | Not run | No approved configured isolated runtime targets |
| Next.js app build | Not run | Separate app unchanged; Expo used for preview |

Expected warning output: npm proxy-config deprecation, Prisma preview-feature rename,
Expo NO_COLOR/FORCE_COLOR warnings, and the API negative-validation test logger.
No warning was counted as a failed test or suppressed to fabricate a pass.
