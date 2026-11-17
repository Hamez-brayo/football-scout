import { spawnSync } from 'node:child_process';

/** Do not report success when Windows refused to terminate an owned service. */
export function terminatePilotChild(
  child,
  platform = process.platform,
  killTree = spawnSync,
  alive = (pid) => {
    try {
      process.kill(pid, 0);
      return true;
    } catch (error) {
      return error.code !== 'ESRCH';
    }
  },
) {
  if (!child.pid || child.exitCode !== null || child.signalCode) return;
  if (platform === 'win32') {
    const result = killTree(
      'taskkill',
      ['/PID', String(child.pid), '/T', '/F'],
      { stdio: 'ignore', windowsHide: true },
    );
    if ((result.error || result.status !== 0) && alive(child.pid))
      throw new Error(
        'Could not terminate an owned pilot process; retry shutdown.',
      );
  } else if (!child.kill('SIGINT') && alive(child.pid))
    throw new Error(
      'Could not terminate an owned pilot process; retry shutdown.',
    );
}

/** Cancel startup immediately, but retain services if their account export fails. */
export function createPilotLifecycle({ exportAccounts, terminate }) {
  let cancelled = false;
  let stopped = false;
  let pending;
  return {
    assertRunning() {
      if (cancelled) throw new Error('Pilot startup stopped.');
    },
    get cancelled() {
      return cancelled;
    },
    stop() {
      cancelled = true;
      if (stopped) return Promise.resolve(true);
      if (pending) return pending;
      pending = (async () => {
        await exportAccounts();
        terminate();
        stopped = true;
        return true;
      })().finally(() => {
        pending = undefined;
      });
      return pending;
    },
  };
}
