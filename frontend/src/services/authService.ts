import { apiClient } from '../api/client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: data,
    });
    localStorage.setItem('auth_token', response.access_token);
    if (response.user) {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: data,
    });
    localStorage.setItem('auth_token', response.access_token);
    if (response.user) {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
    return response;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser() {
    const user = localStorage.getItem('auth_user');
    // guard against the literal string "undefined" which may have been set by
    // earlier versions of the code when ``response.user`` was missing.
    if (!user || user === 'undefined') {
      return null;
    }
    return JSON.parse(user);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
