import React from 'react';
import { Music, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-results' | 'initial';
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type = 'initial', message }) => {
  const Icon = type === 'no-results' ? Search : Music;
  const defaultMessage =
    type === 'no-results'
      ? 'No se encontraron canciones con los filtros seleccionados.'
      : 'Busca canciones por nombre, artista o género para comenzar.';

  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Icon className="w-16 h-16 mb-4 opacity-50" />
      <p className="text-lg font-medium text-gray-500">{message || defaultMessage}</p>
    </div>
  );
};
