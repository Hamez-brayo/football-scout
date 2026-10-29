import { beforeEach, describe, expect, it, jest } from '@jest/globals';
const app = { name: 'test-app' };
const storage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
const persistence = { type: 'LOCAL' };
const auth = { currentUser: null };
const initializeAuth = jest.fn(() => auth);
const getAuth = jest.fn(() => auth);
const getReactNativePersistence = jest.fn(() => persistence);
const getApps = jest.fn(() => [app]);
jest.mock('firebase/app', () => ({
  getApps: () => getApps(),
  initializeApp: () => app,
}));
jest.mock('firebase/auth', () => ({
  getAuth: (...args: unknown[]) => getAuth(...(args as [])),
  initializeAuth: (...args: unknown[]) => initializeAuth(...(args as [])),
  getReactNativePersistence: (...args: unknown[]) => getReactNativePersistence(...(args as [])),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: storage,
}));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: {} } },
}));
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  initializeAuth.mockImplementation(() => auth);
});
describe('Firebase platform initialization', () => {
  it('initializes native auth with persistent AsyncStorage even when app already exists', () => {
    const result = require('../src/config/firebase.native');
    expect(result.auth).toBe(auth);
    expect(getReactNativePersistence).toHaveBeenCalledWith(storage);
    expect(initializeAuth).toHaveBeenCalledWith(app, { persistence });
    expect(getAuth).not.toHaveBeenCalled();
  });
  it('reuses initialized native auth during fast refresh', () => {
    initializeAuth.mockImplementation(() => {
      throw { code: 'auth/already-initialized' };
    });
    expect(require('../src/config/firebase.native').auth).toBe(auth);
    expect(getAuth).toHaveBeenCalledWith(app);
  });
  it('does not hide unrelated native initialization errors', () => {
    initializeAuth.mockImplementation(() => {
      throw new Error('storage failed');
    });
    expect(() => require('../src/config/firebase.native')).toThrow('storage failed');
  });
  it('keeps browser auth on its browser persistence defaults', () => {
    expect(require('../src/config/firebase').auth).toBe(auth);
    expect(getAuth).toHaveBeenCalledWith(app);
    expect(initializeAuth).not.toHaveBeenCalled();
  });
});
