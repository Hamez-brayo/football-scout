import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('dotenv', () => ({
  __esModule: true,
  default: { config: jest.fn() },
}));
const originalEnvironment = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnvironment,
    DATABASE_URL: 'postgresql://unused.test/db',
  };
  delete process.env.JWT_SECRET;
  delete process.env.CORS_ORIGINS;
});
afterEach(() => {
  process.env = originalEnvironment;
});
const load = () => require('../src/config').config;
describe('authentication configuration boundaries', () => {
  test.each([undefined, 'devsecret', 'short-secret'])(
    'rejects an absent or weak production JWT signing secret (%s)',
    (secret) => {
      process.env.NODE_ENV = 'production';
      if (secret) process.env.JWT_SECRET = secret;
      expect(load).toThrow('JWT_SECRET');
    },
  );
  test('accepts an explicitly configured strong production secret', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';
    expect(load().JWT_SECRET).toBe('test-only-secret-with-at-least-32-characters');
  });
  test('allows Expo web development origins without granting them in production', () => {
    process.env.NODE_ENV = 'development';
    expect(load().CORS_ORIGINS).toEqual(
      expect.arrayContaining(['http://localhost:8081', 'http://127.0.0.1:8081']),
    );
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';
    expect(load().CORS_ORIGINS).not.toContain('http://localhost:8081');
    expect(load().CORS_ORIGINS).not.toContain('http://127.0.0.1:8081');
  });
  test('preserves explicit CORS origin configuration', () => {
    process.env.NODE_ENV = 'development';
    process.env.CORS_ORIGINS = 'https://example.test';
    expect(load().CORS_ORIGINS).toEqual(['https://example.test']);
  });
});
