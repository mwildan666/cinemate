import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieListPage from './MovieListPage';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  const fetcher = useMemo(() => (page: number) => searchMovies(query, page), [query]);

  if (!query) {
    return (
      <div className='mx-auto max-w-7xl px-4 pt-24 pb-12'>
        <h1 className='text-2xl font-bold text-accent sm:text-3xl'>Search</h1>
        <p className='mt-6 text-sm text-neutral-400'>
          Type something in the search bar to find movies.
        </p>
      </div>
    );
  }

  return (
    <MovieListPage
      title={`Search results for "${query}"`}
      fetcher={fetcher}
      showResultCount
      emptyMessage={`No movies found for "${query}".`}
    />
  );
};

export default SearchPage;
