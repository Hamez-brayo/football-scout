// Test-only bundle: production auth and API modules are replaced only inside this esbuild invocation.
// Requires esbuild and playwright on Node's module path; no live service is contacted.
import { createRequire } from 'node:module';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { build } = require('esbuild');
const serveOnly = process.argv.includes('--serve');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mobile = path.join(root, 'apps/mobile');
const fixtures = path.join(mobile, 'tests/visual');
const output = await mkdtemp(path.join(tmpdir(), 'vysion-ui-'));
const screenshots = path.join(root, 'docs/engineering/screenshots');
await mkdir(screenshots, { recursive: true });
await build({
  entryPoints: [path.join(fixtures, 'entry.tsx')],
  bundle: true,
  outfile: path.join(output, 'app.js'),
  platform: 'browser',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"', __DEV__: 'true' },
  alias: {
    'react-native': require.resolve('react-native-web'),
    react: path.dirname(
      require.resolve('react/package.json', { paths: [mobile] }),
    ),
    'react-dom': path.dirname(
      require.resolve('react-dom/package.json', { paths: [mobile] }),
    ),
  },
  plugins: [
    {
      name: 'isolated-ui-fixtures',
      setup(api) {
        api.onResolve({ filter: /contexts\/AuthContext$/ }, () => ({
          path: path.join(fixtures, 'auth.ts'),
        }));
        api.onResolve({ filter: /services\/NetworkService$/ }, () => ({
          path: path.join(fixtures, 'fixtures.ts'),
        }));
      },
    },
  ],
});
const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vysion UI fixture smoke test</title><style>html,body{height:100%;margin:0}body{font-family:system-ui;display:flex;flex-direction:column}#root{display:flex;flex-direction:column;flex:1;min-height:0}.fixture-label{background:#ffe4a3;color:#553c00;padding:7px;text-align:center;font:12px system-ui;flex-shrink:0}</style></head><body><div class="fixture-label">TEST FIXTURES · Synthetic people and activity · Local changes reset on reload · No Firebase or live database</div><div id="root"></div><script src="/app.js"></script></body></html>`;
const server = http.createServer(async (req, res) => {
  if (req.url === '/app.js') {
    res.setHeader('Content-Type', 'text/javascript');
    res.end(await readFile(path.join(output, 'app.js')));
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  }
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(serveOnly ? 8090 : 0, '127.0.0.1', resolve);
});
const url = `http://127.0.0.1:${server.address().port}`;
if (serveOnly) {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  assert((await response.text()).includes('TEST FIXTURES'));
  console.log(
    `Isolated Vysion UI fixture preview: ${url}\nSynthetic data only; local changes reset on reload. Press Ctrl+C to stop.`,
  );
  const stop = async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(output, { recursive: true, force: true });
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  await new Promise(() => {});
}
const { chromium } = require('playwright');
let browser;
const checks = [];
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // There are no remote assets or services in this fixture harness.
  await page.route('**/*', (route) =>
    route.request().url().startsWith(url) ? route.continue() : route.abort(),
  );
  await page.goto(url);
  await page.getByText('Football opens doors', { exact: false }).waitFor();
  await page.screenshot({
    path: path.join(screenshots, 'feed-desktop-fixture.png'),
    fullPage: true,
  });
  checks.push(
    'Desktop feed renders real HomeScreen with labelled fixture data',
  );
  await page
    .getByLabel('Post', { exact: true })
    .fill('UI smoke: a new training milestone.');
  await page.getByRole('button', { name: 'Publish post', exact: true }).click();
  await page
    .getByText('UI smoke: a new training milestone.', { exact: true })
    .waitFor();
  assert(
    await page.evaluate(() =>
      window.vysionFixture.writes.some(
        (w) =>
          w.path === '/posts' &&
          w.data.body === 'UI smoke: a new training milestone.',
      ),
    ),
  );
  checks.push('Publish post invokes existing write handler and refreshes feed');
  await page.getByRole('tab', { name: 'Network', exact: true }).click();
  await page.getByText('Neema Kamau', { exact: true }).waitFor();
  await page
    .getByLabel('Search people (name or headline)', { exact: true })
    .fill('Neema');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page
    .getByRole('button', { name: 'View profile', exact: true })
    .waitFor();
  assert.equal(
    await page
      .getByRole('button', { name: 'View profile', exact: true })
      .count(),
    1,
  );
  await page.screenshot({
    path: path.join(screenshots, 'network-desktop-fixture.png'),
    fullPage: true,
  });
  checks.push('Network search navigates and filters fixture profiles');
  await page.getByRole('button', { name: 'My profile', exact: true }).click();
  await page
    .getByLabel('Headline', { exact: true })
    .fill('Winger · UI smoke profile update');
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await page.getByRole('button', { name: 'My profile', exact: true }).click();
  await page
    .getByText('Winger · UI smoke profile update', { exact: true })
    .first()
    .waitFor();
  assert(
    await page.evaluate(() =>
      window.vysionFixture.writes.some((w) => w.path === '/me'),
    ),
  );
  await page.screenshot({
    path: path.join(screenshots, 'profile-desktop-fixture.png'),
    fullPage: true,
  });
  checks.push('Profile editor writes and displays returned profile');
  await page.getByRole('tab', { name: 'Opportunities', exact: true }).click();
  await page
    .getByRole('button', { name: 'View opportunity', exact: true })
    .click();
  await page
    .getByText('Bring your boots, training kit and a short player profile.', {
      exact: true,
    })
    .waitFor();
  checks.push('Opportunity list opens full opportunity detail');
  await page.getByRole('tab', { name: 'Messages', exact: true }).click();
  await page
    .getByRole('button', { name: 'Open conversation', exact: true })
    .click();
  await page
    .getByLabel('Message (up to 2000 characters)', { exact: true })
    .fill('I play on the wing. Thanks for reaching out!');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await page
    .getByText('I play on the wing. Thanks for reaching out!', { exact: true })
    .waitFor();
  checks.push('Accepted connection opens chat and sends a fixture message');
  await page
    .getByRole('button', { name: 'Clubs & agencies', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'View organisation', exact: true })
    .click();
  await page
    .getByText('Development squad open trials', { exact: true })
    .waitFor();
  checks.push('Organisation detail displays scoped opportunities');
  await page.evaluate(() => {
    window.vysionFixture.failNext = '/posts';
  });
  await page.getByRole('tab', { name: 'Feed', exact: true }).click();
  await page
    .getByText('Fixture API unavailable. Retry to recover.', { exact: true })
    .waitFor();
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await page
    .getByText('UI smoke: a new training milestone.', { exact: true })
    .waitFor();
  checks.push('API failure renders error and Retry recovers feed');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(screenshots, 'feed-mobile-fixture.png'),
    fullPage: true,
  });
  for (const name of ['Feed', 'Network', 'Opportunities', 'Messages'])
    assert(await page.getByRole('tab', { name, exact: true }).isVisible());
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  assert.equal(overflow, false, 'Mobile page must not overflow horizontally');
  await page.getByRole('tab', { name: 'Network', exact: true }).click();
  await page.getByText('Neema Kamau', { exact: true }).waitFor();
  await page.screenshot({
    path: path.join(screenshots, 'network-mobile-fixture.png'),
    fullPage: true,
  });
  checks.push(
    '390px navigation remains visible with no horizontal document overflow',
  );
  assert.deepEqual(errors, [], 'Browser runtime errors');
  const report = {
    fixtureOnly: true,
    liveAuthenticationTested: false,
    liveDatabaseTested: false,
    checks,
    browserErrors: errors,
  };
  await writeFile(
    path.join(screenshots, 'ui-smoke-results.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  const report = {
    fixtureOnly: true,
    status: browser ? 'failed' : 'blocked',
    checksCompleted: checks,
    liveAuthenticationTested: false,
    liveDatabaseTested: false,
    reason:
      error instanceof Error ? error.message.split('\n')[0] : String(error),
  };
  await writeFile(
    path.join(screenshots, 'ui-smoke-results.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  throw error;
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
  await rm(output, { recursive: true, force: true });
}
