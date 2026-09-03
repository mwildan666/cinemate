import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types/movie";

interface WatchlistButtonProps {
  movie: Movie;
  className?: string;
}

const WatchlistButton = ({ movie, className = "" }: WatchlistButtonProps) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const [prefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <motion.button
      type="button"
      onClick={() => toggleWatchlist(movie)}
      aria-pressed={inWatchlist}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
      className={`flex items-center justify-center gap-2 rounded border border-white/40 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black ${className}`}
    >
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
    </motion.button>
  );
};

export default WatchlistButton;
