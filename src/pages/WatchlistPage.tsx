import { AnimatePresence, motion } from "motion/react";
import { useWatchlist } from "../hooks/useWatchlist";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOVIE_LIST_GRID_CLASSES } from "../constants/layout";
import MovieCard from "../components/MovieCard";

const WatchlistPage = () => {
  const { watchlist } = useWatchlist();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-accent sm:text-3xl">
        My Watchlist
      </h1>
      <p className="mt-1 text-sm text-neutral-400">
        {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}
      </p>

      {watchlist.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-400">
          You haven't added any movies yet. Tap the + on a movie card, or "Add
          to Watchlist" on a movie's page, to save it here.
        </p>
      ) : (
        <div className={`${MOVIE_LIST_GRID_CLASSES} mt-6`}>
          <AnimatePresence mode="popLayout">
            {watchlist.map((movie) => (
              <motion.div
                key={movie.id}
                layout={!prefersReducedMotion}
                initial={false}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.5,
                        transition: { duration: 0.25, ease: "easeIn" },
                      }
                }
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
