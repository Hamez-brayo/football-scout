# UI fixture smoke evidence

The screenshot harness bundles the real mobile HomeScreen and network components through
React Native Web. Only the test build replaces AuthContext and NetworkService with
synthetic, in-memory fixtures. Production entry points never import these fixtures.
Every fixture preview carries a banner identifying the data and reload reset behavior.

From the repository root:

```bash
npm ci
npm run build:shared
node scripts/ui-smoke.mjs --serve
```

Open http://127.0.0.1:8090. This is a localhost-only interactive fixture preview, with
post publishing, profile editing and accepted-connection messaging held in memory.
Login, registration and real server persistence are not tested here. Unsupported
fixture writes fail explicitly. Reload resets all fixture changes.

For automated browser checks and screenshots:

```bash
npx playwright install chromium
node scripts/ui-smoke.mjs
```

The smoke script checks desktop navigation, publishing a post, people search, profile
editing, opportunities, accepted-connection chat, organisation detail, API-error retry,
and a 390px viewport. Successful runs write fixture-labelled PNGs and a JSON report
in this directory. A failed run records its status and exits nonzero.

## Current result

Browser execution is **blocked**: Playwright's Chromium executable is absent, and its
standard browser installation failed because the CDN returned a truncated/non-ZIP
archive. No browser journeys or screenshots are claimed as passed. See
`ui-smoke-results.json`. The fixture bundle compiled successfully; the `--serve`
command verifies an HTTP 200 response from its own localhost server before reporting
its URL. Mobile TypeScript checking passed with the test fixture sources included.

These checks never establish live Firebase, PostgreSQL or physical-device acceptance.
