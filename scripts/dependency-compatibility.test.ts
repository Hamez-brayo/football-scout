import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { Duplex } from 'node:stream';
import test from 'node:test';

const require = createRequire(import.meta.url);
const apiRequire = createRequire(new URL('../services/api/package.json', import.meta.url));

function consumerDependency(
  consumer: string,
  dependency: string,
  parentRequire = require,
) {
  const consumerRequire = createRequire(parentRequire.resolve(consumer));
  const metadata: unknown = JSON.parse(
    readFileSync(consumerRequire.resolve(`${dependency}/package.json`), 'utf8'),
  );
  assert(
    typeof metadata === 'object' && metadata !== null &&
    'version' in metadata && typeof metadata.version === 'string',
    `Missing ${dependency} version in ${consumer}'s dependency context`,
  );
  return { require: consumerRequire, version: metadata.version };
}

function assertPatchedVersion(version: string, major: number, minor: number, patch: number): void {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  assert(match, `Expected a stable package version, received ${version}`);
  const [actualMajor, actualMinor, actualPatch] = match.slice(1).map(Number);
  assert(
    actualMajor > major || (actualMajor === major &&
      (actualMinor > minor || (actualMinor === minor && actualPatch >= patch))),
    `Vulnerable consumer resolution ${version}; minimum is ${major}.${minor}.${patch}`,
  );
}

// Resolve from the actual consuming workspace, not an unrelated hoisted copy.
// No network, database, credential file or shell process is used by these tests.
test('Firebase Firestore Gax uses patched protobuf with stable wire encoding', () => {
  const adminRequire = createRequire(apiRequire.resolve('firebase-admin/app'));
  const firestoreRequire = createRequire(adminRequire.resolve('@google-cloud/firestore'));
  const dependency = consumerDependency('google-gax', 'protobufjs', firestoreRequire);
  assertPatchedVersion(dependency.version, 7, 6, 3);
  const { protobuf } = dependency.require('google-gax') as {
    protobuf: typeof import('protobufjs');
  };
  const message = protobuf.parse(
    'syntax = "proto3"; message Probe { string label = 1; bytes payload = 2; }',
  ).root.lookupType('Probe');
  const encoded = message.encode(message.create({
    label: 'test',
    payload: Buffer.from([0, 255]),
  })).finish();

  // Field 1: UTF-8 string "test"; field 2: two literal bytes.
  assert.deepEqual(Array.from(encoded), [10, 4, 116, 101, 115, 116, 18, 2, 0, 255]);
  const decoded = message.toObject(
    message.decode(Buffer.from([10, 4, 116, 101, 115, 116, 18, 2, 0, 255])),
  ) as { label: string; payload: Uint8Array };
  assert.equal(decoded.label, 'test');
  assert.deepEqual(Array.from(decoded.payload), [0, 255]);
});

test('concurrently shell quoting preserves literal arguments without expansion', () => {
  const dependency = consumerDependency('concurrently', 'shell-quote');
  assertPatchedVersion(dependency.version, 1, 9, 0);
  const { parse, quote } = dependency.require('shell-quote') as {
    parse: (value: string) => unknown[];
    quote: (values: string[]) => string;
  };
  const argumentsToQuote = ['two words', "apostrophe's", 'literal $HOME', 'line\nbreak'];

  assert.deepEqual(parse(quote(argumentsToQuote)), [
    'two words',
    "apostrophe's",
    'literal $HOME',
    'line\nbreak',
  ]);
});

test('Faye driver handles an offline RFC 6455 handshake and masked text frame', () => {
  const dependency = consumerDependency('faye-websocket', 'websocket-driver');
  assertPatchedVersion(dependency.version, 0, 7, 5);
  const websocket = dependency.require('websocket-driver') as {
    server: () => {
      io: Duplex;
      messages: Duplex;
      on: (event: string, listener: () => void) => void;
      start: () => void;
    };
  };
  const driver = websocket.server();
  const responses: Buffer[] = [];
  const messages: unknown[] = [];
  driver.io.on('data', (chunk: Buffer) => responses.push(chunk));
  driver.messages.on('data', (message: unknown) => messages.push(message));
  driver.on('connect', () => driver.start());
  driver.io.write(Buffer.from([
    'GET /test HTTP/1.1', 'Host: example.test', 'Upgrade: websocket',
    'Connection: Upgrade', 'Sec-WebSocket-Version: 13',
    'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==', '', '',
  ].join('\r\n')));
  const response = Buffer.concat(responses).toString('ascii');
  assert.match(response, /^HTTP\/1\.1 101 /);
  assert.match(response, /Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK\+xOo=/i);
  // Masked UTF-8 "Hi": mask 1,2,3,4, followed by 72^1,105^2.
  driver.io.write(Buffer.from([0x81, 0x82, 1, 2, 3, 4, 73, 107]));
  assert.deepEqual(messages, ['Hi']);
  driver.io.destroy();
  driver.messages.destroy();
});

test('Firebase Admin creates a locally verifiable RS256 custom token', async () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const sdk = apiRequire('firebase-admin/app') as {
    cert: (account: Record<string, string>) => unknown;
    initializeApp: (options: Record<string, unknown>, name: string) => { name: string };
    deleteApp: (app: { name: string }) => Promise<void>;
  };
  const auth = apiRequire('firebase-admin/auth') as {
    getAuth: (app: { name: string }) => {
      createCustomToken: (uid: string) => Promise<string>;
    };
  };
  const app = sdk.initializeApp({
    credential: sdk.cert({
      projectId: 'offline-contract-test',
      clientEmail: 'signer@offline-contract-test.iam.gserviceaccount.com',
      privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
    }),
  }, 'offline-contract-test');
  const emulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
  try {
    const token = await auth.getAuth(app).createCustomToken('offline-test-user');
    const [header, payload, signature] = token.split('.');
    assert(signature, 'Expected a signed custom token');
    const headerData: unknown = JSON.parse(Buffer.from(header, 'base64url').toString());
    const payloadData: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString());
    assert(typeof headerData === 'object' && headerData !== null &&
      'alg' in headerData && headerData.alg === 'RS256');
    assert(typeof payloadData === 'object' && payloadData !== null &&
      'uid' in payloadData && payloadData.uid === 'offline-test-user');
    assert(verify('RSA-SHA256', Buffer.from(`${header}.${payload}`), publicKey,
      Buffer.from(signature, 'base64url')), 'Custom-token signature must verify locally');
  } finally {
    await sdk.deleteApp(app);
    if (emulatorHost !== undefined) process.env.FIREBASE_AUTH_EMULATOR_HOST = emulatorHost;
  }
});
