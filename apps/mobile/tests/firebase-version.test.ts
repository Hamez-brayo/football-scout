import { expect, it } from '@jest/globals';

it('uses the Firebase version supported by modern Expo native module resolution', () => {
  // https://docs.expo.dev/guides/using-firebase/ requires Firebase 12 or newer.
  // Firebase 10 can bundle on iOS but fail to register the Auth component at runtime.
  const { version } = require('firebase/package.json') as { version: string };
  expect(Number(version.split('.')[0])).toBeGreaterThanOrEqual(12);
});
