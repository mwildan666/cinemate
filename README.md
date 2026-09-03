# Cinemate

A movie catalog web app built with React, TypeScript, and the TMDB API. Browse now playing, popular, top rated, and upcoming movies, search across TMDB's catalog, view full movie details, and build a personal watchlist — all saved locally in your browser.

**Live demo:** [cinemate-tmdb-app.netlify.app](https://cinemate-tmdb-app.netlify.app/)

## Features

- **Home** — animated now-playing hero carousel plus preview rows for Popular, Top Rated, and Upcoming
- **Discover** — a single paginated listing page with a Popular / Top Rated / Upcoming filter
- **Now Playing** — its own paginated listing page
- **Search** — debounced live search with a dropdown preview and a full results page
- **Movie details** — backdrop, poster, genres, runtime, rating, full overview, cast, watch providers, and similar movies
- **Watchlist** — add/remove movies from any card or the detail page, persisted to `localStorage`, with its own page to review what you've saved
- Responsive layout with a mobile nav drawer and a mobile search drawer
- Loading skeletons, error states, and empty states throughout
- Keyboard-accessible interactive elements with `aria-*` attributes

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — build tool
- [React Router](https://reactrouter.com/) — routing
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Motion](https://motion.dev/) — animation
- [Font Awesome](https://fontawesome.com/) — icons
- [TMDB API](https://www.themoviedb.org/documentation/api) — movie data

## Getting started

### Prerequisites

- Node.js 20 or newer
- A free [TMDB account](https://www.themoviedb.org/signup) and API Read Access Token

### 1. Clone and install

```bash
git clone https://github.com/mwildan666/cinemate.git
cd cinemate
npm install
```

### 2. Set up environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your TMDB API Read Access Token (find it under [TMDB Settings → API](https://www.themoviedb.org/settings/api) — use the "API Read Access Token", not the shorter "API Key"):

```
VITE_TMDB_TOKEN=your_read_access_token_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Available scripts

| Command           | Description                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR        |
| `npm run build`   | Type-check and build for production       |
| `npm run preview` | Preview the production build locally      |
| `npm run lint`    | Run ESLint                                |

## Deployment

This app is a static single-page app, deployed to [Netlify](https://www.netlify.com/).

1. Push the repo to GitHub (already done if you cloned it).
2. In Netlify: **Add new site → Import an existing project**, connect the `cinemate` repo.
3. Build settings (auto-detected from `netlify.toml`, but shown here for reference):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add the environment variables from your `.env` (**Site configuration → Environment variables**):
   - `VITE_TMDB_TOKEN`
   - `VITE_TMDB_BASE_URL`
5. Deploy. `public/_redirects` (and the matching rule in `netlify.toml`) makes client-side routing (React Router) work correctly on refresh/direct links.

## Project structure

```
src/
├── api/          # TMDB API calls
├── components/   # Reusable UI components
├── constants/    # Shared constants (genre map, grid layout classes)
├── context/      # React context (watchlist)
├── hooks/        # Custom hooks (data fetching, debounce, media query)
├── pages/        # Route-level pages
└── types/        # Shared TypeScript types
```

## Notes

- Watchlist data lives in `localStorage` only — it's per-browser and not synced anywhere.
- TMDB list endpoints return a fixed 20 items per page and cap out at page 500, regardless of how many total results are reported.
