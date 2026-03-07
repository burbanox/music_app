import { apiClient } from '../api/client';
import type { TracksResponse, SearchFilters } from '../types';

export const songsService = {
  async search(filters: SearchFilters): Promise<TracksResponse> {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.artist) params.append('artist', filters.artist);
    if (filters.genre) params.append('genre', filters.genre);

    const query = params.toString();
    const endpoint = `/api/v1/songs/search${query ? `?${query}` : ''}`;

    return apiClient<TracksResponse>(endpoint);
  },
};
