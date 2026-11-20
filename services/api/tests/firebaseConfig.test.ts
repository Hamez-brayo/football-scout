import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockDotenvConfig = jest.fn();
const mockWarn = jest.fn();
const mockInfo = jest.fn();
const mockError = jest.fn();
const mockGetApps = jest.fn<() => unknown[]>();
const mockGetApp = jest.fn<() => unknown>();
const mockCert = jest.fn<(options: unknown) => unknown>();
const mockInitializeApp = jest.fn<(options: unknown) => unknown>();
const mockGetAuth = jest.fn<(app: unknown) => unknown>();
const mockGetStorage = jest.fn<(app: unknown) => unknown>();
const mockGetFirestore = jest.fn<(app: unknown) => unknown>();

jest.mock('dotenv', () => ({
  __esModule: true,
  default: { config: () => mockDotenvConfig() },
}));
jest.mock('../src/config/logger', () => ({
  logger: { warn: mockWarn, info: mockInfo, error: mockError },
}));
jest.mock('firebase-admin/app', () => ({
  getApps: () => mockGetApps(),
  getApp: () => mockGetApp(),
  cert: (options: unknown) => mockCert(options),
  initializeApp: (options: unknown) => mockInitializeApp(options),
}));
jest.mock('firebase-admin/auth', () => ({ getAuth: (app: unknown) => mockGetAuth(app) }));
jest.mock('firebase-admin/storage', () => ({ getStorage: (app: unknown) => mockGetStorage(app) }));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: (app: unknown) => mockGetFirestore(app),
}));

const originalEnvironment = process.env;
const firebaseVariables = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_STORAGE_BUCKET',
];
const defaultApp = { name: '[DEFAULT]' };
const credential = { testCredential: true };
const authClient = { verifyIdToken: jest.fn() };
const storageClient = { bucket: jest.fn() };
const firestoreClient = { collection: jest.fn() };

const configureFirebase = () => {
  process.env.FIREBASE_PROJECT_ID = 'config-test-project';
  process.env.FIREBASE_CLIENT_EMAIL = 'firebase-admin@example.test';
  process.env.FIREBASE_PRIVATE_KEY = 'test-key-line-one\\ntest-key-line-two';
  process.env.FIREBASE_STORAGE_BUCKET = 'config-test-project.appspot.com';
};
const load = () => require('../src/config/firebase');

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  process.env = { ...originalEnvironment };
  firebaseVariables.forEach((key) => delete process.env[key]);
  mockGetApps.mockReturnValue([]);
  mockGetApp.mockReturnValue(defaultApp);
  mockCert.mockReturnValue(credential);
  mockInitializeApp.mockReturnValue(defaultApp);
  mockGetAuth.mockReturnValue(authClient);
  mockGetStorage.mockReturnValue(storageClient);
  mockGetFirestore.mockReturnValue(firestoreClient);
});
afterEach(() => {
  process.env = originalEnvironment;
});

const expectUnconfigured = () => {
  expect(load()).toMatchObject({ auth: null, storage: null, firestore: null });
  expect(mockWarn).toHaveBeenCalledTimes(1);
  expect(mockGetApps).not.toHaveBeenCalled();
  expect(mockGetApp).not.toHaveBeenCalled();
  expect(mockCert).not.toHaveBeenCalled();
  expect(mockInitializeApp).not.toHaveBeenCalled();
  expect(mockGetAuth).not.toHaveBeenCalled();
  expect(mockGetStorage).not.toHaveBeenCalled();
  expect(mockGetFirestore).not.toHaveBeenCalled();
};

describe('Firebase Admin configuration', () => {
  test('keeps all clients null without configuration or SDK initialization', () => {
    expectUnconfigured();
    expect(mockDotenvConfig).toHaveBeenCalledTimes(1);
  });

  test.each(firebaseVariables)('does not initialize when %s is missing', (key) => {
    configureFirebase();
    delete process.env[key];
    expectUnconfigured();
  });

  test('treats an empty required value as unconfigured', () => {
    configureFirebase();
    process.env.FIREBASE_PRIVATE_KEY = '';
    expectUnconfigured();
  });

  test('normalizes the private key and exports clients for the configured app', () => {
    configureFirebase();
    const clients = load();

    expect(mockCert).toHaveBeenCalledWith({
      projectId: 'config-test-project',
      clientEmail: 'firebase-admin@example.test',
      privateKey: 'test-key-line-one\ntest-key-line-two',
    });
    expect(mockInitializeApp).toHaveBeenCalledWith({
      credential,
      storageBucket: 'config-test-project.appspot.com',
    });
    expect(mockGetAuth).toHaveBeenCalledWith(defaultApp);
    expect(mockGetStorage).toHaveBeenCalledWith(defaultApp);
    expect(mockGetFirestore).toHaveBeenCalledWith(defaultApp);
    expect(clients.auth).toBe(authClient);
    expect(clients.storage).toBe(storageClient);
    expect(clients.firestore).toBe(firestoreClient);
    expect(mockInfo).toHaveBeenCalledTimes(1);
  });

  test('reuses the default app without replacing its credentials', () => {
    configureFirebase();
    mockGetApps.mockReturnValue([{ name: 'another-app' }, defaultApp]);
    const clients = load();

    expect(mockGetApp).toHaveBeenCalledTimes(1);
    expect(mockCert).not.toHaveBeenCalled();
    expect(mockInitializeApp).not.toHaveBeenCalled();
    expect(mockGetAuth).toHaveBeenCalledWith(defaultApp);
    expect(mockGetStorage).toHaveBeenCalledWith(defaultApp);
    expect(mockGetFirestore).toHaveBeenCalledWith(defaultApp);
    expect(clients.auth).toBe(authClient);
  });

  test.each(['certificate', 'initialization'])(
    'logs and propagates a configured %s failure without exporting clients',
    (stage) => {
      configureFirebase();
      const failure = new Error(`Test ${stage} failure`);
      const operation = stage === 'certificate' ? mockCert : mockInitializeApp;
      operation.mockImplementation(() => { throw failure; });

      expect(load).toThrow(failure);
      expect(mockError).toHaveBeenCalledWith(expect.any(String), failure);
      expect(mockGetAuth).not.toHaveBeenCalled();
      expect(mockGetStorage).not.toHaveBeenCalled();
      expect(mockGetFirestore).not.toHaveBeenCalled();
    },
  );
});
