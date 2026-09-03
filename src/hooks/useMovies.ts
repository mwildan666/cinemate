import { useEffect, useState } from 'react';
import type { Movie, TMDBResponse } from '../types/movie';

export const useMovies = (fetcher: () => Promise<TMDBResponse>) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedFetcher, setLoadedFetcher] = useState(() => fetcher);

  // Reset loading/error when the fetcher changes, without an effect
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  if (fetcher !== loadedFetcher) {
    setLoadedFetcher(() => fetcher);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((res) => {
        if (!cancelled) setMovies(res.results);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load movies');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return { movies, isLoading, error };
};
