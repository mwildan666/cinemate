import { useEffect, useState } from "react";
import type { Movie, TMDBResponse } from "../types/movie";

const TMDB_MAX_PAGE = 500;

export const usePaginatedMovies = (
  fetcher: (page: number) => Promise<TMDBResponse>,
) => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedFetcher, setLoadedFetcher] = useState(() => fetcher);
  const [loadedPage, setLoadedPage] = useState(page);

  if (fetcher !== loadedFetcher) {
    setLoadedFetcher(() => fetcher);
    setLoadedPage(1);
    setPage(1);
    setIsLoading(true);
    setError(null);
  } else if (page !== loadedPage) {
    setLoadedPage(page);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;

    fetcher(page)
      .then((res) => {
        if (!cancelled) {
          setMovies(res.results);
          setTotalPages(Math.min(res.total_pages, TMDB_MAX_PAGE));
          setTotalResults(res.total_results);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load movies",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, page]);

  return { movies, isLoading, error, page, setPage, totalPages, totalResults };
};
