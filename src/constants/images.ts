export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";
export const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";
export const POSTER_THUMB_BASE_URL = "https://image.tmdb.org/t/p/w92";
export const PROVIDER_LOGO_BASE_URL = "https://image.tmdb.org/t/p/w45";
export const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w185";

const BACKDROP_SRCSET_WIDTHS = [
  ["w780", 780],
  ["w1280", 1280],
  ["original", 1920],
] as const;

export const buildBackdropSrcSet = (
  backdropPath: string | null,
): string | undefined =>
  backdropPath
    ? BACKDROP_SRCSET_WIDTHS.map(
        ([size, width]) =>
          `https://image.tmdb.org/t/p/${size}${backdropPath} ${width}w`,
      ).join(", ")
    : undefined;
