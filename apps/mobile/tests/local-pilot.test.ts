import { expect, it, jest } from '@jest/globals';
const connect = jest.fn();
jest.mock('firebase/auth', () => ({
  connectAuthEmulator: (...args: unknown[]) => connect(...args),
}));
import { connectLocalPilot } from '../src/config/localPilot';
const options = {
  localPilot: true,
  firebaseProjectId: 'demo-vysion-pilot',
  authEmulatorUrl: 'http://192.168.1.47:9099',
};
it('connects explicit local pilot auth without a duplicate overlay over navigation', () => {
  connectLocalPilot({} as never, options, true);
  expect(connect).toHaveBeenCalledWith({}, options.authEmulatorUrl, {
    disableWarnings: true,
  });
});
it('never enables emulator authentication in production or for a real project', () => {
  expect(() => connectLocalPilot({} as never, options, false)).toThrow(
    'development',
  );
  expect(() =>
    connectLocalPilot(
      {} as never,
      { ...options, firebaseProjectId: 'real-project' },
      true,
    ),
  ).toThrow('demo-vysion-pilot');
});
it.each([
  'https://example.com:9099',
  'http://user:pass@127.0.0.1:9099',
  'http://127.0.0.1:9099?x=1',
])(
  'rejects non-local or credential-bearing emulator destinations',
  (authEmulatorUrl) => {
    expect(() =>
      connectLocalPilot({} as never, { ...options, authEmulatorUrl }, true),
    ).toThrow('local');
  },
);
it('leaves normal authentication and fast refresh unchanged', () => {
  connect.mockClear();
  connectLocalPilot({} as never, {}, false);
  connectLocalPilot({ emulatorConfig: {} } as never, options, true);
  expect(connect).not.toHaveBeenCalled();
});
