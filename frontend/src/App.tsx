import { useState, useCallback } from 'react';
import { Navbar } from './layouts/Navbar';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AuthPage } from './pages/AuthPage';
import { AlertContainer } from './components/AlertContainer';
import { useAuth } from './hooks/useAuth';
import { useAlerts } from './hooks/useAlerts';
import type { Page } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, loading: authLoading, login, register, logout } = useAuth();
  const { alerts, removeAlert, success, error: showError } = useAlerts();

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login({ email, password });
        success('¡Inicio de sesión exitoso!');
        navigate('search');
      } catch (err: any) {
        showError(err.message || 'Error al iniciar sesión.');
      }
    },
    [login, success, showError, navigate]
  );

  const handleRegister = useCallback(
    async (fullName: string, email: string, password: string, customerId: number) => {
      try {
        await register({ full_name: fullName, email, password, customer_id: customerId });
        success('¡Cuenta creada exitosamente!');
        navigate('search');
      } catch (err: any) {
        showError(err.message || 'Error al registrarse.');
      }
    },
    [register, success, showError, navigate]
  );

  const handleLogout = useCallback(() => {
    logout();
    success('Has cerrado sesión correctamente.');
    navigate('home');
  }, [logout, success, navigate]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'search':
        return (
          <SearchPage
            user={user}
            onSuccess={success}
            onError={showError}
          />
        );
      case 'login':
        return (
          <AuthPage
            mode="login"
            onLogin={handleLogin}
            onRegister={handleRegister}
            onNavigate={navigate}
            loading={authLoading}
          />
        );
      case 'register':
        return (
          <AuthPage
            mode="register"
            onLogin={handleLogin}
            onRegister={handleRegister}
            onNavigate={navigate}
            loading={authLoading}
          />
        );
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
      />
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
      <main>{renderPage()}</main>
    </div>
  );
}
