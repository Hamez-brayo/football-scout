import { connectAuthEmulator, type Auth } from 'firebase/auth';

type LocalPilotOptions = {
  localPilot?: boolean;
  firebaseProjectId?: string;
  authEmulatorUrl?: string;
};

/** Emulator tokens must never be accepted by a normal or production client. */
export function connectLocalPilot(
  auth: Auth,
  options: LocalPilotOptions,
  development: boolean,
) {
  if (!options.localPilot) return;
  if (!development)
    throw new Error('Local pilot authentication requires a development build.');
  if (options.firebaseProjectId !== 'demo-vysion-pilot') {
    throw new Error('Local pilot authentication requires demo-vysion-pilot.');
  }
  let url: URL;
  try {
    url = new URL(options.authEmulatorUrl || '');
    const parts = url.hostname.split('.').map(Number);
    const privateIp =
      parts.length === 4 &&
      parts.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) &&
      (parts[0] === 10 ||
        (parts[0] === 192 && parts[1] === 168) ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31));
    if (
      url.protocol !== 'http:' ||
      url.port !== '9099' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/' ||
      (!privateIp && !['localhost', '127.0.0.1'].includes(url.hostname))
    )
      throw new Error();
  } catch {
    throw new Error(
      'The local pilot requires a local authentication emulator on port 9099.',
    );
  }
  // App.tsx displays a persistent pilot label; Firebase's fixed web banner covers tabs.
  if (!auth.emulatorConfig)
    connectAuthEmulator(auth, url.origin, { disableWarnings: true });
}
