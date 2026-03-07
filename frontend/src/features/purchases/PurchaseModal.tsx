import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import type { Track, User } from '../../types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  user: User | null;
  onConfirm: (trackId: number) => Promise<void>;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  track,
  user,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!track || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      await onConfirm(track.track_id);
      onClose();
    } catch {
      setError('Error al procesar la compra. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Compra">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Track info */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
          <h3 className="font-bold text-gray-900 text-lg">{track.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{track.artist} — {track.album}</p>
          <p className="text-sm text-gray-500 mt-0.5">{track.genre}</p>
          <p className="text-2xl font-bold text-violet-600 mt-3">${(Number(track.unit_price) || 0).toFixed(2)}</p>
        </div>

        {/* Customer ID */}
        <div>
          <p className="text-sm text-gray-600">
            Compra para el cliente ID: <span className="font-semibold">{user.customer_id}</span>
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Confirmar Compra
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
