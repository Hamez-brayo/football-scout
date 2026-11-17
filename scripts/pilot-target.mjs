import { networkInterfaces } from 'node:os';

/** Fail closed before any browser test can create accounts or write profile data. */
export function assertLocalPilotTarget(
  extra,
  localAddresses = Object.values(networkInterfaces())
    .flat()
    .filter((a) => a?.family === 'IPv4')
    .map((a) => a.address),
) {
  const hosts = ['127.0.0.1', 'localhost', ...localAddresses];
  if (
    !extra?.localPilot ||
    extra.firebaseProjectId !== 'demo-vysion-pilot' ||
    !hosts.some(
      (host) =>
        extra.apiUrl === `http://${host}:3002/api` &&
        extra.authEmulatorUrl === `http://${host}:9099`,
    )
  ) {
    throw new Error(
      'Start the isolated local pilot on this computer before test writes.',
    );
  }
}
