import React, { useState, useCallback } from 'react';
import { SearchBar } from '../features/songs/SearchBar';
import { TrackList } from '../features/songs/TrackList';
import { PurchaseModal } from '../features/purchases/PurchaseModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { songsService } from '../services/songsService';
import { purchaseService } from '../services/purchaseService';
import type { Track, SearchFilters, User } from '../types';

interface SearchPageProps {
  user: User | null;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

type SearchState = 'initial' | 'loading' | 'success' | 'error' | 'empty';

// ---- Demo data for when backend is not available ----
const DEMO_TRACKS: Track[] = [
  { track_id: 1, name: 'For Those About To Rock (We Salute You)', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 2, name: 'Balls to the Wall', artist: 'Accept', genre: 'Rock', album: 'Balls to the Wall', unit_price: 0.99 },
  { track_id: 3, name: 'Fast As a Shark', artist: 'Accept', genre: 'Rock', album: 'Restless and Wild', unit_price: 0.99 },
  { track_id: 4, name: 'Restless and Wild', artist: 'Accept', genre: 'Rock', album: 'Restless and Wild', unit_price: 0.99 },
  { track_id: 5, name: 'Princess of the Dawn', artist: 'Accept', genre: 'Rock', album: 'Restless and Wild', unit_price: 0.99 },
  { track_id: 6, name: 'Put The Finger On You', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 7, name: "Let's Get It Up", artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 8, name: 'Inject The Venom', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 9, name: 'Snowballed', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 10, name: 'Evil Walks', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 11, name: 'Breaking The Rules', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 12, name: 'Night Of The Long Knives', artist: 'AC/DC', genre: 'Rock', album: 'For Those About To Rock We Salute You', unit_price: 0.99 },
  { track_id: 13, name: 'Smells Like Teen Spirit', artist: 'Nirvana', genre: 'Grunge', album: 'Nevermind', unit_price: 1.29 },
  { track_id: 14, name: 'Come As You Are', artist: 'Nirvana', genre: 'Grunge', album: 'Nevermind', unit_price: 1.29 },
  { track_id: 15, name: 'Lithium', artist: 'Nirvana', genre: 'Grunge', album: 'Nevermind', unit_price: 1.29 },
  { track_id: 16, name: 'Billie Jean', artist: 'Michael Jackson', genre: 'Pop', album: 'Thriller', unit_price: 1.29 },
  { track_id: 17, name: 'Beat It', artist: 'Michael Jackson', genre: 'Pop', album: 'Thriller', unit_price: 1.29 },
  { track_id: 18, name: 'Thriller', artist: 'Michael Jackson', genre: 'Pop', album: 'Thriller', unit_price: 1.29 },
  { track_id: 19, name: 'So What', artist: 'Miles Davis', genre: 'Jazz', album: 'Kind of Blue', unit_price: 0.99 },
  { track_id: 20, name: 'Blue in Green', artist: 'Miles Davis', genre: 'Jazz', album: 'Kind of Blue', unit_price: 0.99 },
  { track_id: 21, name: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', album: 'A Night at the Opera', unit_price: 1.29 },
  { track_id: 22, name: 'Somebody to Love', artist: 'Queen', genre: 'Rock', album: 'A Day at the Races', unit_price: 0.99 },
  { track_id: 23, name: 'Hotel California', artist: 'Eagles', genre: 'Rock', album: 'Hotel California', unit_price: 1.29 },
  { track_id: 24, name: 'Take It Easy', artist: 'Eagles', genre: 'Rock', album: 'Eagles', unit_price: 0.99 },
  { track_id: 25, name: 'Garota de Ipanema', artist: 'Antônio Carlos Jobim', genre: 'Bossa Nova', album: 'Getz/Gilberto', unit_price: 0.99 },
  { track_id: 26, name: 'Desafinado', artist: 'Antônio Carlos Jobim', genre: 'Bossa Nova', album: 'Getz/Gilberto', unit_price: 0.99 },
  { track_id: 27, name: 'Stairway to Heaven', artist: 'Led Zeppelin', genre: 'Rock', album: 'Led Zeppelin IV', unit_price: 1.29 },
  { track_id: 28, name: 'Whole Lotta Love', artist: 'Led Zeppelin', genre: 'Rock', album: 'Led Zeppelin II', unit_price: 0.99 },
  { track_id: 29, name: 'Imagine', artist: 'John Lennon', genre: 'Pop', album: 'Imagine', unit_price: 1.29 },
  { track_id: 30, name: 'Yesterday', artist: 'The Beatles', genre: 'Pop', album: 'Help!', unit_price: 0.99 },
];

function filterDemoTracks(filters: SearchFilters): Track[] {
  return DEMO_TRACKS.filter((t) => {
    if (filters.name && !t.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.artist && !t.artist.toLowerCase().includes(filters.artist.toLowerCase())) return false;
    if (filters.genre && !t.genre.toLowerCase().includes(filters.genre.toLowerCase())) return false;
    return true;
  });
}

export const SearchPage: React.FC<SearchPageProps> = ({ user, onSuccess, onError }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchState, setSearchState] = useState<SearchState>('initial');
  const [purchaseTrack, setPurchaseTrack] = useState<Track | null>(null);
  const [useDemoData, setUseDemoData] = useState(false);

  const handleSearch = useCallback(async (filters: SearchFilters) => {
    setSearchState('loading');
    try {
      const response = await songsService.search(filters);
      setTracks(response.items);
      setSearchState(response.items.length > 0 ? 'success' : 'empty');
      setUseDemoData(false);
    } catch {
      // Fallback to demo data when backend is not available
      const filtered = filterDemoTracks(filters);
      setTracks(filtered);
      setSearchState(filtered.length > 0 ? 'success' : 'empty');
      setUseDemoData(true);
    }
  }, []);

  const handlePurchase = useCallback(
    async (trackId: number) => {
      if (!user) {
        onError('Usuario no autenticado. Por favor, inicia sesión.');
        return;
      }

      if (useDemoData) {
        // Simulate purchase with demo data
        await new Promise((resolve) => setTimeout(resolve, 800));
        onSuccess(`¡Compra simulada exitosa! (Demo) Canción #${trackId} para cliente #${user.customer_id}`);
        return;
      }
      try {
        const response = await purchaseService.purchase({ track_id: trackId, customer_id: user.customer_id });
        onSuccess(response.message || `¡Compra exitosa! Factura #${response.invoice_id}`);
      } catch (err: any) {
        onError(err.message || 'Error al procesar la compra.');
        throw err;
      }
    },
    [onSuccess, onError, useDemoData, user]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Canciones</h1>
        <p className="text-gray-500">
          Encuentra tu música favorita por nombre, artista o género.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} loading={searchState === 'loading'} />

      {useDemoData && searchState === 'success' && (
        <div className="mt-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          ⚠️ Mostrando datos de demostración. El backend no está disponible.
        </div>
      )}

      <div className="mt-8">
        {searchState === 'loading' && <LoadingSpinner message="Buscando canciones..." />}
        {searchState === 'initial' && <EmptyState type="initial" />}
        {searchState === 'empty' && <EmptyState type="no-results" />}
        {searchState === 'success' && (
          <TrackList tracks={tracks} onPurchase={(track) => setPurchaseTrack(track)} />
        )}
        {searchState === 'error' && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg font-medium">
              Ocurrió un error al buscar canciones.
            </p>
            <p className="text-gray-400 mt-1">Por favor, intenta nuevamente.</p>
          </div>
        )}
      </div>

      <PurchaseModal
        isOpen={!!purchaseTrack}
        onClose={() => setPurchaseTrack(null)}
        track={purchaseTrack}
        user={user}
        onConfirm={handlePurchase}
      />
    </div>
  );
};
