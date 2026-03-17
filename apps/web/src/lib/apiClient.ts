// Unified API client for backend requests
// Automatically attaches backend JWT from token utility

import { getToken } from './token';

export interface ApiClientOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  baseUrl?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiClient(
  endpoint: string,
  { method = 'GET', headers = {}, body, baseUrl = BASE_URL }: ApiClientOptions = {}
) {
  const token = getToken();
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    // Optionally handle errors globally here
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
