import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types/movie";
import { WatchlistContext } from "./watchlist-context";

const STORAGE_KEY = "cinemate:watchlist";

const isStoredMovie = (value: unknown): value is Movie =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Movie).id === "number" &&
  typeof (value as Movie).title === "string" &&
  typeof (value as Movie).vote_average === "number";

const readStoredWatchlist = (): Movie[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStoredMovie) : [];
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

  // Without this, a new object literal on every render would make every
  // consumer (e.g. a WatchlistButton on each of dozens of movie cards)
  // re-render whenever any single watchlist toggle changes `watchlist`.
  const value = useMemo(
    () => ({ watchlist, isInWatchlist, toggleWatchlist }),
    [watchlist, isInWatchlist, toggleWatchlist],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
