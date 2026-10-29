# Football network rollout and verification

## Scope
This change introduces a football professional network in the existing mobile app
and Express API. AI video analysis, Academy, media hosting and web redesign remain
future work. Linked footage is supplied by members; a page or role is not verified
representation or verified affiliation.

## Approval boundary
AIRLIFT preparation only. No migration, seed, deployment, production access or merge
is authorized by preparing this document. Obtain explicit approval naming the database
and release target before executing the corresponding operation.

## Before rollout
1. Review the feature branch and PR, including independent AUDITOR and SENTINEL findings.
2. Confirm the destination database and API/mobile environments without disclosing secrets.
3. Back up the database and verify restore procedures. Check existing migration history.
4. Review the added SQL against the live schema; existing profile data must be retained.
5. In an approved isolated staging environment, apply the prepared migration using
   `npm run migrate:deploy --workspace=@vysion/database`.
6. Generate the Prisma client using `npm run db:generate`, then build using
   `npm run build` and type-check using `npm run type-check`.
7. Run API and mobile test suites using their workspace scripts. A mocked service test
   does not establish a working PostgreSQL migration or authenticated device flow.
8. Run the manual checks below against staging with dedicated test accounts.
9. Deploy API/mobile together after approval; old API binaries must not receive new
   role values before their compatibility has been checked.

## Manual acceptance checks
Use two consenting test accounts and an unrelated third account, plus a club/agency page.

| Area | Check |
| --- | --- |
| Profiles | Edit headline, bio, expertise and football information; reload and confirm persistence. Search by name/headline. |
| Privacy | Confirm private profile/media settings hide the information from other users and nested responses. Inspect responses for password/contact/document leakage. |
| Organisations | Create club and agency pages; reload detail and edit as owner. Confirm other accounts cannot edit or publish as that page. |
| Connections | Send request, confirm incoming/outgoing state; accept and decline as recipient. Confirm sender/outsider cannot accept. Reject self/duplicate requests. |
| Messages | Reject sending before acceptance; after acceptance exchange messages and reload. Confirm unrelated account cannot read or send. |
| Feed | Publish text and a valid HTTPS footage link; reload feed and open author profile. Delete own post; reject deletion by another member. |
| Opportunities | Publish each type, inspect requirements/location/application link, close as publisher. Reject closing/publishing on behalf of others. Confirm expired/closed listings cannot be applied to. |
| Mobile | Check loading, empty, retry, mutation failure, back navigation, pagination, keyboard and narrow-device layouts. |
| Session | Sign out and sign in as another account; confirm no previous account's private state remains. |

## Recovery
If a rollout fails, stop further publishing and restore the prior application release
only after checking its behavior with the additive schema and new role values. Preserve
new member data. Do not automatically drop tables or remove enum values to roll back.
Database restore or a corrective migration requires a separately reviewed plan and
approval. Communicate the affected target, exact action and recovery consequences.

## Known verification limits
No database migrations or seeds were executed during implementation. Live PostgreSQL,
Firebase identities and a signed-in physical-device acceptance run require an approved
test environment. Compilation and mocked unit/HTTP tests are reported separately.
