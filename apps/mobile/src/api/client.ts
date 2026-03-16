import axios from 'axios';
import Constants from 'expo-constants';

const LOCALHOST_API_BASE_URL = 'http://localhost:3002/api';

const isPrivateIpv4 = (value: string): boolean => {
  const match = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);

  if (!match) {
    return false;
  }

  const octets = match.slice(1).map((part) => Number(part));

  if (octets.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return false;
  }

  if (value === '127.0.0.1') {
    return false;
  }

  const [first, second] = octets;
  const is10 = first === 10;
  const is192 = first === 192 && second === 168;
  const is172 = first === 172 && second >= 16 && second <= 31;

  return is10 || is192 || is172;
};

const extractPrivateIpv4 = (hostLikeValue: string | null | undefined): string | null => {
  if (!hostLikeValue) {
    return null;
  }

  const normalized = hostLikeValue.trim().replace(/^https?:\/\//, '').split('/')[0] || '';
  const host = normalized.includes(':') ? normalized.split(':')[0] : normalized;

  if (!host || host.includes('[') || host.includes(']')) {
    return null;
  }

  return isPrivateIpv4(host) ? host : null;
};

const readHostCandidates = (): string[] => {
  const constantsAny = Constants as unknown as {
    expoGoConfig?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
    manifest?: { debuggerHost?: string };
  };

  return [
    Constants.expoConfig?.hostUri,
    constantsAny.expoGoConfig?.debuggerHost,
    constantsAny.manifest2?.extra?.expoClient?.hostUri,
    constantsAny.manifest?.debuggerHost,
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);
};

const detectLanApiBaseUrl = (): string => {
  const hostCandidates = readHostCandidates();

  for (const candidate of hostCandidates) {
    const ip = extractPrivateIpv4(candidate);

    if (ip) {
      return `http://${ip}:3002/api`;
    }
  }

  return LOCALHOST_API_BASE_URL;
};

export const API_BASE_URL = detectLanApiBaseUrl();

console.info(`[api] Using API base URL: ${API_BASE_URL}`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type AppApiError = Error & {
  statusCode?: number;
  details?: unknown;
};

const readBackendMessage = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const asRecord = data as Record<string, unknown>;

  if (typeof asRecord.message === 'string') {
    return asRecord.message;
  }

  if (asRecord.error && typeof asRecord.error === 'object') {
    const nested = asRecord.error as Record<string, unknown>;
    if (typeof nested.message === 'string') {
      return nested.message;
    }
  }

  return null;
};

const createApiError = (error: unknown): AppApiError => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const backendMessage = readBackendMessage(error.response?.data);

    let message = backendMessage || 'Request failed. Please try again.';

    if (!backendMessage && statusCode === 400) {
      message = 'Invalid request. Please check your input.';
    } else if (!backendMessage && statusCode === 401) {
      message = 'Unauthorized. Please log in again.';
    } else if (!backendMessage && statusCode === 500) {
      message = 'Server error. Please try again shortly.';
    } else if (!backendMessage && !statusCode) {
      message = 'Network error. Check your connection and backend server.';
    }

    const apiError = new Error(message) as AppApiError;
    apiError.statusCode = statusCode;
    apiError.details = error.response?.data;

    return apiError;
  }

  if (error instanceof Error) {
    return error as AppApiError;
  }

  return new Error('Unexpected error occurred.') as AppApiError;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(createApiError(error))
);

export const setAuthToken = (token: string | null) => {
  if (!token) {
    delete apiClient.defaults.headers.common.Authorization;
    return;
  }

  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default apiClient;
