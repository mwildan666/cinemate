import { useEffect, useState } from "react";
import { fetchWatchProviders } from "../api/tmdb";
import type { WatchProviderRegion } from "../types/movie";

const REGION = "ID";

export const useWatchProviders = (movieId: number | null) => {
  const [providers, setProviders] = useState<WatchProviderRegion | null>(null);
  const [loadedMovieId, setLoadedMovieId] = useState(movieId);

  if (movieId !== loadedMovieId) {
    setLoadedMovieId(movieId);
    setProviders(null);
  }

  useEffect(() => {
    if (movieId === null) return;

    let cancelled = false;

    fetchWatchProviders(movieId)
      .then((res) => {
        if (!cancelled) setProviders(res.results[REGION] ?? null);
      })
      .catch(() => {
        if (!cancelled) setProviders(null);
      });

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  return providers;
};
