import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { User } from 'firebase/auth';
const post = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const get = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const setToken = jest.fn();
const customSignIn = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const emailSignIn = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const createIdentity = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const signOut = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const firebaseAuth = { currentUser: null as User | null };
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => emailSignIn(...args),
  signInWithCustomToken: (...args: unknown[]) => customSignIn(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => createIdentity(...args),
  signOut: (...args: unknown[]) => signOut(...args),
}));
jest.mock('../src/config/firebase', () => ({ auth: firebaseAuth }));
jest.mock('../src/api/client', () => ({
  __esModule: true,
  default: {
    post: (...args: unknown[]) => post(...args),
    get: (...args: unknown[]) => get(...args),
  },
  setAuthToken: (token: unknown) => setToken(token),
}));
import { AuthService } from '../src/services/AuthService';
import { authApi } from '../src/api/auth';
const payload = {
  email: 'coach@example.test',
  password: 'test-password',
  firstName: 'A',
  lastName: 'Coach',
  userType: 'SCOUT',
};
const user = {
  userId: 'firebase-uid',
  email: payload.email,
  userType: 'SCOUT',
};
const identity = {
  uid: user.userId,
  getIdToken: async () => 'test-id-token',
} as User;
describe('mobile Firebase bridge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    firebaseAuth.currentUser = identity;
    post.mockResolvedValue({
      data: { data: { user, token: 'test-custom-token' } },
    });
    get.mockResolvedValue({ data: { data: user } });
    createIdentity.mockResolvedValue({ user: identity });
  });
  it('registers once on the Firebase signup route then exchanges its custom token', async () => {
    await AuthService.register(payload);
    expect(post).toHaveBeenCalledWith('/auth/signup', payload);
    expect(customSignIn).toHaveBeenCalledWith(firebaseAuth, 'test-custom-token');
    expect(createIdentity).not.toHaveBeenCalled();
    expect(setToken).not.toHaveBeenCalledWith('test-custom-token');
  });
  it('loads the direct Firebase-authenticated user envelope', async () => {
    expect(await AuthService.getBackendUser(identity)).toEqual(user);
    expect(setToken).toHaveBeenCalledWith('test-id-token');
    expect(get).toHaveBeenCalledWith('/users/me');
    expect(await authApi.me()).toEqual(user);
  });
  it('does not install an ID token resolved after logout', async () => {
    let resolveToken!: (token: string) => void;
    const stale = {
      uid: 'old',
      getIdToken: () =>
        new Promise<string>((resolve) => {
          resolveToken = resolve;
        }),
    } as User;
    firebaseAuth.currentUser = stale;
    const pending = AuthService.getBackendUser(stale);
    firebaseAuth.currentUser = null;
    resolveToken('old-token');
    expect(await pending).toBeNull();
    expect(setToken).not.toHaveBeenCalledWith('old-token');
    expect(get).not.toHaveBeenCalled();
  });
  it('does not return a profile resolved after an account switch', async () => {
    let resolveProfile!: (value: unknown) => void;
    get.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        }),
    );
    const pending = AuthService.getBackendUser(identity);
    await Promise.resolve();
    firebaseAuth.currentUser = { uid: 'other' } as User;
    resolveProfile({ data: { data: user } });
    expect(await pending).toBeNull();
  });
  it('preserves API failure classification so session sync can offer a retry', async () => {
    const unavailable = Object.assign(new Error('Backend unavailable'), {
      statusCode: 503,
    });
    get.mockRejectedValueOnce(unavailable);
    await expect(AuthService.getBackendUser(identity)).rejects.toBe(unavailable);
  });
  it('keeps login on Firebase', async () => {
    await AuthService.login(payload.email, payload.password);
    expect(emailSignIn).toHaveBeenCalledWith(firebaseAuth, payload.email, payload.password);
    expect(post).not.toHaveBeenCalled();
  });
  it('does not sign in when backend signup fails', async () => {
    post.mockRejectedValueOnce(new Error('Duplicate email'));
    await expect(AuthService.register(payload)).rejects.toThrow('Duplicate email');
    expect(customSignIn).not.toHaveBeenCalled();
    expect(createIdentity).not.toHaveBeenCalled();
  });
});
