// Local-only pilot. Ordinary startup never creates a database or applies a schema.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import {
  createPilotLifecycle,
  terminatePilotChild,
} from './pilot-lifecycle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mobile = path.join(root, 'apps/mobile');
const require = createRequire(import.meta.url);
const mobileRequire = createRequire(path.join(mobile, 'package.json'));
const data = path.join(root, '.pilot');
const cluster = path.join(data, 'postgres');
const pgBin = process.env.PILOT_PG_BIN || 'C:/Program Files/PostgreSQL/18/bin';
const pg = (name) =>
  path.join(pgBin, `${name}${process.platform === 'win32' ? '.exe' : ''}`);
const databaseUrl = 'postgresql://vysion_pilot@127.0.0.1:55432/vysion_pilot';
const project = 'demo-vysion-pilot';
const env = {
  ...process.env,
  NODE_ENV: 'development',
  DATABASE_URL: databaseUrl,
  FIREBASE_PROJECT_ID: project,
  GCLOUD_PROJECT: project,
  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  FIREBASE_CLIENT_EMAIL: '',
  FIREBASE_PRIVATE_KEY: '',
  FIREBASE_STORAGE_BUCKET: '',
  GOOGLE_APPLICATION_CREDENTIALS: '',
  PORT: '3002',
  HOST: '0.0.0.0',
  LOG_LEVEL: 'warn',
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    windowsHide: true,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `Pilot command failed: ${path.basename(command)} (exit ${result.status})`,
    );
  return result;
}
const node = (file, args = [], options = {}) =>
  run(process.execPath, [file, ...args], options);
const prisma = (args) =>
  node(require.resolve('prisma/build/index.js'), [
    ...args,
    '--schema',
    'database/prisma/schema.prisma',
  ]);

function startDatabase() {
  if (!existsSync(path.join(cluster, 'PG_VERSION')))
    throw new Error(
      'Pilot database missing. See the approved setup command in docs/engineering/pilot-quickstart.md.',
    );
  const status = spawnSync(pg('pg_ctl'), ['-D', cluster, 'status'], {
    windowsHide: true,
    stdio: 'ignore',
  });
  if (status.status !== 0)
    run(pg('pg_ctl'), [
      '-D',
      cluster,
      '-l',
      path.join(data, 'postgres.log'),
      '-o',
      '-h 127.0.0.1 -p 55432',
      '-w',
      'start',
    ]);
}
function build() {
  prisma(['generate']);
  node(require.resolve('typescript/bin/tsc'), [
    '-p',
    'packages/shared/tsconfig.json',
  ]);
  node(require.resolve('typescript/bin/tsc'), [
    '-p',
    'services/api/tsconfig.json',
  ]);
  node(require.resolve('tsc-alias/dist/bin/index.js'), [
    '-p',
    'services/api/tsconfig.json',
  ]);
}
async function portFree(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () =>
      reject(
        new Error(
          `Port ${port} is occupied. Stop the conflicting service first.`,
        ),
      ),
    );
    server.listen(port, '0.0.0.0', () => server.close(resolve));
  });
}
function lanHost() {
  if (process.env.PILOT_HOST) return process.env.PILOT_HOST;
  const addresses = Object.values(networkInterfaces())
    .flat()
    .filter((a) => a && a.family === 'IPv4' && !a.internal);
  return (
    addresses.find((a) => a.address.startsWith('192.168.'))?.address ||
    addresses.find((a) => a.address.startsWith('10.'))?.address ||
    '127.0.0.1'
  );
}
async function ready(url, child, assertRunning) {
  for (let i = 0; i < 90; i++) {
    assertRunning();
    if (child.exitCode !== null)
      throw new Error('Pilot service stopped before becoming ready.');
    let ok = false;
    try {
      ok = (await fetch(url, { signal: AbortSignal.timeout(1000) })).ok;
    } catch {}
    assertRunning();
    if (ok) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `Pilot service did not become ready on ${new URL(url).port}.`,
  );
}
async function main() {
  const command = process.argv[2];
  if (command === 'setup') {
    if (!process.argv.includes('--approve-local-schema'))
      throw new Error(
        'Schema setup requires --approve-local-schema after approving the isolated database target.',
      );
    mkdirSync(data, { recursive: true });
    if (!existsSync(path.join(cluster, 'PG_VERSION'))) {
      await portFree(55432);
      run(pg('initdb'), [
        '-D',
        cluster,
        '-U',
        'vysion_pilot',
        '--auth=trust',
        '--encoding=UTF8',
        '--locale=C',
      ]);
    }
    startDatabase();
    const query = spawnSync(
      pg('psql'),
      [
        '-h',
        '127.0.0.1',
        '-p',
        '55432',
        '-U',
        'vysion_pilot',
        '-d',
        'postgres',
        '-tAc',
        "SELECT 1 FROM pg_database WHERE datname='vysion_pilot'",
      ],
      { encoding: 'utf8', windowsHide: true },
    );
    if (query.status !== 0)
      throw new Error('Cannot inspect isolated pilot database.');
    if (query.stdout.trim() !== '1')
      run(pg('createdb'), [
        '-h',
        '127.0.0.1',
        '-p',
        '55432',
        '-U',
        'vysion_pilot',
        'vysion_pilot',
      ]);
    prisma(['migrate', 'deploy']);
    build();
    console.log('Pilot schema and build ready. No seed or reset performed.');
    return;
  }
  if (command === 'build') return build();
  if (command !== 'start')
    throw new Error(
      'Usage: node scripts/pilot.mjs setup --approve-local-schema | start | build',
    );
  for (const port of [3002, 8081, 9099, 4400, 4500]) await portFree(port);
  startDatabase();
  build();
  const host = lanHost();
  // Validate through the same mobile policy before embedding any host in Expo config.
  if (
    !net.isIPv4(host) ||
    !/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.|127\.0\.0\.1$)/.test(host)
  )
    throw new Error('PILOT_HOST must be a private LAN IPv4 address.');
  const keyPath = path.join(data, 'jwt-key');
  if (!existsSync(keyPath)) {
    const { randomBytes } = await import('node:crypto');
    writeFileSync(keyPath, randomBytes(48).toString('hex'), { flag: 'wx' });
  }
  env.JWT_SECRET = readFileSync(keyPath, 'utf8');
  env.CORS_ORIGINS = `http://localhost:8081,http://127.0.0.1:8081,http://${host}:8081`;
  const children = [];
  let auth;
  const authPath = path.join(data, 'auth');
  const lifecycle = createPilotLifecycle({
    exportAccounts: async () => {
      if (!auth || auth.exitCode !== null) return;
      const response = await fetch('http://127.0.0.1:4400/_admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: authPath,
          initiatedBy: 'vysion-local-pilot',
          targets: ['auth'],
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('Account export failed.');
    },
    terminate: () => {
      for (const child of [...children].reverse()) {
        terminatePilotChild(child);
      }
    },
  });
  const start = (file, args, options = {}) => {
    lifecycle.assertRunning();
    const child = spawn(process.execPath, [file, ...args], {
      cwd: root,
      env,
      stdio: 'inherit',
      windowsHide: true,
      ...options,
    });
    children.push(child);
    child.once('error', (error) => {
      console.error(error.message);
      stop(1);
    });
    child.once('exit', () => {
      if (!lifecycle.cancelled) void stop(1);
    });
    return child;
  };
  const stop = async (code) => {
    try {
      await lifecycle.stop();
      console.log(
        'Pilot services stopped. Database remains available on loopback.',
      );
      process.exitCode = code;
    } catch {
      console.error(
        'Could not export local accounts. Auth is kept running. Press Ctrl+C to retry before restarting.',
      );
      process.exitCode = 1;
    }
  };
  process.on('SIGINT', () => stop(0));
  process.on('SIGTERM', () => stop(0));
  const authArgs = [
    'emulators:start',
    '--only',
    'auth',
    '--project',
    project,
    '--config',
    'firebase.pilot.json',
  ];
  if (existsSync(path.join(authPath, 'firebase-export-metadata.json')))
    authArgs.push('--import', authPath);
  // Windows broadcasts console Ctrl+C to attached children. Only the parent may
  // stop Auth, after a successful export; a hidden detached process avoids a race.
  auth = start(
    require.resolve('firebase-tools/lib/bin/firebase.js'),
    authArgs,
    {
      detached: process.platform === 'win32',
      stdio: ['ignore', 'inherit', 'inherit'],
    },
  );
  try {
    await ready('http://127.0.0.1:9099/', auth, lifecycle.assertRunning);
    const api = start(path.join(root, 'services/api/dist/server.js'), [], {
      cwd: path.join(root, 'services/api'),
    });
    await ready(
      'http://127.0.0.1:3002/api/health',
      api,
      lifecycle.assertRunning,
    );
    console.log(
      `\nWindows: http://localhost:8081\niPhone: exp://${host}:8081\nSame Wi-Fi. Disposable local accounts only. Keep this terminal open.\n`,
    );
    start(
      mobileRequire.resolve('expo/bin/cli'),
      [
        'start',
        '--lan',
        '--port',
        '8081',
        ...(process.argv.includes('--clear') ? ['--clear'] : []),
      ],
      {
        cwd: mobile,
        env: {
          ...env,
          VYSION_LOCAL_PILOT: '1',
          PILOT_HOST: host,
          REACT_NATIVE_PACKAGER_HOSTNAME: host,
          API_URL: `http://${host}:3002/api`,
        },
      },
    );
  } catch (error) {
    await stop(1);
    throw error;
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
