# Run the local Vysion pilot

Use the Expo app in `apps/mobile` for both iPhone and Windows. The separate
Next.js app is not this pilot. Current branch: `feature/iphone-windows-pilot`.

## Requirements

- Node matching Expo 58: `^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`, npm 10+.
  Verified locally with Node 24.14.0.
- PostgreSQL 18 binaries. On Windows the launcher defaults to
  `C:\Program Files\PostgreSQL\18\bin`; set `PILOT_PG_BIN` for another location.
- iPhone Expo Go supporting SDK 58 (user confirmed client 58.0.5).
- Phone and computer on the same trusted Wi-Fi. Keep the computer awake.

## Install and initialize once

From this worktree, install locked dependencies with `npm ci --ignore-scripts`.
If Windows' npm launcher is broken, use the installed npm CLI directly:

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' ci --ignore-scripts
```

The user explicitly approved the following target on 17 November 2026:
NEW cluster under `.pilot/postgres`, listening only on `127.0.0.1:55432`,
database `vysion_pilot`. Do not substitute an existing database or use its URL.
This command applies the repository migrations only to that fixed target:

```powershell
node scripts/pilot.mjs setup --approve-local-schema
```

It does not seed, reset or modify existing databases or environment files.
The local cluster trusts local connections; it is a disposable development target.

## Start each session

```powershell
node scripts/pilot.mjs start
```

The launcher builds shared/API code, starts the existing isolated cluster,
Firebase Auth emulator (`demo-vysion-pilot`), API and Expo. Ordinary startup
does not run migrations. If a required port is occupied it stops with an error;
do not kill unrelated services. The launcher prefers a 192.168.x.x LAN address.
If the wrong adapter is selected, set `PILOT_HOST` to the PC's Wi-Fi IPv4 address.

- Windows: open `http://localhost:8081` in your browser.
- iPhone: open `exp://<PC-Wi-Fi-IP>:8081` in Expo Go or scan Expo's QR code.
  Allow local-network access. If Expo requests sign-in, use the same Expo account
  in the CLI and Expo Go (`npx expo login`); never paste credentials into chat.
- Create an account with disposable test details. The user-chosen email/password
  work on both devices against this local pilot. No real cloud account is created.

Keep the terminal open. Press Ctrl+C to export local sign-ins and stop the app
services. If export fails, Auth stays running so Ctrl+C can retry. The database
remains running on loopback; to stop only this pilot cluster:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe' -D .pilot/postgres -m fast -w stop
```

Authentication exports, signing key, database files and local screenshots stay
under ignored `.pilot/`. Do not commit or share these files. Force-closing the
terminal or powering off the computer can lose sign-ins since the last export.

## What to try

1. Create a Player account; edit/save My profile and reload.
2. Open Training, choose a drill, record repetitions/notes, save a private attempt.
3. Reload, sign out and sign back in. Verify your profile and attempts remain.
4. On a second device/account explore Network, connections, Feed and Messages.
5. In My profile opt into player search if you want your player listed.

Training results are self-reported. Footage uses HTTPS links, not hosted uploads.
Guided onboarding, development goals, shortlisting and AI assessment are not
implemented in the recovered branch. This is a local pilot for testing the
available flows; do not claim the larger player-to-scout milestone is complete.

If a phone cannot connect, try `http://<PC-Wi-Fi-IP>:3002/api/health` in Safari.
If that fails, check local-network permission, Wi-Fi isolation/VPN and Windows
Firewall. Do not disable the firewall; any rule should be limited to the private
network and required pilot ports 8081, 3002, 9099. Expo tunnelling alone does not
tunnel the API or sign-in emulator. This pilot is not available when the PC is off.

## Checks and checkpoints

Run API/mobile package tests, type checks, root build and
`node --test scripts/pilot-lifecycle.test.mjs`. Expo native dependency checks use
`expo install --check`. Jest 29, TypeScript 5.9 and existing ESLint config are
deliberately retained in Expo's validation exclusions: the repository uses
`ts-jest` 29 and plain TypeScript checks, not `jest-expo`. They remain covered by
the actual test/type-check commands; lint configuration remains a known gap.

For the real browser regression journey, start the pilot, then explicitly approve
disposable local test data for the command:

```powershell
node scripts/pilot-browser-smoke.cjs --approve-local-test-data
```

This checks real registration, profile/training save and reload, session
restoration, sign-out protection, and desktop/390px layouts. On Windows it uses
installed Edge; elsewhere install Playwright Chromium first. It writes screenshots
and disposable session data only under ignored `.pilot/`.

Commit source fixes and update `2026-11-17-pilot.md` with exact results before
ending a session. Exclude `.env`, `.pilot`, generated output and test accounts.
Checkpoint commits do not imply device acceptance or approval to deploy/merge.
