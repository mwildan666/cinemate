import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight, faStar } from "@fortawesome/free-solid-svg-icons";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
} from "../api/tmdb";
import { useMovieResource } from "../hooks/useMovieResource";
import { useWatchProviders } from "../hooks/useWatchProviders";
import type {
  CastMember,
  CreditsResponse,
  Movie,
  MovieDetails,
} from "../types/movie";
import WatchlistButton from "../components/WatchlistButton";
import MovieSection from "../components/MovieSection";
import {
  BACKDROP_BASE_URL,
  buildBackdropSrcSet,
  POSTER_BASE_URL,
  PROVIDER_LOGO_BASE_URL,
  PROFILE_BASE_URL,
} from "../constants/images";

const MAX_CAST_SHOWN = 12;

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h ${remaining}m` : `${remaining}m`;
};

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const {
    data: movie,
    isLoading,
    error,
  } = useMovieResource<MovieDetails>(movieId, fetchMovieDetails);
  const { data: credits } = useMovieResource<CreditsResponse>(
    movieId,
    fetchMovieCredits,
  );
  const providers = useWatchProviders(movieId);
  const similarFetcher = useMemo(
    () => () => fetchSimilarMovies(movieId),
    [movieId],
  );

  const castScrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ startX: 0, scrollLeft: 0 });
  const [isDraggingCast, setIsDraggingCast] = useState(false);

  // MovieDetailPage is reused (not remounted) when navigating between movies
  // via "Similar Movies" links, since only the :id route param changes — so
  // scroll position from the previous movie would otherwise carry over.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (castScrollRef.current) castScrollRef.current.scrollLeft = 0;
  }, [movieId]);

  const handleCastMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!castScrollRef.current) return;
    dragStartRef.current = {
      startX: e.pageX,
      scrollLeft: castScrollRef.current.scrollLeft,
    };
    setIsDraggingCast(true);
  };

  useEffect(() => {
    if (!isDraggingCast) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!castScrollRef.current) return;
      const delta = e.pageX - dragStartRef.current.startX;
      castScrollRef.current.scrollLeft = dragStartRef.current.scrollLeft - delta;
    };
    const stopDragging = () => setIsDraggingCast(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);
    // If the button is released outside the browser window (or the window
    // loses focus entirely, e.g. alt-tab), no "mouseup" reaches `document` —
    // without this, isDraggingCast would stay stuck true and any later
    // mouse movement over the page would keep yanking the scroll position.
    window.addEventListener("blur", stopDragging);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("blur", stopDragging);
    };
  }, [isDraggingCast]);

  const cast = credits?.cast.slice(0, MAX_CAST_SHOWN) ?? [];
  const watchProviders =
    [providers?.flatrate, providers?.rent, providers?.buy].find(
      (list) => list && list.length > 0,
    ) ?? [];

  if (isLoading) {
    return (
      <div className="pt-16">
        <div className="h-[55vh] min-h-96 w-full animate-pulse bg-neutral-900" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-neutral-400">
        Unable to load this movie.
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : null;
  const backdropSrcSet = buildBackdropSrcSet(movie.backdrop_path);
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : null;
  const releaseYear = movie.release_date?.slice(0, 4);
  const runtime = formatRuntime(movie.runtime);
  // Watchlist storage uses the shared Movie shape (genre_ids), while the
  // details endpoint returns full genre objects instead — adapt here.
  const watchlistMovie: Movie = {
    ...movie,
    genre_ids: movie.genres.map((genre) => genre.id),
  };

  return (
    <div>
      <div className="relative h-[55vh] min-h-96 w-full overflow-hidden bg-neutral-900">
        {backdropUrl && (
          <img
            src={backdropUrl}
            srcSet={backdropSrcSet}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,black_110%)]" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 pb-12">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="hidden aspect-2/3 w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-800 shadow-xl sm:block sm:w-56">
            {posterUrl && (
              <img
                src={posterUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="pt-2 sm:flex-1">
            <h1 className="text-2xl font-bold sm:text-4xl">{movie.title}</h1>

            {movie.tagline && (
              <p className="mt-1 text-sm text-neutral-400 italic">
                {movie.tagline}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              {releaseYear && <span>{releaseYear}</span>}
              {runtime && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{runtime}</span>
                </>
              )}
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1 font-bold text-accent">
                <FontAwesomeIcon icon={faStar} className="h-3.5 w-3.5" />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 max-w-3xl text-sm text-neutral-200 sm:text-base">
              {movie.overview}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <WatchlistButton movie={watchlistMovie} />

              {watchProviders.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Available on</span>
                  <div className="flex items-center gap-1.5">
                    {watchProviders.slice(0, 5).map((provider) => (
                      <img
                        key={provider.provider_id}
                        src={`${PROVIDER_LOGO_BASE_URL}${provider.logo_path}`}
                        alt={provider.provider_name}
                        title={provider.provider_name}
                        className="h-7 w-7 rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <section aria-labelledby="cast-heading" className="mt-10">
            <div className="mb-2 flex items-center justify-between">
              <h2 id="cast-heading" className="text-xl font-bold text-accent">
                CAST
              </h2>
              <span className="hidden items-center gap-1.5 text-xs text-neutral-500 sm:flex">
                <FontAwesomeIcon icon={faArrowsLeftRight} className="h-3 w-3" />
                Drag to explore
              </span>
            </div>
            <div
              ref={castScrollRef}
              onMouseDown={handleCastMouseDown}
              className={`flex gap-4 overflow-x-auto pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                isDraggingCast ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ msOverflowStyle: "none" }}
            >
              {cast.map((member: CastMember) => (
                <div key={member.id} className="w-28 shrink-0">
                  <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-neutral-800">
                    {member.profile_path && (
                      <img
                        src={`${PROFILE_BASE_URL}${member.profile_path}`}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-xs font-bold text-white">
                    {member.name}
                  </p>
                  <p className="truncate text-xs text-neutral-400">
                    {member.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <MovieSection title="Similar Movies" fetcher={similarFetcher} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
