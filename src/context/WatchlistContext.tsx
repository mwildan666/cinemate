import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types/movie";
import { WatchlistContext } from "./watchlist-context";

const STORAGE_KEY = "cinemate:watchlist";

const readStoredWatchlist = (): Movie[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Movie[]) : [];
  } catch {
    return [];
  }
};

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>(readStoredWatchlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
      // storage may be disabled/full; watchlist still works for this session
    }
  }, [watchlist]);

  const isInWatchlist = useCallback(
    (movieId: number) => watchlist.some((movie) => movie.id === movieId),
    [watchlist],
  );

  const toggleWatchlist = useCallback((movie: Movie) => {
    setWatchlist((current) =>
      current.some((m) => m.id === movie.id)
        ? current.filter((m) => m.id !== movie.id)
        : [...current, movie],
    );
  }, []);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, isInWatchlist, toggleWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
