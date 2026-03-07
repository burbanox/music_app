import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
