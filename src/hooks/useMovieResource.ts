import { useEffect, useState } from "react";

export const useMovieResource = <T>(
  movieId: number,
  fetcher: (movieId: number) => Promise<T>,
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedMovieId, setLoadedMovieId] = useState(movieId);

  if (movieId !== loadedMovieId) {
    setLoadedMovieId(movieId);
    setData(null);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;

    fetcher(movieId)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher is a stable module-level function at every call site
  }, [movieId]);

  return { data, isLoading, error };
};
