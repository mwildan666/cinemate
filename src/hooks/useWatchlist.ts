import { useContext } from "react";
import { WatchlistContext } from "../context/watchlist-context";

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
