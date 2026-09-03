import { useEffect, useId } from "react";
import type { ReactNode, SubmitEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { TMDBResponse } from "../types/movie";
import { usePaginatedMovies } from "../hooks/usePaginatedMovies";
import { MOVIE_LIST_GRID_CLASSES } from "../constants/layout";
import MovieCard from "../components/MovieCard";
import CardSkeletonGrid from "../components/CardSkeletonGrid";

const SKELETON_COUNT = 10;

interface MovieListPageProps {
  title: string;
  fetcher: (page: number) => Promise<TMDBResponse>;
  showRating?: boolean;
  showResultCount?: boolean;
  emptyMessage?: string;
  headerExtra?: ReactNode;
}

const MovieListPage = ({
  title,
  fetcher,
  showRating = true,
  showResultCount = false,
  emptyMessage = "No movies found.",
  headerExtra,
}: MovieListPageProps) => {
  const jumpInputId = useId();
  const { movies, isLoading, error, page, setPage, totalPages, totalResults } =
    usePaginatedMovies(fetcher);

  const handleJumpToPage = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(new FormData(e.currentTarget).get("page"));
    if (Number.isInteger(value) && value >= 1 && value <= totalPages) {
      setPage(value);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-accent sm:text-3xl">{title}</h1>
        {headerExtra}
      </div>
      {showResultCount && !isLoading && !error && (
        <p className="mt-1 text-sm text-neutral-400">
          {totalResults.toLocaleString()}{" "}
          {totalResults === 1 ? "result" : "results"}
        </p>
      )}

      {isLoading && (
        <CardSkeletonGrid
          count={SKELETON_COUNT}
          gridClassName={`${MOVIE_LIST_GRID_CLASSES} mt-6`}
        />
      )}

      {!isLoading && error && (
        <p className="mt-6 text-sm text-neutral-400">
          Unable to load movies. Please try again.
        </p>
      )}

      {!isLoading && !error && movies.length === 0 && (
        <p className="mt-6 text-sm text-neutral-400">{emptyMessage}</p>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <>
          <div className={`${MOVIE_LIST_GRID_CLASSES} mt-6`}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showRating={showRating} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPage((current) => current - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-2 rounded border border-white/40 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-30"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
                  Previous
                </button>

                <span className="text-sm text-neutral-400">
                  Page {page} of {totalPages.toLocaleString()}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 rounded border border-white/40 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-30"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
                </button>
              </div>

              <form
                onSubmit={handleJumpToPage}
                className="flex items-center gap-2"
              >
                <label
                  htmlFor={jumpInputId}
                  className="text-sm text-neutral-400"
                >
                  Go to page
                </label>
                <input
                  key={page}
                  id={jumpInputId}
                  name="page"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={totalPages}
                  defaultValue={page}
                  className="w-16 rounded border border-white/40 bg-transparent px-2 py-1 text-center text-sm text-white focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded border border-white/40 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Go
                </button>
              </form>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default MovieListPage;
