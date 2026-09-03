import type { TMDBResponse, WatchProvidersResponse } from '../types/movie';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  accept: 'application/json',
};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }

  return res.json();
}

const fetchFromTMDB = (endpoint: string, page = 1) =>
  fetchJSON<TMDBResponse>(`${BASE_URL}${endpoint}?page=${page}`);

export const fetchPopularMovies = (page = 1) =>
  fetchFromTMDB('/movie/popular', page);

export const fetchTopRatedMovies = (page = 1) =>
  fetchFromTMDB('/movie/top_rated', page);

export const fetchUpcomingMovies = (page = 1) =>
  fetchFromTMDB('/movie/upcoming', page);

export const fetchNowPlayingMovies = (page = 1) =>
  fetchFromTMDB('/movie/now_playing', page);

export const fetchWatchProviders = (movieId: number) =>
  fetchJSON<WatchProvidersResponse>(
    `${BASE_URL}/movie/${movieId}/watch/providers`,
  );
