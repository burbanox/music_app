import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../services/authService', () => ({
  authService: {
    getUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authService } from '../../services/authService';

describe('useAuth', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'user' as const,
    customer_id: 123,
    is_active: true,
  };

  const mockAuthResponse = {
    access_token: 'token_123',
    token_type: 'bearer',
    user: mockUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getUser).mockReturnValue(null);
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should initialize with user from localStorage', () => {
    vi.mocked(authService.getUser).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      vi.mocked(authService.login).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      let loginResponse;
      await act(async () => {
        loginResponse = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(loginResponse?.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
    });

    it('should set loading state during login', async () => {
      vi.mocked(authService.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockAuthResponse), 100))
      );

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.loading).toBe(true);
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(authService.login).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.login({
            email: 'test@example.com',
            password: 'wrong',
          });
        } catch (e) {
          // Error is expected
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      vi.mocked(authService.register).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      let registerResponse;
      await act(async () => {
        registerResponse = await result.current.register({
          email: 'newuser@example.com',
          full_name: 'New User',
          password: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(registerResponse?.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
    });

    it('should handle register error', async () => {
      const error = new Error('Email already exists');
      vi.mocked(authService.register).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.register({
            email: 'existing@example.com',
            full_name: 'User',
            password: 'password123',
          });
        } catch (e) {
          // Error is expected
        }
      });

      expect(result.current.error).toBe('Email already exists');
      expect(result.current.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should logout and clear user', () => {
      vi.mocked(authService.getUser).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(vi.mocked(authService.logout)).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user exists', () => {
      vi.mocked(authService.getUser).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return false when user is null', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
