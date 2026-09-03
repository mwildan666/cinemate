import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MovieListPage from "./pages/MovieListPage";
import DiscoverPage from "./pages/DiscoverPage";
import SearchPage from "./pages/SearchPage";
import { fetchNowPlayingMovies } from "./api/tmdb";

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
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
};

export default App;
