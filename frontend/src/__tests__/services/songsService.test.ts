import { describe, it, expect, vi, beforeEach } from 'vitest';
import { songsService } from '../../services/songsService';

vi.mock('../../api/client', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '../../api/client';

describe('songsService', () => {
  const mockTracks = [
    {
      track_id: 1,
      name: 'Song 1',
      artist: 'Artist 1',
      genre: 'Rock',
      album: 'Album 1',
      unit_price: 9.99,
    },
    {
      track_id: 2,
      name: 'Song 2',
      artist: 'Artist 2',
      genre: 'Pop',
      album: 'Album 2',
      unit_price: 8.99,
    },
  ];

  const mockSearchResponse = {
    items: mockTracks,
    total: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should search songs by name', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockSearchResponse);

      const result = await songsService.search({ name: 'Song' });

      expect(result).toEqual(mockSearchResponse);
      expect(apiClient).toHaveBeenCalledWith(
        '/api/v1/songs/search?name=Song'
      );
    });

    it('should search songs by artist', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockSearchResponse);

      const result = await songsService.search({ artist: 'Artist 1' });

      expect(result).toEqual(mockSearchResponse);
      expect(apiClient).toHaveBeenCalledWith(
        '/api/v1/songs/search?artist=Artist+1'
      );
    });

    it('should search songs by genre', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockSearchResponse);

      const result = await songsService.search({ genre: 'Rock' });

      expect(result).toEqual(mockSearchResponse);
      expect(apiClient).toHaveBeenCalledWith('/api/v1/songs/search?genre=Rock');
    });

    it('should search with multiple filters', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockSearchResponse);

      const result = await songsService.search({
        name: 'Song',
        artist: 'Artist 1',
        genre: 'Rock',
      });

      expect(result).toEqual(mockSearchResponse);
      expect(apiClient).toHaveBeenCalled();
      const callUrl = vi.mocked(apiClient).mock.calls[0][0] as string;
      expect(callUrl).toContain('name=Song');
      expect(callUrl).toContain('artist=Artist+1');
      expect(callUrl).toContain('genre=Rock');
    });

    it('should return empty results when no tracks found', async () => {
      const emptyResponse = { items: [], total: 0 };
      vi.mocked(apiClient).mockResolvedValueOnce(emptyResponse);

      const result = await songsService.search({ name: 'NonExistent' });

      expect(result).toEqual(emptyResponse);
    });

    it('should handle no filters gracefully', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockSearchResponse);

      const result = await songsService.search({});

      expect(result).toEqual(mockSearchResponse);
      expect(apiClient).toHaveBeenCalledWith('/api/v1/songs/search');
    });
  });
});
