# Football network implementation and verification

## Delivered behavior

The mobile app now provides Feed, People, Organisations, Opportunities and Messages,
plus professional profile editing. Football profiles include position, existing
structured experience, club history, achievements, expertise and footage links.
Organisation pages show self-declared members and a server-paginated list of that
organisation's opportunities. Accepted connections can exchange text messages.

The Firebase mobile bridge uses server-side signup and custom-token exchange, then
Firebase-protected own-profile lookup. Logout/account-switch guards reject stale
responses; same-account refresh preserves the mounted navigation and drafts.
Forms lock edits during submission and retain drafts on failure. Membership actions
consume the returned page so displayed members reflect the completed change.

The database migration is additive and prepared only. AI assessment and hosted media
uploads remain future work; footage uses validated HTTPS links. Roles and affiliation
are self-declared, and ownership is not a verified professional credential.

## Checks

| Command or review | Scope | Outcome |
| --- | --- | --- |
| `npm run type-check` | Shared contracts, API, mobile | Passed |
| `npm run build` | Shared output and API | Passed |
| `npm test --workspace=@vysion/backend -- --runInBand` | 4 suites, 31 tests | Passed |
| `npm test --workspace=@vysion/mobile -- --runInBand` | 5 suites, 20 tests | Passed |
| `npx expo export --platform web` | Mobile web bundle compilation | Passed |
| Prisma client generation and schema validation | Additive schema; no database connection | Passed |
| `git diff --check` | Whitespace/conflict formatting | Passed |
| Independent AUDITOR | Whole change, followed by scoped fixes | Passed; all six final findings addressed |
| Independent SENTINEL | Authentication, authorization, privacy and final fixes | No blocking source finding |
| Live PostgreSQL migration/round trip | No approved database target | Not run |
| Live Firebase and physical-device acceptance | No approved runtime test setup | Not run |
| Web application build | Existing web app not changed | Not run |
| Deployment or merge | Separate approval required | Not performed |

Tests isolate Firebase and persistence. Mobile tests exercise contracts and component
handlers, not a full native renderer. A successful Expo web export demonstrates
compilation; it does not establish a working native session or PostgreSQL migration.
Expected test/tooling output includes the existing negative-validation warning log,
npm proxy-configuration deprecation warning and Expo color-environment warning.

## Review fixes

Independent review resulted in private-owner write-response and statistics fixes,
name consistency, membership/privacy regression coverage, the mobile authentication
bridge repair, same-user refresh preservation, organisation-scoped opportunities,
structured experience support, pending-draft protection, member-list refresh and
search wording aligned with supported name/headline matching.

## Implementation decisions

- Retain the existing mobile, API, shared-contract and relational database stack;
  this avoids a separate application rewrite.
- Use a dedicated feature branch and a draft PR; no merge or deployment is implied.
- Extend legacy public profile protections so old routes cannot bypass network privacy.
- Retain existing Firebase identity and repair the mismatched client endpoints;
  existing local-JWT routes are preserved, without automatic email-based account linking.
- Use HTTPS footage links and refresh-on-demand messages initially; hosted uploads
  and real-time delivery require subsequent work.
- Prepare migration SQL without applying it. Apply only after target-specific review.
- Keep the fun community ideas in ROADMAP.md as proposals for the next design pass.

## Remaining limits

Existing signup can leave a partial account if a later cross-system step fails;
recovery and historical identity repair are separate work. A declined connection
cannot currently be requested again. Organisation pages show up to 50 visible members;
absence from that projection does not prove nonmembership. Offset lists can shift
under concurrent inserts. Blocking/reporting/moderation, credential verification,
push delivery, hosted media, Academy and AI are not included in this implementation.

Use [the rollout and recovery guide](football-network-release.md) for staging and
device acceptance before considering a release.
