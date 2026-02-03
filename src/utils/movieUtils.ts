
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  description?: string;
  year?: string;
  rating?: string;
  duration?: string;
  progress?: number;
  type?: "movie" | "series";
}

// TODO: Replace with your actual TMDB API Key from https://www.themoviedb.org/settings/api
const API_KEY = "1a6693362184f321885b871d2405489f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";



// Helper function to handle API calls
const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {


  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    ...params,
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return { results: [] };
  }
};

const formatMovie = (item: any): Movie => {
  return {
    id: item.id.toString(),
    title: item.title || item.name, // Support for TV shows having 'name'
    posterUrl: item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Popup",
    backdropUrl: item.backdrop_path
      ? `${BACKDROP_BASE_URL}${item.backdrop_path}`
      : undefined,
    description: item.overview,
    year: (item.release_date || item.first_air_date || "").substring(0, 4),
    rating: item.vote_average?.toFixed(1) || "N/A",
    type: item.media_type === "tv" || item.first_air_date ? "series" : "movie",
    // Note: Duration is not available in list responses, requires detail fetch
    duration: undefined,
  };
};

export const getTopMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/movie/top_rated", { page: page.toString() });
  return (data.results || []).slice(0, 10).map(formatMovie);
};

export const getTrendingMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/trending/movie/week", { page: page.toString() });
  return (data.results || []).map(formatMovie);
};

export const getNewReleases = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/movie/now_playing", { page: page.toString() });
  return (data.results || []).map(formatMovie);
};

// For "Endless Listing"
export const getDiscoverMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/discover/movie", {
    sort_by: "popularity.desc",
    page: page.toString()
  });
  return (data.results || []).map(formatMovie);
};

export const getActionMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/discover/movie", {
    with_genres: "28", // Action
    sort_by: "popularity.desc",
    page: page.toString()
  });
  return (data.results || []).map(formatMovie);
};

export const getComedyMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/discover/movie", {
    with_genres: "35", // Comedy
    sort_by: "popularity.desc",
    page: page.toString()
  });
  return (data.results || []).map(formatMovie);
};

export const getDramaMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/discover/movie", {
    with_genres: "18", // Drama
    sort_by: "popularity.desc",
    page: page.toString()
  });
  return (data.results || []).map(formatMovie);
};

// Search functionality
export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
  if (!query) return [];
  const data = await fetchFromTMDB("/search/multi", {
    query,
    page: page.toString()
  });
  return (data.results || [])
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .map(formatMovie);
};