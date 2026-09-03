import { useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchNowPlayingMovies } from '../api/tmdb';
import { useMovies } from '../hooks/useMovies';
import { useWatchProviders } from '../hooks/useWatchProviders';

const MAX_SLIDES = 10;
const AUTOPLAY_INTERVAL_MS = 6000;
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
const PROVIDER_LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w45';

const chevronIcon = {
  left: faChevronLeft,
  right: faChevronRight,
};

const ChevronButton = ({
  direction,
  onClick,
  label,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  label: string;
}) => (
  <button
    type='button'
    onClick={onClick}
    aria-label={label}
    className='rounded-full p-1.5 text-white/70 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black'
  >
    <FontAwesomeIcon icon={chevronIcon[direction]} className='h-4 w-4' />
  </button>
);

const Hero = () => {
  const { movies, isLoading, error } = useMovies(fetchNowPlayingMovies);
  const slides = movies.slice(0, MAX_SLIDES);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const activeMovie = slides[activeIndex];
  const providers = useWatchProviders(activeMovie?.id ?? null);
  const shouldAutoAdvance = slides.length > 1 && !prefersReducedMotion;

  const goToPrevious = () =>
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const goToNext = () =>
    setActiveIndex((current) => (current + 1) % slides.length);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (slides.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  if (isLoading) {
    return (
      <div className='h-[70vh] min-h-[420px] w-full animate-pulse bg-neutral-900' />
    );
  }

  if (error || !activeMovie) {
    return (
      <div className='flex h-[70vh] min-h-[420px] w-full items-center justify-center bg-neutral-900 text-neutral-400'>
        Unable to load featured movies.
      </div>
    );
  }

  const backdropUrl = activeMovie.backdrop_path
    ? `${BACKDROP_BASE_URL}${activeMovie.backdrop_path}`
    : null;
  const releaseYear = activeMovie.release_date?.slice(0, 4);
  const watchProviders =
    providers?.flatrate ?? providers?.rent ?? providers?.buy ?? [];

  return (
    <section
      aria-roledescription='carousel'
      aria-label='Now playing movies'
      className='relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-neutral-900'
      onMouseEnter={() => {
        setIsPaused(true);
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsHovering(false);
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <AnimatePresence>
        {backdropUrl && (
          <motion.img
            key={activeMovie.id}
            src={backdropUrl}
            alt=''
            aria-hidden='true'
            draggable={false}
            fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{
              opacity: 1,
              scale: isHovering && !prefersReducedMotion ? 1.06 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: prefersReducedMotion ? 0 : 0.9, ease: 'easeInOut' },
              scale: { duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' },
            }}
            className='absolute inset-0 h-full w-full object-cover'
          />
        )}
      </AnimatePresence>

      {/* corner vignette */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,black_110%)]' />
      {/* bottom gradient for text legibility */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

      <div className='absolute inset-x-0 bottom-16 max-w-2xl px-6 sm:px-12'>
        <span className='mb-2 inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase'>
          Now Playing
        </span>

        <h1 className='text-3xl font-bold sm:text-5xl'>{activeMovie.title}</h1>

        <div className='mt-2 flex items-center gap-3 text-sm text-neutral-300'>
          {releaseYear && <span>{releaseYear}</span>}
          <span aria-hidden='true'>&middot;</span>
          <span className='flex items-center gap-1 font-bold text-accent'>
            <span aria-hidden='true'>&#9733;</span>
            {activeMovie.vote_average.toFixed(1)}
          </span>
        </div>

        <p className='mt-3 line-clamp-2 text-sm text-neutral-200 sm:line-clamp-3 sm:text-base'>
          {activeMovie.overview}
        </p>

        {watchProviders.length > 0 && providers?.link && (
          <div className='mt-4 flex items-center gap-2'>
            <span className='text-xs text-neutral-400'>Available on</span>
            <a
              href={providers.link}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Where to watch ${activeMovie.title} (opens JustWatch in a new tab)`}
              className='flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black'
            >
              {watchProviders.slice(0, 5).map((provider) => (
                <img
                  key={provider.provider_id}
                  src={`${PROVIDER_LOGO_BASE_URL}${provider.logo_path}`}
                  alt=''
                  className='h-8 w-8 rounded-md'
                />
              ))}
            </a>
            <span className='text-[10px] text-neutral-500'>
              Powered by JustWatch
            </span>
          </div>
        )}
      </div>

      <div className='absolute inset-x-0 bottom-6 flex items-center justify-center gap-3'>
        {slides.length > 1 && (
          <ChevronButton
            direction='left'
            onClick={goToPrevious}
            label='Previous slide'
          />
        )}

        <div className='flex items-center gap-2'>
          {slides.map((movie, index) =>
            index === activeIndex ? (
              <button
                key={movie.id}
                type='button'
                aria-label={`Slide ${index + 1} of ${slides.length}: ${movie.title}`}
                aria-current='true'
                onClick={() => setActiveIndex(index)}
                className='relative h-1.5 w-8 overflow-hidden rounded-full bg-white/30 transition-[width] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black'
              >
                <span
                  onAnimationEnd={() => {
                    if (shouldAutoAdvance && !isPaused) goToNext();
                  }}
                  style={
                    shouldAutoAdvance
                      ? {
                          animationName: 'hero-progress',
                          animationDuration: `${AUTOPLAY_INTERVAL_MS}ms`,
                          animationTimingFunction: 'linear',
                          animationFillMode: 'forwards',
                          animationPlayState: isPaused ? 'paused' : 'running',
                        }
                      : undefined
                  }
                  className={`absolute inset-0 origin-left rounded-full bg-accent ${
                    shouldAutoAdvance ? '' : 'scale-x-100'
                  }`}
                />
              </button>
            ) : (
              <button
                key={movie.id}
                type='button'
                aria-label={`Go to slide ${index + 1} of ${slides.length}: ${movie.title}`}
                onClick={() => setActiveIndex(index)}
                className='h-1.5 w-1.5 rounded-full bg-white/70 transition-[width,background-color] duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black'
              />
            ),
          )}
        </div>

        {slides.length > 1 && (
          <ChevronButton
            direction='right'
            onClick={goToNext}
            label='Next slide'
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
