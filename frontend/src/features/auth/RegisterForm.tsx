import React, { useState } from 'react';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (fullName: string, email: string, password: string, customerId: number) => Promise<void>;
  onSwitchToLogin: () => void;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin, loading }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'El nombre completo es requerido.';
    if (!email.trim()) errs.email = 'El correo electrónico es requerido.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Ingresa un correo válido.';
    if (!customerId.trim()) errs.customerId = 'El ID del cliente es requerido.';
    else if (isNaN(Number(customerId)) || Number(customerId) <= 0) errs.customerId = 'Ingresa un ID válido (número positivo).';
    if (!password) errs.password = 'La contraseña es requerida.';
    else if (password.length < 4) errs.password = 'La contraseña debe tener al menos 4 caracteres.';
    if (password !== confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onRegister(fullName.trim(), email.trim(), password, Number(customerId));
  };

  const clearError = (field: string) => setErrors((p) => ({ ...p, [field]: '' }));

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="text-gray-500 mt-1">Únete a Chinook Music Store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-fullname" className="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo</label>
            <input
              id="reg-fullname"
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
              placeholder="Juan Pérez"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              placeholder="tu@email.com"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="reg-custid" className="block text-sm font-medium text-gray-700 mb-1.5">ID del Cliente</label>
            <input
              id="reg-custid"
              type="number"
              min="1"
              value={customerId}
              onChange={(e) => { setCustomerId(e.target.value); clearError('customerId'); }}
              placeholder="Ej: 5"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.customerId ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.customerId && <p className="text-xs text-red-500 mt-1">{errors.customerId}</p>}
          </div>

          <div>
            <label htmlFor="reg-pass" className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                id="reg-pass"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                placeholder="Mínimo 6 caracteres"
                className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="reg-cpass" className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Contraseña</label>
            <input
              id="reg-cpass"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
              placeholder="Repite tu contraseña"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-violet-600 font-semibold hover:text-violet-700"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
