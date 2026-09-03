import { useId } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import type { TMDBResponse } from "../types/movie";
import { useMovies } from "../hooks/useMovies";
import MovieCard from "./MovieCard";

const CARD_LIMIT = 6;
const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

interface MovieSectionProps {
  title: string;
  fetcher: () => Promise<TMDBResponse>;
  viewAllHref: string;
  showRating?: boolean;
}

const MovieSection = ({
  title,
  fetcher,
  viewAllHref,
  showRating = true,
}: MovieSectionProps) => {
  const headingId = useId();
  const { movies, isLoading, error } = useMovies(fetcher);
  const visibleMovies = movies.slice(0, CARD_LIMIT);
  const shouldShowViewAll = !isLoading && !error && movies.length > CARD_LIMIT;

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 id={headingId} className="text-xl font-bold text-accent">
          {title}
        </h2>

        {shouldShowViewAll && (
          <Link
            to={viewAllHref}
            className="flex shrink-0 items-center gap-1.5 rounded text-sm font-bold text-neutral-300 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            See more
            <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
          </Link>
        )}
      </div>

      {isLoading && (
        <div className={GRID_CLASSES} aria-hidden="true">
          {Array.from({ length: CARD_LIMIT }, (_, i) => (
            <div
              key={i}
              className="aspect-2/3 w-full animate-pulse rounded-lg bg-neutral-900"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-neutral-400">
          Unable to load {title.toLowerCase()} movies.
        </p>
      )}

      {!isLoading && !error && (
        <div className={GRID_CLASSES}>
          {visibleMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showRating={showRating} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieSection;
