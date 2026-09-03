import { createContext } from "react";
import type { Movie } from "../types/movie";

export interface WatchlistContextValue {
  watchlist: Movie[];
  isInWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
}

export const WatchlistContext = createContext<WatchlistContextValue | null>(
  null,
);
