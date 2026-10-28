# Vysion development roadmap

## Current direction: a professional network for football

The next release connects players, scouts, coaches, agents and clubs through five
areas: football profiles, club/agency pages, connections and messaging, a football
feed, and opportunities. AI video assessment is deferred.

Implementation details: [network design](docs/superpowers/specs/2026-10-29-football-network-design.md)
and [API contract](docs/api/network.md).

## Release gates

- Review the prepared additive schema migration and approve its database target.
- Apply and verify it in approved staging; preserve existing profile records.
- Complete authenticated multi-account acceptance checks on a device.
- Review private-profile, organisation ownership and messaging access boundaries.
- Approve deployment and merge separately after required checks are complete.

See [rollout, acceptance and recovery](docs/engineering/football-network-release.md).
Source changes do not mean the feature has been deployed or the migration applied.

## After the first network release

- Shareable football profile cards with a member's position, club and chosen clip.
- Matchday updates for goals, assists, debuts and team moments; self-reported stats
  remain visibly labelled.
- Teammate endorsements for qualities such as vision, work rate and leadership,
  attributed to the endorser and distinct from verified assessments.
- An "Open to" status for trials, representation, teams and football work.
- Member reporting, blocking, moderation and account safety tooling.
- Verified club/agency affiliations and professional credentials.
- Hosted media uploads and playback.
- Improved search, discovery and relevant feed ranking.
- Message notifications and real-time delivery.
- Academy learning resources and individual practice sessions.
- Prescribed drills, progress tracking and validated AI video analysis.

Future items require separate scope and design decisions. Existing web pages are
not the primary client for this mobile-first implementation.

The social additions above are a proposed shortlist following JB's request for fun
features; they are not included in the current network implementation.
