import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createPilotLifecycle,
  terminatePilotChild,
} from './pilot-lifecycle.mjs';

test('reports an owned Windows process that cannot be terminated', () => {
  assert.throws(
    () =>
      terminatePilotChild(
        { pid: 123, exitCode: null, signalCode: null },
        'win32',
        () => ({ status: 1 }),
        () => true,
      ),
    /terminate/,
  );
});
test('allows an owned process already gone and skips signalled children', () => {
  assert.doesNotThrow(() =>
    terminatePilotChild(
      { pid: 123, exitCode: null, signalCode: null },
      'win32',
      () => ({ status: 128 }),
      () => false,
    ),
  );
  terminatePilotChild(
    { pid: 123, exitCode: null, signalCode: 'SIGINT' },
    'win32',
    () => {
      throw new Error('must skip');
    },
  );
});

test('shutdown prevents starting another service while waiting for export', async () => {
  let finish;
  let terminated = 0;
  const lifecycle = createPilotLifecycle({
    exportAccounts: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
    terminate: () => {
      terminated++;
    },
  });
  const stopped = lifecycle.stop();
  assert.throws(() => lifecycle.assertRunning(), /stopped/);
  finish();
  assert.equal(await stopped, true);
  assert.equal(terminated, 1);
  assert.throws(() => lifecycle.assertRunning(), /stopped/);
});
test('failed account export preserves services and allows retry without reopening startup', async () => {
  let attempts = 0;
  let terminated = 0;
  const lifecycle = createPilotLifecycle({
    exportAccounts: async () => {
      if (++attempts === 1) throw new Error('disk full');
    },
    terminate: () => {
      terminated++;
    },
  });
  await assert.rejects(lifecycle.stop(), /disk full/);
  assert.equal(terminated, 0);
  assert.throws(() => lifecycle.assertRunning(), /stopped/);
  assert.equal(await lifecycle.stop(), true);
  assert.equal(terminated, 1);
});
test('repeated shutdown requests share one export and termination', async () => {
  let exported = 0;
  let terminated = 0;
  const lifecycle = createPilotLifecycle({
    exportAccounts: async () => {
      exported++;
    },
    terminate: () => {
      terminated++;
    },
  });
  await Promise.all([lifecycle.stop(), lifecycle.stop()]);
  await lifecycle.stop();
  assert.equal(exported, 1);
  assert.equal(terminated, 1);
});
