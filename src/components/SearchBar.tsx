import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMovieSearch } from "../hooks/useMovieSearch";

const POSTER_THUMB_BASE_URL = "https://image.tmdb.org/t/p/w92";
const MAX_RESULTS_SHOWN = 6;
const EXPANDED_WIDTH = 360;
const COLLAPSED_WIDTH = 36;

const SearchBar = () => {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [prefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const { results, isLoading, error, hasQuery } = useMovieSearch(query);
  const visibleResults = results.slice(0, MAX_RESULTS_SHOWN);
  const showDropdown = isActive && hasQuery;

  const collapse = () => {
    setIsActive(false);
    setQuery("");
  };

  useEffect(() => {
    if (!isActive) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) collapse();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isActive]);

  const activate = () => {
    setIsActive(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      <motion.div
        animate={{
          width: isActive ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
          backgroundColor: isActive
            ? "rgba(0, 212, 255, 0.08)"
            : "rgba(255, 255, 255, 0)",
          borderColor: isActive ? "rgb(0, 212, 255)" : "rgba(255, 255, 255, 0)",
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: "easeInOut",
        }}
        className="flex h-9 items-center overflow-hidden rounded-full border"
      >
        <button
          type="button"
          onClick={activate}
          aria-label="Search movies"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={`h-4 w-4 transition-colors ${isActive ? "text-accent" : "text-white"}`}
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              collapse();
              inputRef.current?.blur();
            }
          }}
          placeholder="Search movies..."
          aria-label="Search movies"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent pr-4 text-sm text-white placeholder:text-neutral-400 focus:outline-none"
        />
      </motion.div>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl"
        >
          {isLoading && (
            <p
              className="px-4 py-3 text-sm text-neutral-400"
              aria-live="polite"
            >
              Searching...
            </p>
          )}

          {!isLoading && error && (
            <p
              className="px-4 py-3 text-sm text-neutral-400"
              aria-live="polite"
            >
              Something went wrong. Try again.
            </p>
          )}

          {!isLoading && !error && visibleResults.length === 0 && (
            <p
              className="px-4 py-3 text-sm text-neutral-400"
              aria-live="polite"
            >
              No movies found.
            </p>
          )}

          {!isLoading && !error && visibleResults.length > 0 && (
            <ul className="max-h-96 overflow-y-auto py-2">
              {visibleResults.map((movie) => (
                <li key={movie.id} role="option" aria-selected={false}>
                  <Link
                    to={`/movie/${movie.id}`}
                    onClick={collapse}
                    className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:outline-none"
                  >
                    <div className="aspect-2/3 w-10 shrink-0 overflow-hidden rounded bg-neutral-800">
                      {movie.poster_path && (
                        <img
                          src={`${POSTER_THUMB_BASE_URL}${movie.poster_path}`}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {movie.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {movie.release_date?.slice(0, 4) || "TBA"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
