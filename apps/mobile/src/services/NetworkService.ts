import apiClient from '../api/client';
import type { NetworkPage } from '@vysion/shared';
export const NetworkService = {
  async get<T>(path: string): Promise<T> {
    return (await apiClient.get<{ data: T }>(`/network${path}`)).data.data;
  },
  async list<T>(path: string, page: number): Promise<NetworkPage<T>> {
    return this.get(`${path}${path.includes('?') ? '&' : '?'}page=${page}&limit=20`);
  },
  async write<T>(method: 'post' | 'patch' | 'delete', path: string, data?: unknown): Promise<T> {
    return (await apiClient.request<{ data: T }>({ method, url: `/network${path}`, data })).data
      .data;
  },
};
