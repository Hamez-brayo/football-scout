# Football network API

Base `/api/network`. Every request requires `Authorization: Bearer <Firebase ID token>`.
The actor is the authenticated internal User `id`; external Firebase `userId` is never a network ID.
Responses: `{success:true,data:...,timestamp:ISO}`; failures use existing `{success:false,error:{code,message},timestamp}`.
Zod failures are 400; unauthenticated 401; forbidden transitions/ownership 403; invisible/missing profile 404;
duplicate connection (including reverse direction) 409. Unknown input keys are rejected.

Shared DTOs and request schemas are exported by `@vysion/shared` from `network.ts`.
All list endpoints return `data:{items,page,limit,hasMore}`. Query `page` defaults to 1 (max 10000),
`limit` defaults to 20 (max 100). Newest first, with ID tie breaker. Messages are newest first too.

| Method/path | Request | data |
| --- | --- | --- |
| GET /me | — | NetworkProfile |
| PATCH /me | NetworkProfileInput | NetworkProfile |
| GET /profiles | optional `search` (max 120), page/limit | page of NetworkProfile |
| GET /profiles/:id | — | NetworkProfile |
| GET /organisations | page/limit | page of NetworkOrganisation |
| POST /organisations | NetworkOrganisationInput | NetworkOrganisation (201) |
| GET /organisations/:id | — | NetworkOrganisation |
| PATCH /organisations/:id | partial NetworkOrganisationInput | NetworkOrganisation |
| PATCH /organisations/:id/membership | `{joined:boolean}` (self only) | NetworkOrganisation |
| GET /connections | page/limit | page of NetworkConnection |
| POST /connections | `{recipientId}` | `{id,requesterId,recipientId,status,createdAt}` (201) |
| PATCH /connections/:id | `{status:'ACCEPTED'|'DECLINED'}` | `{id,status}` |
| GET /connections/:id/messages | page/limit | page of NetworkMessage |
| POST /connections/:id/messages | `{body}` (1–2000) | NetworkMessage (201) |
| GET /posts | page/limit | page of NetworkPost |
| POST /posts | NetworkPostInput | NetworkPost (201) |
| DELETE /posts/:id | — | `{id}` |
| GET /opportunities | page/limit | page of NetworkOpportunity |
| POST /opportunities | NetworkOpportunityInput | `{id}` (201; refresh list) |
| PATCH /opportunities/:id | `{status:'CLOSED'}` | `{id,status,actionable:false,applicationUrl:null}` |

Profile fields: firstName, lastName, headline, biography, expertise[], currentLocation, position,
currentClub, profilePhoto (HTTPS/null), videos[] (HTTPS), userType (TALENT/SCOUT/COACH/AGENT/CLUB).
Optional `football:{primaryPosition,currentClub,previousClubs[],achievements:[{title,description?}]}`.
Achievements in PATCH replace the achievement list; omitted fields remain unchanged.
Organisation: `{name,type:'CLUB'|'AGENCY',description?,location?,website?}`; nullable optional fields
can be cleared. Owner is always server assigned and immutable; page ownership is not verified affiliation. Members may self join/leave via the membership endpoint;
member profiles are bounded to 50 on the page and do not confer edit/publish authority.
Post: `{body,category,mediaUrl?}`. Categories MATCH_FOOTAGE, TRAINING, ACHIEVEMENT, TEAM_UPDATE, RECRUITMENT.
Opportunity: `{title,type,description,requirements,location,applicationUrl,expiresAt,organisationId?}`.
Types TRIAL, PLAYER_RECRUITMENT, REPRESENTATION, FOOTBALL_JOB. Expiry must be a future ISO datetime.

Only recipient can accept/decline a pending connection. Declined connections cannot be re-requested
in this version. A unique canonical unordered pair prevents concurrent/reverse duplicates.
Messages are available only to accepted connection participants. Only authors delete posts.
Only organisation owners edit pages/publish on their behalf; publisher or organisation owner can close.

Profile projections exclude password, email, phone, contact info, documents, Firebase ID and DOB.
Private profiles are hidden from discovery/detail and nested profiles become null. Media-private
profiles have videos cleared and profilePhoto null. Posts by private profiles are excluded; private
media URLs are redacted. Opportunity publisher and organisation owner projections follow the same rules.
Closed/expired opportunities remain visible for context with `actionable:false` and `applicationUrl:null`;
the UI must only enable an application action when actionable and a URL is present. All submitted links
must use HTTPS without embedded credentials. No file uploads, AI or realtime transport is included.

Migration SQL is prepared under `database/prisma/migrations/202610290001_football_network/`.
It has NOT been applied. Explicit target approval, backup and migration review are required before running
it. No seeds or production access were performed. Existing installations must migrate before these
endpoints are enabled. API tests mock persistence and do not prove a PostgreSQL migration round trip.

Legacy privacy hardening: `/api/players/search`, `/api/players/:id` and stats now exclude private
profiles and return safe profile projections; private media is hidden. `/api/users/:id` uses the
same public projection. Own legacy user/player responses preserve existing fields but omit password.
These are intentional response-shape reductions; clients must not rely on sensitive public fields.
