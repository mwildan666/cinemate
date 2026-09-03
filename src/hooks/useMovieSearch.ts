import { useEffect, useState } from "react";
import { searchMovies } from "../api/tmdb";
import type { Movie } from "../types/movie";
import { useDebouncedValue } from "./useDebouncedValue";

const DEBOUNCE_MS = 350;

export const useMovieSearch = (query: string) => {
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, DEBOUNCE_MS);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedQuery, setLoadedQuery] = useState(debouncedQuery);

  if (debouncedQuery !== loadedQuery) {
    setLoadedQuery(debouncedQuery);
    setResults([]);
    setError(null);
    setIsLoading(debouncedQuery.length > 0);
  }

  useEffect(() => {
    if (!debouncedQuery) return;

    let cancelled = false;

    searchMovies(debouncedQuery)
      .then((res) => {
        if (!cancelled) setResults(res.results);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const isDebouncePending =
    trimmedQuery.length > 0 && trimmedQuery !== debouncedQuery;

  return {
    results,
    isLoading: isLoading || isDebouncePending,
    error,
    hasQuery: trimmedQuery.length > 0,
  };
};
