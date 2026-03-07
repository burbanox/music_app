import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../features/songs/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const songInput = screen.getByPlaceholderText(/canciones/i);
    await user.type(songInput, 'Bohemian Rhapsody');

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        name: 'Bohemian Rhapsody',
        artist: '',
        genre: '',
      });
    });
  });
  it('should trim whitespace from search input', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const songInput = screen.getByPlaceholderText(/canciones/i);
    await user.type(songInput, '  Song Name  ');

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        name: 'Song Name',
        artist: '',
        genre: '',
      });
    });
  });
});
