import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { User } from 'firebase/auth';
const firebaseAuth = { currentUser: null as User | null };
let listener: (user: User | null) => Promise<void>;
let effect: () => () => void;
let cleanup: () => void;
const setters = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];
const syncRef = { current: async () => {} };
let stateIndex = 0;
const clear = jest.fn();
const token = jest.fn();
const getUser = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const logout = jest.fn<() => Promise<void>>();
jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useState: (initial: unknown) => [initial, setters[stateIndex++]],
  useEffect: (callback: typeof effect) => {
    effect = callback;
  },
  useCallback: (callback: unknown) => callback,
  useRef: () => syncRef,
  useMemo: (factory: () => unknown) => factory(),
}));
jest.mock('firebase/auth', () => ({
  onIdTokenChanged: (_auth: unknown, callback: typeof listener) => {
    listener = callback;
    return jest.fn();
  },
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ clear }),
}));
jest.mock('../src/config/firebase', () => ({ auth: firebaseAuth }));
jest.mock('../src/api/client', () => ({
  setAuthToken: (value: unknown) => token(value),
}));
jest.mock('../src/services/AuthService', () => ({
  AuthService: {
    getBackendUser: (...args: unknown[]) => getUser(...args),
    logout: () => logout(),
  },
}));
import { AuthProvider } from '../src/contexts/AuthContext';
const oldIdentity = { uid: 'old', getIdToken: async () => 'old-token' } as User;
const newIdentity = { uid: 'new', getIdToken: async () => 'new-token' } as User;
describe('auth observer async isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateIndex = 0;
    AuthProvider({ children: null });
    cleanup = effect();
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
  it('retains a synchronized user and mounted navigation on a temporary API failure', async () => {
    firebaseAuth.currentUser = oldIdentity;
    getUser.mockResolvedValueOnce({ userId: 'old' });
    await listener(oldIdentity);
    setters.forEach((setter) => setter.mockClear());
    getUser.mockRejectedValueOnce(Object.assign(new Error('Network error'), { statusCode: 503 }));
    await listener(oldIdentity);
    expect(setters[0]).not.toHaveBeenCalledWith(null);
    expect(setters[1]).not.toHaveBeenCalledWith(null);
    expect(setters[2]).not.toHaveBeenCalledWith(true);
    expect(logout).not.toHaveBeenCalled();
    expect(setters[3]).toHaveBeenLastCalledWith('Network error');
  });
  it('keeps an initial sync failure recoverable without exposing a protected user', async () => {
    firebaseAuth.currentUser = oldIdentity;
    getUser.mockRejectedValueOnce(new Error('Backend unavailable'));
    await listener(oldIdentity);
    expect(setters[0]).not.toHaveBeenCalledWith(expect.objectContaining({ userId: 'old' }));
    expect(setters[3]).toHaveBeenLastCalledWith('Backend unavailable');
    expect(logout).not.toHaveBeenCalled();
    getUser.mockResolvedValueOnce({ userId: 'old' });
    await syncRef.current();
    expect(setters[0]).toHaveBeenLastCalledWith({ userId: 'old' });
    expect(setters[3]).toHaveBeenLastCalledWith(null);
  });
  it.each([401, 403, 404])('clears a rejected backend identity (%s)', async (statusCode) => {
    firebaseAuth.currentUser = oldIdentity;
    getUser.mockRejectedValueOnce(Object.assign(new Error('Account unavailable'), { statusCode }));
    await listener(oldIdentity);
    expect(setters[0]).toHaveBeenLastCalledWith(null);
    expect(token).toHaveBeenLastCalledWith(null);
    expect(logout).toHaveBeenCalledTimes(1);
  });
  it.each(['account switch', 'unmount'])(
    'ignores a stale logout rejection after %s',
    async (event) => {
      let rejectLogout!: (reason: Error) => void;
      logout.mockImplementationOnce(
        () =>
          new Promise<void>((_resolve, reject) => {
            rejectLogout = reject;
          }),
      );
      firebaseAuth.currentUser = oldIdentity;
      getUser.mockRejectedValueOnce(
        Object.assign(new Error('Invalid account'), { statusCode: 401 }),
      );
      const pending = listener(oldIdentity);
      await Promise.resolve();
      if (event === 'unmount') cleanup();
      else {
        firebaseAuth.currentUser = newIdentity;
        getUser.mockResolvedValueOnce({ userId: 'new' });
        await listener(newIdentity);
      }
      setters[3].mockClear();
      rejectLogout(new Error('Signout failed'));
      await pending;
      expect(setters[3]).not.toHaveBeenCalled();
    },
  );
  it('cannot restore an old profile after logout', async () => {
    let resolve!: (value: unknown) => void;
    getUser.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
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
    getUser.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
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
