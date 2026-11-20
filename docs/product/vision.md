# Vysion product vision

**Strategic checkpoint · 10 November 2026 · Owner: ORACLE**

**Train → Improve → Demonstrate → Get Discovered → Connect → Progress**

A grassroots winger should be able to practise a drill, see how their own performance changes, choose a clip to show alongside match footage, and let an interested scout follow up about a trial. Each step should use the same player identity. Players decide which evidence travels from private training into discovery.

> A footballer's financial circumstances should never determine whether their talent deserves to be seen.

A free player must be able to build a visible portfolio, appear in relevant searches, share evidence and pursue meaningful opportunities. Buying coaching or advanced analysis must never buy search priority, trial eligibility or preferred placement. A player without an assessed clip remains discoverable through football history and match footage. Scouts retain room for football judgment.

## What informs the direction

AIM Football describes a practice loop built around phone-recorded drills, feedback, levels and challenges. For Vysion, the useful pattern is returning a player to practice with a specific observation and a comparable previous attempt. [AIM Football developer listing](https://play.google.com/store/apps/details?id=com.aimreltechnology.aim)

AiSCOUT connects a player profile and drill submission to a club trial and scout feedback. For Vysion, evidence should keep its drill and recording context when a player shares it for an opportunity. These public descriptions establish reference journeys. They provide no independent accuracy benchmark. Create original protocols, interfaces and assets. [AiSCOUT developer listing](https://play.google.com/store/apps/details?id=com.aiscout.player)

## Current versus target

Baseline: GitHub main `02d5a8e` and local `feature/vysion-engineering` at `cd1d97a` share the same tracked application source. The latter adds engineering guidance. “In source” denotes inspected code, with runtime acceptance still separate. The 4 November local recovery handoff records historical pilot work. Its implementation was unavailable on the inspected refs, including the GitHub branch search. Recover and inspect it before estimating gaps or rebuilding anything.

| Pillar and target | Current evidence | Gap to close |
| --- | --- | --- |
| Development · structured drills, goals and programmes | Pilot drills and local training are reported in the recovery trail. The baseline has training posts and achievements. | Verify the recovered catalogue, completion writes and goal persistence. Establish repeatable drill protocols, then add programmes, challenges and progress history. |
| Development · video assessment and coaching | The network accepts footage links. The separate web upload hook makes a client request. Neither establishes a consented drill submission or measurement pipeline. The player service explicitly leaves speed filtering as a placeholder. | Capture comparable attempts, validate one observable metric, then evaluate personalised feedback. Automated scoring and recommendations are future work. |
| Identification · portfolios and discovery | Profile, history, achievements, footage links and profile search are in source. Scout shortlisting is reported for the missing pilot. | Verify persisted shortlists, evidence permissions and evidence quality. Show who supplied or assessed each result. |
| Identification · trials and recruitment | The board carries opportunities, requirements, close status and external application URLs. | In-platform evidence submission, application status and reviewer feedback remain future work. |
| Network · people and organisations | Professional role/focus fields, profile UI, owner-managed club/agency pages and self-joined membership are in source. | Verify professional affiliation, distinguish role-specific workflows and introduce academy pages. Self-selection alone cannot grant access to player records. |
| Network · communication | Mobile screens and API services cover chronological posts, connection requests and participant-only text messaging after acceptance. | Verify the two-account journey, including denial and revocation cases, on mobile and larger screens. Extend communication only when a recruitment workflow requires it. |

### Foundations to reuse

- Preserve the existing user and football profile in the [Prisma schema](../../database/prisma/schema.prisma). Reference that identity from attempts, reviews and explicit sharing decisions. A new player account per subsystem would fragment history and consent.
- Extend the [shared network contracts](../../packages/shared/src/network.ts), [authenticated routes](../../services/api/src/network/routes.ts), [network service](../../services/api/src/network/service.ts) and [participant policy](../../services/api/src/network/policy.ts). Check legacy [player routes](../../services/api/src/routes/players.ts) and [player projections](../../services/api/src/services/playerService.ts) alongside network reads, including nested responses.
- Reuse the [Expo network screens](../../apps/mobile/src/screens/network) and existing navigation. The [web media hook](../../apps/web/src/hooks/useMedia.ts) is evidence of a client integration point only. Carry over deliberate loading, retry and empty states into any future capture flow. Test keyboard access, captions or text instructions, narrow and wide layouts, and interrupted uploads.
- Keep Express, TypeScript, shared validation and PostgreSQL. Introduce a versioned assessment input/output boundary inside the existing architecture when warranted. Decide where inference runs from measured latency, privacy and cost. A separate deployed service is optional.

## Delivery sequence and acceptance gates

| Phase | Work and dependency | Evidence required before advancing |
| --- | --- | --- |
| 0 · Recover and secure the pilot | Obtain the original pilot source/export. Verify checksums, ancestry and retained changes in isolation. Reproduce the reported Express test typing failure. Check authentication, partial registration, session restoration and both legacy and network privacy paths. | Applicable tests, type checks and builds pass. Independent security and engineering review clears blocking findings. Two separate accounts demonstrate player sharing, scout discovery and persisted shortlisting after reload against verified disposable resources. Include denied reads and mobile/desktop browser evidence. |
| 1 · Establish training evidence | Reconcile recovered drills and goals first. Pilot one documented drill, repeat attempts, player-controlled sharing and a coach-readable history. Support manual review and footage links while validating demand. | A player can keep an attempt private, share a chosen attempt, and revoke access. A reviewer can distinguish self-report, coach review and measurement. |
| 2 · Test one automated measurement | After protocol, consent, secure capture and labels exist, evaluate one candidate offline. Keep all experimental outputs outside recruitment decisions. | Meet the feasibility gates below. If the experiment fails, retain manual review and narrow the protocol. |
| 3 · Connect evidence to opportunity | With phase 1 permissions verified, test attaching selected evidence to a trial and recording an application outcome. This can proceed while phase 2 is under evaluation. Include an automated metric only after validation. | A free player can apply, a permitted scout can review, and withdrawn evidence stops being served. The scout can consider match context and record a human decision. |
| 4 · Extend development and the network | Use observed player and recruiter demand to prioritise programmes, recommendations, role-specific workflows, verified organisations and academy tools. | Each addition improves an observed journey. Check accessibility, consent and equal discovery access before expanding rollout. |

## AI video-analysis feasibility

**First candidate:** count completed repetitions in a stationary, single-player drill with a prescribed camera angle and a visible start/finish. Define one repetition with a coach before collecting footage. Compare the result with independently counted repetitions. Defer ball contact, first-touch quality, absolute speed and predictions of potential until each has its own observable definition, reference data and validation.

| Dependency or risk | Experiment and decision |
| --- | --- |
| Capture quality | Specify framing, distance, duration and visible landmarks. Sample low-end phones, lighting changes, camera angles, occlusion and skipped frames. Return a specific recapture instruction when the event cannot be observed. Offer manual submission when recapture is impractical. |
| Ground truth and measurement error | Obtain separately consented, representative clips. Have two reviewers label events independently and resolve disagreements. Keep players and repeat recordings from crossing training and held-out test sets. Before testing, agree acceptable count error, usable-clip coverage and subgroup error limits with coaches. Report absolute count error, coverage and rejection rates against human agreement and a simple baseline. |
| Equity and practical cost | Compare error and rejection by device, recording conditions and relevant participant groups where consent and sample size allow. Measure upload bytes, retries, latency and cost per usable result on limited bandwidth. If accuracy or access depends on expensive hardware, narrow the supported claim and keep the manual route open. |
| Security and reproducibility | Establish permitted capture, storage, retention, deletion and separate opt-in for model training, including safeguards for minors. Restrict raw clips and derived results by purpose. Record drill version, units, source, model version, quality flags and reviewer corrections. Verify retries cannot duplicate results and revocation covers downstream reads. |
| Release decision | Evaluate on held-out clips, then shadow coach review without displaying experimental scores. Publish the supported conditions and known errors. Ship only when predefined gates hold. Abstain on poor evidence and permit correction. Introduce individual progress comparisons only across compatible protocol and metric versions. |

## Current release priority

The next engineering owner is ORACLE for recovery and verification of the player-to-scout pilot. Privacy, authentication, real persistence and responsive end-to-end acceptance remain release blockers. Historical test totals, mocked journeys and this documentation commit cannot clear them. This checkpoint authorises documentation only. Later phases require separate implementation authorisation. [Network release guide](../engineering/football-network-release.md) · [Authentication and UI verification record](../engineering/interactive-ui-verification.md)
