import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertLocalPilotTarget } from './pilot-target.mjs';
const valid = {
  localPilot: true,
  firebaseProjectId: 'demo-vysion-pilot',
  apiUrl: 'http://192.168.1.47:3002/api',
  authEmulatorUrl: 'http://192.168.1.47:9099',
};
test('accepts only the local PC pilot service pair before test writes', () => {
  assert.doesNotThrow(() => assertLocalPilotTarget(valid, ['192.168.1.47']));
});
for (const extra of [
  { ...valid, apiUrl: 'https://live.example/api' },
  { ...valid, apiUrl: 'http://192.168.1.48:3002/api' },
  { ...valid, apiUrl: 'http://192.168.1.47:3002/api?token=secret' },
  { ...valid, authEmulatorUrl: 'http://live.example:9099' },
  { ...valid, firebaseProjectId: 'real-project' },
])
  test('rejects non-pilot service destinations', () => {
    assert.throws(
      () => assertLocalPilotTarget(extra, ['192.168.1.47']),
      /local pilot/,
    );
  });
