import axios from "axios";

// Replace with your TMDb API key
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Create axios instance with common configuration
const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Image sizes for optimization
export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w185`,
    medium: `${IMAGE_BASE_URL}/w342`,
    large: `${IMAGE_BASE_URL}/w500`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  profile: {
    small: `${IMAGE_BASE_URL}/w45`,
    medium: `${IMAGE_BASE_URL}/w185`,
    large: `${IMAGE_BASE_URL}/h632`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

// API services
const tmdbApi = {
  // Get trending movies for the day or week
  getTrending: async (timeWindow = "day", page = 1) => {
    try {
      const response = await tmdbAxios.get(`/trending/movie/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  },

  // Search for movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbAxios.get("/search/movie", {
        params: {
          query,
          page,
          include_adult: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  // Get movie details by ID
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbAxios.get(`/movie/${movieId}`, {
        params: {
          append_to_response: "videos,credits,similar,recommendations",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbAxios.get("/movie/popular", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    }
  },

  // Get movie genres
  getGenres: async () => {
    try {
      const response = await tmdbAxios.get("/genre/movie/list");
      return response.data.genres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await tmdbAxios.get("/discover/movie", {
        params: {
          with_genres: genreId,
          page,
          sort_by: "popularity.desc",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await tmdbAxios.get("/movie/upcoming", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await tmdbAxios.get("/movie/top_rated", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
      throw error;
    }
  },

  // Get movie trailers
  getMovieTrailers: async (movieId) => {
    try {
      const response = await tmdbAxios.get(`/movie/${movieId}/videos`);
      return response.data.results;
    } catch (error) {
      console.error("Error fetching movie trailers:", error);
      throw error;
    }
  },
};

export default tmdbApi;
