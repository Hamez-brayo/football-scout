# Expo pilot implementation plan

> Execute inline with `superpowers:executing-plans`; obtain a fresh final review.

**Goal:** User opens the existing app in Expo Go on iPhone and a Windows browser.
**Architecture:** Existing Expo/API/PostgreSQL with an explicit local Firebase
Auth emulator; no hosted services. Separate approved database, port 55432.
**Spec:** `docs/engineering/2026-11-17-pilot.md` (approved setup in conversation).

## Constraints and review focus

Never alter existing environment files or databases. No publication or merge.
Use SDK 58. Emulator mode must reject production and non-demo projects; phone
must reach API and emulator over LAN. Launcher must fail on port conflicts and
not reset data. Account and training records must survive restart. Report
unimplemented product features and device acceptance separately from builds.

- [x] Reproduce and repair test discovery/callback failures; run API/mobile tests
  and compilation; commit only focused tests/configuration and checkpoint.
- [ ] Align `apps/mobile/package.json` and lockfile with SDK 58 using Expo's
  bundled native module versions; run Expo dependency check and web/iOS export.
- [ ] Add guarded local emulator configuration in mobile and API, with failing
  then passing regression tests for valid local setup and production rejection.
- [ ] Add `scripts/pilot.mjs`, Firebase emulator config and launch instructions.
  Validate destinations, keep `.pilot` data ignored, separate schema setup from
  ordinary startup. Provision only the approved cluster and database.
- [ ] Build, launch and test real registration/login/profile/training persistence
  in a browser at desktop/mobile widths. Leave server running for iPhone scan.
- [ ] Obtain independent review, fix blockers, record exact evidence and commit
  a final checkpoint. No merge proposal while required checks remain incomplete.
