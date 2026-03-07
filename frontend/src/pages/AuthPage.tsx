import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';
import { RegisterForm } from '../features/auth/RegisterForm';
import type { Page } from '../types';

interface AuthPageProps {
  mode: 'login' | 'register';
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (fullName: string, email: string, password: string, customerId: number) => Promise<void>;
  onNavigate: (page: Page) => void;
  loading?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onLogin, onRegister, onNavigate, loading }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {mode === 'login' ? (
        <LoginForm
          onLogin={onLogin}
          onSwitchToRegister={() => onNavigate('register')}
          loading={loading}
        />
      ) : (
        <RegisterForm
          onRegister={onRegister}
          onSwitchToLogin={() => onNavigate('login')}
          loading={loading}
        />
      )}
    </div>
  );
};
