import { afterEach, describe, expect, it, jest } from '@jest/globals';

function load(extra: Record<string, unknown> = {}, hostUri?: string) {
  jest.resetModules();
  jest.doMock('expo-constants', () => ({
    __esModule: true,
    default: { expoConfig: { extra, hostUri } },
  }));
  return require('../src/api/client') as typeof import('../src/api/client');
}

afterEach(() => {
  jest.resetModules();
});
describe('API endpoint configuration', () => {
  it('uses the configured API endpoint instead of the Expo LAN address', () => {
    expect(
      load({ apiUrl: 'https://dev.vysion.example/api/' }, '192.168.1.4:8081').API_BASE_URL,
    ).toBe('https://dev.vysion.example/api');
  });
  it('keeps LAN detection when no explicit endpoint is configured', () => {
    expect(load({}, '192.168.1.4:8081').API_BASE_URL).toBe('http://192.168.1.4:3002/api');
  });
  it('uses localhost when neither configuration nor a private LAN address exists', () => {
    expect(load({}, 'preview.example:8081').API_BASE_URL).toBe('http://localhost:3002/api');
  });
  it.each([
    'ftp://dev.example/api',
    'https://user:secret@dev.example/api',
    'https://dev.example/api?token=secret',
    'https://dev.example/api#secret',
    'not-a-url',
  ])('rejects unsafe explicit configuration without echoing its contents', (apiUrl) => {
    expect(() => load({ apiUrl })).toThrow(
      'API_URL must be an HTTP(S) URL without credentials, query or fragment.',
    );
  });
});
