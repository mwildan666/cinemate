import { AnimatePresence, motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useWatchlist } from "../hooks/useWatchlist";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Movie } from "../types/movie";

interface WatchlistButtonProps {
  movie: Movie;
  className?: string;
  compact?: boolean;
}

const FULL_CLASSES =
  "flex items-center justify-center gap-2 rounded border border-white/40 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const COMPACT_CLASSES =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const WatchlistButton = ({
  movie,
  className = "",
  compact = false,
}: WatchlistButtonProps) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleWatchlist(movie);
      }}
      aria-pressed={inWatchlist}
      aria-label={
        compact
          ? inWatchlist
            ? "Remove from watchlist"
            : "Add to watchlist"
          : undefined
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
      className={`${compact ? COMPACT_CLASSES : FULL_CLASSES} ${className}`}
    >
      {compact ? (
        <motion.span
          key={inWatchlist ? "liked" : "unliked"}
          initial={prefersReducedMotion ? undefined : { scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={`h-4 w-4 transition-colors ${inWatchlist ? "text-accent" : "text-white"}`}
          />
        </motion.span>
      ) : (
        <>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={inWatchlist ? "in" : "add"}
              initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: 45 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="flex"
            >
              <FontAwesomeIcon
                icon={inWatchlist ? faCheck : faPlus}
                className="h-4 w-4"
              />
            </motion.span>
          </AnimatePresence>
          {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </>
      )}
    </motion.button>
  );
};

export default WatchlistButton;
