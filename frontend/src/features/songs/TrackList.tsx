import React from 'react';
import { ShoppingCart, Music, User, Disc3, Tag } from 'lucide-react';
import type { Track } from '../../types';

interface TrackListProps {
  tracks: Track[];
  onPurchase: (track: Track) => void;
}

export const TrackList: React.FC<TrackListProps> = ({ tracks, onPurchase }) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 font-medium px-1">
        {tracks.length} {tracks.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <div className="grid gap-3">
        {tracks.map((track) => (
          <div
            key={track.track_id}
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-violet-200 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate text-lg">{track.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {track.artist}
                    </span>
                    {track.album && (
                      <span className="flex items-center gap-1.5">
                        <Disc3 className="w-3.5 h-3.5" />
                        {track.album}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      {track.genre}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-lg font-bold text-gray-900">
                  ${track.unit_price.toFixed(2)}
                </span>
                <button
                  onClick={() => onPurchase(track)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Comprar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
