import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { User } from 'firebase/auth';
const firebaseAuth = { currentUser: null as User | null };
let listener: (user: User | null) => Promise<void>;
let effect: () => () => void;
const setters = [jest.fn(), jest.fn(), jest.fn()];
let stateIndex = 0;
const clear = jest.fn();
const token = jest.fn();
const getUser = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const logout = jest.fn<() => Promise<void>>();
jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useState: (initial: unknown) => [initial, setters[stateIndex++]],
  useEffect: (callback: typeof effect) => { effect = callback; },
  useCallback: (callback: unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
}));
jest.mock('firebase/auth', () => ({ onIdTokenChanged: (_auth: unknown, callback: typeof listener) => {
  listener = callback;
  return jest.fn();
} }));
jest.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ clear }) }));
jest.mock('../src/config/firebase', () => ({ auth: firebaseAuth }));
jest.mock('../src/api/client', () => ({ setAuthToken: (value: unknown) => token(value) }));
jest.mock('../src/services/AuthService', () => ({ AuthService: {
  getBackendUser: (...args: unknown[]) => getUser(...args), logout: () => logout(),
} }));
import { AuthProvider } from '../src/contexts/AuthContext';
const oldIdentity = { uid: 'old', getIdToken: async () => 'old-token' } as User;
const newIdentity = { uid: 'new', getIdToken: async () => 'new-token' } as User;
describe('auth observer async isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateIndex = 0;
    AuthProvider({ children: null });
    effect();
  });
  it('keeps same-UID token refresh nonblocking while still blocking identity changes', async () => {
    firebaseAuth.currentUser = oldIdentity;
    getUser.mockResolvedValue({ userId: 'old' });
    await listener(oldIdentity);
    expect(setters[2]).toHaveBeenCalledWith(true);
    setters[2].mockClear();
    // Firebase may supply a new User object for the same persisted identity.
    const refreshed = { ...oldIdentity } as User;
    firebaseAuth.currentUser = refreshed;
    await listener(refreshed);
    expect(setters[2]).not.toHaveBeenCalledWith(true);
    expect(setters[0]).toHaveBeenLastCalledWith({ userId: 'old' });
    expect(setters[1]).toHaveBeenLastCalledWith(refreshed);
    setters[2].mockClear();
    firebaseAuth.currentUser = newIdentity;
    await listener(newIdentity);
    expect(setters[2]).toHaveBeenCalledWith(true);
  });
  it('cannot restore an old profile after logout', async () => {
    let resolve!: (value: unknown) => void;
    getUser.mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    firebaseAuth.currentUser = oldIdentity;
    const pending = listener(oldIdentity);
    await Promise.resolve();
    firebaseAuth.currentUser = null;
    await listener(null);
    resolve({ userId: 'old' });
    await pending;
    expect(setters[0]).toHaveBeenLastCalledWith(null);
    expect(setters[1]).toHaveBeenLastCalledWith(null);
    expect(logout).not.toHaveBeenCalled();
  });
  it('cannot log out a newer account when an old lookup fails', async () => {
    let resolve!: (value: unknown) => void;
    getUser.mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    firebaseAuth.currentUser = oldIdentity;
    const pending = listener(oldIdentity);
    await Promise.resolve();
    firebaseAuth.currentUser = newIdentity;
    getUser.mockResolvedValueOnce({ userId: 'new' });
    await listener(newIdentity);
    resolve(null);
    await pending;
    expect(setters[0]).toHaveBeenLastCalledWith({ userId: 'new' });
    expect(setters[1]).toHaveBeenLastCalledWith(newIdentity);
    expect(logout).not.toHaveBeenCalled();
  });
});
