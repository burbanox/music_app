// ============ SONG / TRACK ============
export interface Track {
  track_id: number;
  name: string;
  artist: string;
  genre: string;
  album: string;
  unit_price: number;
}

export interface TracksResponse {
  items: Track[];
  total: number;
}

// ============ PURCHASE ============
export interface PurchaseRequest {
  track_id: number;
  customer_id: number;
}

export interface PurchaseResponse {
  message: string;
  invoice_id: number;
}

// ============ AUTH ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  customer_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  customer_id?: number;
}

// ============ GENRE ============
export interface Genre {
  genre_id: number;
  name: string;
}

// ============ ARTIST ============
export interface Artist {
  artist_id: number;
  name: string;
}

// ============ SEARCH ============
export interface SearchFilters {
  name?: string;
  artist?: string;
  genre?: string;
}

// ============ ALERTS ============
export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

// ============ APP STATE ============
export type Page = 'home' | 'login' | 'register' | 'search' | 'admin';
