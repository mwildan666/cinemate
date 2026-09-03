import type { TMDBResponse, WatchProvidersResponse } from "../types/movie";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  accept: "application/json",
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

const todayISODate = () => new Date().toISOString().slice(0, 10);

export const fetchPopularMovies = (page = 1) =>
  fetchFromTMDB("/movie/popular", page);

export const fetchTopRatedMovies = (page = 1) =>
  fetchFromTMDB("/movie/top_rated", page);

export const fetchUpcomingMovies = async (page = 1) => {
  const data = await fetchFromTMDB("/movie/upcoming", page);
  const today = todayISODate();
  return {
    ...data,
    results: data.results.filter((movie) => movie.release_date > today),
  };
};

export const fetchNowPlayingMovies = async (page = 1) => {
  const data = await fetchFromTMDB("/movie/now_playing", page);
  const today = todayISODate();
  return {
    ...data,
    results: data.results.filter((movie) => movie.release_date <= today),
  };
};

export const searchMovies = (query: string, page = 1) =>
  fetchJSON<TMDBResponse>(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
  );

export const fetchWatchProviders = (movieId: number) =>
  fetchJSON<WatchProvidersResponse>(
    `${BASE_URL}/movie/${movieId}/watch/providers`,
  );
