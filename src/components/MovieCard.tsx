import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { getGenreNames } from "../constants/genres";
import { POSTER_BASE_URL } from "../constants/images";
import WatchlistButton from "./WatchlistButton";

const MAX_GENRES_SHOWN = 2;

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
}

const MovieCard = ({ movie, showRating = true }: MovieCardProps) => {
  const releaseYear = movie.release_date?.slice(0, 4);
  const genreNames = getGenreNames(movie.genre_ids).slice(0, MAX_GENRES_SHOWN);
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <div className="group relative">
      <Link
        to={`/movie/${movie.id}`}
        className="block overflow-hidden rounded-lg bg-neutral-900 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:hover:-translate-y-1"
      >
        <div className="aspect-2/3 w-full overflow-hidden bg-neutral-800">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-neutral-500">
              No poster available
            </div>
          )}
        </div>

        <div className="space-y-1 p-3">
          <h3 className="truncate text-sm font-bold text-white sm:text-base">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            {releaseYear && <span>{releaseYear}</span>}
            {showRating && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  <span aria-hidden="true">&#9733;</span>
                  {movie.vote_average.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {genreNames.length > 0 && (
            <p className="truncate text-xs text-neutral-500">
              {genreNames.join(", ")}
            </p>
          )}
        </div>
      </Link>

      <WatchlistButton
        movie={movie}
        compact
        className="absolute top-2 right-2 z-10"
      />
    </div>
  );
};

export default MovieCard;
