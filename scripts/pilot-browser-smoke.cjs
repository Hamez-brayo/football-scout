const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  if (!process.argv.includes('--approve-local-test-data'))
    throw new Error(
      'Run only against the approved local pilot with --approve-local-test-data.',
    );
  const manifestResponse = await fetch('http://localhost:8081', {
    headers: { 'expo-platform': 'ios', accept: 'application/expo+json' },
  });
  const manifest = await manifestResponse.json();
  const extra = manifest.extra?.expoClient?.extra;
  const { assertLocalPilotTarget } = await import('./pilot-target.mjs');
  assertLocalPilotTarget(extra);
  const browser = await chromium.launch({
    ...(process.platform === 'win32' ? { channel: 'msedge' } : {}),
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const email = `pilot.${Date.now()}@example.test`;
  const password = require('crypto').randomBytes(18).toString('hex') + 'Aa1!';
  try {
    await page.goto('http://localhost:8081');
    await page
      .getByRole('button', { name: 'Create an account', exact: true })
      .click();
    await page.getByLabel('First name', { exact: true }).fill('Pilot');
    await page.getByLabel('Last name', { exact: true }).fill('Player');
    await page.locator('input[aria-label="Email"]:visible').fill(email);
    await page.locator('input[aria-label="Password"]:visible').fill(password);
    await page.locator('input[aria-label="Password"]:visible').blur();
    await page
      .getByRole('button', { name: 'Create Account', exact: true })
      .click();
    await page
      .getByRole('tab', { name: 'Training', exact: true })
      .waitFor({ timeout: 20000 });
    console.log('PASS real registration and protected home');
    await page.getByRole('button', { name: 'My profile', exact: true }).click();
    await page
      .getByLabel('Headline', { exact: true })
      .fill('Windows pilot persistence check');
    await page
      .getByRole('button', { name: 'Save profile', exact: true })
      .click();
    await page.getByRole('tab', { name: 'Training', exact: true }).click();
    await page
      .getByRole('button', { name: 'View drill', exact: true })
      .first()
      .click();
    await page.getByLabel('Repetitions (optional)', { exact: true }).fill('12');
    await page
      .getByLabel('Notes (optional)', { exact: true })
      .fill('Saved from the actual Windows pilot');
    await page
      .getByRole('button', { name: 'Save private attempt', exact: true })
      .click();
    await page
      .getByText('Saved from the actual Windows pilot', { exact: true })
      .waitFor();
    await page.reload();
    await page.getByRole('tab', { name: 'Training', exact: true }).click();
    await page
      .getByText('Saved from the actual Windows pilot', { exact: true })
      .waitFor();
    console.log('PASS training saved in real database and survives reload');
    await page.screenshot({
      path: '.pilot/training-desktop.png',
      fullPage: true,
    });
    await page.getByRole('button', { name: 'My profile', exact: true }).click();
    assert.equal(
      await page.getByLabel('Headline', { exact: true }).inputValue(),
      'Windows pilot persistence check',
    );
    console.log('PASS profile and signed-in session survive reload');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('tab', { name: 'Training', exact: true }).click();
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    );
    await page.screenshot({
      path: '.pilot/training-mobile.png',
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await page.getByRole('button', { name: 'Sign In', exact: true }).waitFor();
    assert.equal(
      await page.getByRole('tab', { name: 'Training', exact: true }).count(),
      0,
    );
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Password', { exact: true }).blur();
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.getByRole('tab', { name: 'Training', exact: true }).click();
    await page
      .getByText('Saved from the actual Windows pilot', { exact: true })
      .waitFor();
    console.log('PASS sign-out protection and sign-in restore');
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      '.pilot/browser-state.json',
      JSON.stringify(await context.storageState()),
    );
    fs.writeFileSync(
      '.pilot/test-account.json',
      JSON.stringify({ email, password }),
    );
    console.log(
      'PASS no browser runtime errors; desktop and 390px screenshots saved',
    );
  } catch (e) {
    console.log('BODY', await page.locator('body').innerText());
    throw e;
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
