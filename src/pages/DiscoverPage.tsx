import { useId } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../api/tmdb";
import MovieListPage from "./MovieListPage";

const FILTERS = {
  popular: {
    label: "Popular",
    title: "Popular Movies",
    fetcher: fetchPopularMovies,
    showRating: true,
  },
  "top-rated": {
    label: "Top Rated",
    title: "Top Rated Movies",
    fetcher: fetchTopRatedMovies,
    showRating: true,
  },
  upcoming: {
    label: "Upcoming",
    title: "Upcoming Movies",
    fetcher: fetchUpcomingMovies,
    showRating: false,
  },
} as const;

type FilterKey = keyof typeof FILTERS;
const DEFAULT_FILTER: FilterKey = "popular";

const isFilterKey = (value: string | null): value is FilterKey =>
  value !== null && Object.hasOwn(FILTERS, value);

const DiscoverPage = () => {
  const selectId = useId();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawFilter = searchParams.get("filter");
  const filter: FilterKey = isFilterKey(rawFilter) ? rawFilter : DEFAULT_FILTER;
  const active = FILTERS[filter];

  const handleFilterChange = (next: FilterKey) => {
    setSearchParams(next === DEFAULT_FILTER ? {} : { filter: next });
  };

  return (
    <MovieListPage
      title={active.title}
      fetcher={active.fetcher}
      showRating={active.showRating}
      headerExtra={
        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="text-sm text-neutral-400">
            Filter
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value as FilterKey)}
              className="appearance-none rounded border border-white/40 bg-neutral-900 py-2 pr-9 pl-3 text-sm font-bold text-white transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {Object.entries(FILTERS).map(([key, { label }]) => (
                <option
                  key={key}
                  value={key}
                  className="bg-neutral-900 text-white"
                >
                  {label}
                </option>
              ))}
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 text-neutral-400"
            />
          </div>
        </div>
      }
    />
  );
};

export default DiscoverPage;
