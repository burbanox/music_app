import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { SearchFilters } from '../../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ name: name.trim(), artist: artist.trim(), genre: genre.trim() });
  };

  const handleClear = () => {
    setName('');
    setArtist('');
    setGenre('');
    onSearch({});
  };

  const hasFilters = name || artist || genre;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Buscar canciones por nombre..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow shadow-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3.5 rounded-xl border transition-all shadow-sm ${
            showFilters
              ? 'bg-violet-100 border-violet-300 text-violet-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Buscar
        </button>
      </div>

      {showFilters && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm animate-[slideDown_0.2s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Artista</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Nombre del artista..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Género</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Rock, Jazz, Pop..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </form>
  );
};
