import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MovieListPage from "./pages/MovieListPage";
import SearchPage from "./pages/SearchPage";
import {
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "./api/tmdb";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/now-playing"
          element={
            <MovieListPage
              title="Now Playing"
              fetcher={fetchNowPlayingMovies}
            />
          }
        />
        <Route
          path="/popular"
          element={
            <MovieListPage
              title="Popular Movies"
              fetcher={fetchPopularMovies}
            />
          }
        />
        <Route
          path="/top-rated"
          element={
            <MovieListPage
              title="Top Rated Movies"
              fetcher={fetchTopRatedMovies}
            />
          }
        />
        <Route
          path="/upcoming"
          element={
            <MovieListPage
              title="Upcoming Movies"
              fetcher={fetchUpcomingMovies}
              showRating={false}
            />
          }
        />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
};

export default App;
