# Football professional network

## Intent and authorization
Implement JB's requested first version of Vysion as a professional network for football:
profiles, club/agency pages, connections and messaging, a football feed, and opportunities.
The user explicitly requested implementation and assignment of AGENTS.md roles after
choosing this direction. Proceed using the existing mobile/API stack; no further product
discovery gate is imposed on that instruction.

## Behavior
- Keep TALENT compatible; add SCOUT and COACH alongside AGENT and CLUB.
- Professional profiles include headline, biography, expertise, existing football history,
  achievements and footage links. Members can edit their own profile and discover others.
- Club and agency pages are independent organisations with an owner, description, location,
  website and member links. Owner can edit the page; any authenticated member can create
  a page, which is not a claim of verified affiliation.
- Members send connection requests; only recipients accept/decline. Accepted connections
  can exchange text messages. Outsiders cannot read or send messages in another connection.
- Chronological feed supports text and optional footage/image HTTPS links, categories for
  match footage, training, achievement, team update and recruitment. Authors can delete posts.
- Opportunity board supports trials, player recruitment, representation and football jobs.
  Members may publish individually; organisation publishing requires ownership. Publisher
  may close an opportunity. Open detail includes requirements, location and an HTTPS
  application link; expired/closed opportunities are not offered as actionable openings.
- Mobile replaces placeholder Home with authenticated network navigation and real API
  interactions, loading/error/retry/empty states, forms and usable profile/details screens.

## Constraints
Existing React Native/Expo, Express/TypeScript, shared Zod and Prisma/PostgreSQL stay.
No AI analysis, new media hosting, payments, push notifications, real-time transport,
recommendation algorithm, Academy implementation, web redesign, deployment or merge.
Media uses HTTPS links; messaging refreshes on demand. Do not fabricate activity.
All network routes authenticate via existing Firebase middleware; actor comes from auth.
Explicit safe profile projections exclude passwords, email, phone, documents and DOB.
Respect private profile/media settings. Do not introduce unbounded lists or unsafe URLs.
No migrations, seeds, production writes or secret changes; prepare SQL for review only.

## Approach
Chosen: additive relational models plus a dedicated /api/network REST namespace and mobile
screens using the existing authenticated client. This supports persistent functionality
without replacing working auth or redesigning unrelated applications.
Alternatives: cosmetic mock screens would not implement the requested behavior; a full
rewrite with real-time messaging would add unnecessary infrastructure and migration risk.

## Delivery and roles
ORACLE coordinates. SCOUT inspects. FORGE implements database/contracts/API, then mobile.
BREAKER verifies tests and integration. AUDITOR reviews code independently; SENTINEL
reviews authorization and exposure. AIRLIFT prepares migration/rollout/rollback notes.
Dedicated feature branch, reviewable PR, no merge or deployment.
