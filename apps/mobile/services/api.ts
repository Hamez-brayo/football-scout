import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';
import Constants from 'expo-constants';

type ExpoExtra = { apiUrl?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
const API_URL = extra.apiUrl || 'http://localhost:3002/api';
const API_TIMEOUT = 30000;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        if (error.response) {
          // Server responded with error
          const { status, data } = error.response;

          if (status === 401) {
            // Token expired or invalid - try to refresh
            try {
              const user = auth.currentUser;
              if (user) {
                await user.getIdToken(true); // Force refresh
                // Retry the request
                const config = error.config!;
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
                return this.client(config);
              }
            } catch (refreshError) {
              // Refresh failed - user needs to log in again
              console.error('Token refresh failed:', refreshError);
              throw error;
            }
          }

          throw data || error;
        } else if (error.request) {
          // Request made but no response
          throw {
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: 'Network error. Please check your connection.',
            },
          };
        } else {
          // Something else happened
          throw {
            success: false,
            error: {
              code: 'UNKNOWN_ERROR',
              message: error.message || 'An unexpected error occurred',
            },
          };
        }
      }
    );
  }

  // Auth endpoints
  auth = {
    signup: (data: any) => this.client.post('/auth/signup', data),
    verifyToken: (idToken: string) => this.client.post('/auth/verify-token', { idToken }),
    signout: (userId: string) => this.client.post('/auth/signout', { userId }),
  };

  // User endpoints
  users = {
    getMe: () => this.client.get('/users/me'),
    getById: (id: string) => this.client.get(`/users/${id}`),
    updateProfile: (data: any) => this.client.put('/users/profile', data),
    updatePhysicalAttributes: (data: any) => this.client.put('/users/physical-attributes', data),
    updateFootballProfile: (data: any) => this.client.put('/users/football-profile', data),
    deleteAccount: () => this.client.delete('/users/account'),
  };

  // Player endpoints
  players = {
    search: (filters: any) => this.client.get('/players/search', { params: filters }),
    getById: (id: string) => this.client.get(`/players/${id}`),
    getStats: (id: string) => this.client.get(`/players/${id}/stats`),
  };
}

export const apiClient = new ApiClient();
export default apiClient;
