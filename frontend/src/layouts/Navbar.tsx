import React from 'react';
import { Music2, LogIn, LogOut, UserCircle, Search } from 'lucide-react';
import type { Page, User } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, user, onLogout }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              super magnum ultra hyper sanguinaria conejo 2000 music studio
            </span>
          </button>

          {/* Nav links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'search'
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <UserCircle className="w-5 h-5 text-violet-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.first_name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'login' || currentPage === 'register'
                    ? 'bg-violet-600 text-white'
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
