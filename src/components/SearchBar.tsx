import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useMovieSearch } from "../hooks/useMovieSearch";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Movie } from "../types/movie";
import MobileDrawer from "./MobileDrawer";

const POSTER_THUMB_BASE_URL = "https://image.tmdb.org/t/p/w92";
const MAX_RESULTS_SHOWN = 6;
const EXPANDED_WIDTH = 360;
const COLLAPSED_WIDTH = 36;

interface SearchResultsListProps {
  isLoading: boolean;
  error: string | null;
  results: Movie[];
  onSelect: () => void;
  onSeeAll: () => void;
}

const SearchResultsList = ({
  isLoading,
  error,
  results,
  onSelect,
  onSeeAll,
}: SearchResultsListProps) => {
  if (isLoading) {
    return (
      <p className="px-4 py-3 text-sm text-neutral-400" aria-live="polite">
        Searching...
      </p>
    );
  }

  if (error) {
    return (
      <p className="px-4 py-3 text-sm text-neutral-400" aria-live="polite">
        Something went wrong. Try again.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="px-4 py-3 text-sm text-neutral-400" aria-live="polite">
        No movies found.
      </p>
    );
  }

  return (
    <>
      <ul className="max-h-96 overflow-y-auto py-2">
        {results.map((movie) => (
          <li key={movie.id} role="option" aria-selected={false}>
            <Link
              to={`/movie/${movie.id}`}
              onClick={onSelect}
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

      <button
        type="button"
        onClick={onSeeAll}
        className="block w-full border-t border-neutral-800 px-4 py-2.5 text-center text-sm font-bold text-accent transition-colors hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:outline-none"
      >
        See all results
      </button>
    </>
  );
};

interface SearchBarProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onOpen, onClose }: SearchBarProps) => {
  const listboxId = useId();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [prefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const { results, isLoading, error, hasQuery } = useMovieSearch(query);
  const visibleResults = results.slice(0, MAX_RESULTS_SHOWN);
  const showDropdown = isOpen && hasQuery;

  const collapse = () => {
    onClose();
    setQuery("");
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) collapse();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- collapse is stable in effect
  }, [isOpen]);

  const activate = () => {
    onOpen();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const goToSearchPage = () => {
    if (!hasQuery) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    collapse();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      collapse();
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      goToSearchPage();
    }
  };

  if (isDesktop) {
    return (
      <div
        ref={containerRef}
        className="relative flex items-center justify-end"
      >
        <motion.div
          animate={{
            width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
            backgroundColor: isOpen
              ? "rgba(0, 212, 255, 0.08)"
              : "rgba(255, 255, 255, 0)",
            borderColor: isOpen ? "rgb(0, 212, 255)" : "rgba(255, 255, 255, 0)",
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
              className={`h-4 w-4 transition-colors ${isOpen ? "text-accent" : "text-white"}`}
            />
          </button>

          <input
            ref={inputRef}
            type="text"
            role="combobox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={onOpen}
            onKeyDown={handleKeyDown}
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
            <SearchResultsList
              isLoading={isLoading}
              error={error}
              results={visibleResults}
              onSelect={collapse}
              onSeeAll={goToSearchPage}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <button
        type="button"
        onClick={activate}
        aria-label="Search movies"
        aria-expanded={isOpen}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
      </button>

      <MobileDrawer isOpen={isOpen}>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400"
              />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies..."
                aria-label="Search movies"
                aria-expanded={showDropdown}
                aria-controls={listboxId}
                aria-autocomplete="list"
                autoComplete="off"
                className="w-full rounded-full border border-accent bg-accent/10 py-2 pr-4 pl-10 text-sm text-white placeholder:text-neutral-400 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={collapse}
              aria-label="Close search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
          </div>

          {hasQuery && (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="mt-2"
            >
              <SearchResultsList
                isLoading={isLoading}
                error={error}
                results={visibleResults}
                onSelect={collapse}
                onSeeAll={goToSearchPage}
              />
            </div>
          )}
        </div>
      </MobileDrawer>
    </div>
  );
};

export default SearchBar;
