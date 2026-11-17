import { afterEach, expect, it } from '@jest/globals';
import { localAuthEmulator } from '../src/config/localPilot';
const original = process.env;
afterEach(() => {
  process.env = original;
});
it('allows only the isolated local development auth project', () => {
  process.env = {
    NODE_ENV: 'development',
    FIREBASE_PROJECT_ID: 'demo-vysion-pilot',
    FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  };
  expect(localAuthEmulator()).toBe(true);
});
it.each([
  {
    NODE_ENV: 'production',
    FIREBASE_PROJECT_ID: 'demo-vysion-pilot',
    FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  },
  {
    NODE_ENV: 'development',
    FIREBASE_PROJECT_ID: 'real-project',
    FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  },
  {
    NODE_ENV: 'development',
    FIREBASE_PROJECT_ID: 'demo-vysion-pilot',
    FIREBASE_AUTH_EMULATOR_HOST: 'remote.example:9099',
  },
])('rejects unsafe emulator configuration', (environment) => {
  process.env = environment;
  expect(() => localAuthEmulator()).toThrow('local pilot');
});
it('does not alter ordinary Firebase initialization', () => {
  process.env = { NODE_ENV: 'production' };
  expect(localAuthEmulator()).toBe(false);
});
