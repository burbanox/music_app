import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../../services/authService';

// Mock the apiClient module
vi.mock('../../api/client', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '../../api/client';

describe('authService', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'user' as const,
    customer_id: 123,
    is_active: true,
  };

  const mockAuthResponse = {
    access_token: 'mock_token_123',
    token_type: 'bearer',
    user: mockUser,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token and user', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockAuthResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockAuthResponse);
      expect(localStorage.getItem('auth_token')).toBe('mock_token_123');
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));
    });

    it('should call apiClient with correct endpoint and method', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockAuthResponse);

      await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(apiClient).toHaveBeenCalledWith('/api/v1/auth/login', {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
    });
  });

  describe('register', () => {
    it('should register successfully and store token and user', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockAuthResponse);

      const result = await authService.register({
        email: 'newuser@example.com',
        full_name: 'New User',
        password: 'password123',
      });

      expect(result).toEqual(mockAuthResponse);
      expect(localStorage.getItem('auth_token')).toBe('mock_token_123');
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));
    });

    it('should call apiClient with correct endpoint', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockAuthResponse);

      await authService.register({
        email: 'newuser@example.com',
        full_name: 'New User',
        password: 'password123',
      });

      expect(apiClient).toHaveBeenCalledWith('/api/v1/auth/register', {
        method: 'POST',
        body: {
          email: 'newuser@example.com',
          full_name: 'New User',
          password: 'password123',
        },
      });
    });
  });

  describe('logout', () => {
    it('should remove token and user from localStorage', () => {
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('auth_token', 'mock_token_123');

      const token = authService.getToken();

      expect(token).toBe('mock_token_123');
    });

    it('should return null if no token exists', () => {
      const token = authService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user from localStorage', () => {
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      const user = authService.getUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null if no user exists', () => {
      const user = authService.getUser();

      expect(user).toBeNull();
    });

    it('should handle "undefined" string gracefully', () => {
      localStorage.setItem('auth_user', 'undefined');

      const user = authService.getUser();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('auth_token', 'mock_token');

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false if no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
