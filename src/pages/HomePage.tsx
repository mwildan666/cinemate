import Hero from "../components/Hero";
import MovieSection from "../components/MovieSection";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../api/tmdb";

const HomePage = () => {
  return (
    <div className="space-y-8">
      <Hero />

      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-4">
        <MovieSection
          title="Popular"
          fetcher={fetchPopularMovies}
          viewAllHref="/popular"
        />
        <MovieSection
          title="Top Rated"
          fetcher={fetchTopRatedMovies}
          viewAllHref="/top-rated"
        />
        <MovieSection
          title="Upcoming"
          fetcher={fetchUpcomingMovies}
          viewAllHref="/upcoming"
          showRating={false}
        />
      </div>
    </div>
  );
};

export default HomePage;
