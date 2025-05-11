import axios from "axios";
import {
  API_KEY,
  ACCESS_TOKEN,
  BASE_URL,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
  USE_ACCESS_TOKEN,
} from "./config";

// Create axios instance with the appropriate authentication
const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  headers: USE_ACCESS_TOKEN ? { Authorization: `Bearer ${ACCESS_TOKEN}` } : {},
  params: USE_ACCESS_TOKEN ? {} : { api_key: API_KEY },
});

// Format movie data consistently
const formatMovieData = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster: movie.poster_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
    : null,
  backdrop: movie.backdrop_path
    ? `${IMAGE_BASE_URL}/${BACKDROP_SIZE}${movie.backdrop_path}`
    : null,
  overview: movie.overview,
  releaseDate: movie.release_date,
  rating: movie.vote_average,
  genreIds: movie.genre_ids || [],
  genres: movie.genres || [],
  adult: movie.adult || false,
});

// API endpoints
const tmdbApi = {
  // Get trending movies
  getTrending: async (timeWindow = "day", page = 1) => {
    try {
      const response = await tmdbAxios.get(`/trending/movie/${timeWindow}`, {
        params: { page },
      });
      return {
        results: response.data.results.map(formatMovieData),
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  },

  // Search movies by query
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbAxios.get("/search/movie", {
        params: {
          query,
          page,
          include_adult: false,
        },
      });
      return {
        results: response.data.results.map(formatMovieData),
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
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
          append_to_response: "videos,credits",
        },
      });

      // Get trailer
      const trailer = response.data.videos?.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      // Get cast (limit to top 10)
      const cast =
        response.data.credits?.cast?.slice(0, 10)?.map((person) => ({
          id: person.id,
          name: person.name,
          character: person.character,
          profile: person.profile_path
            ? `${IMAGE_BASE_URL}/w185${person.profile_path}`
            : null,
        })) || [];

      // Get crew (directors, writers, etc.)
      const crew =
        response.data.credits?.crew
          ?.filter((person) =>
            ["Director", "Writer", "Screenplay", "Story"].includes(person.job)
          )
          ?.map((person) => ({
            id: person.id,
            name: person.name,
            job: person.job,
            profile: person.profile_path
              ? `${IMAGE_BASE_URL}/w185${person.profile_path}`
              : null,
          })) || [];

      return {
        ...formatMovieData(response.data),
        genres: response.data.genres || [],
        runtime: response.data.runtime,
        tagline: response.data.tagline,
        trailer: trailer ? trailer.key : null,
        cast,
        crew,
      };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },

  // Get movie recommendations
  getRecommendations: async (movieId, page = 1) => {
    try {
      const response = await tmdbAxios.get(
        `/movie/${movieId}/recommendations`,
        {
          params: { page },
        }
      );
      return {
        results: response.data.results.map(formatMovieData),
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      throw error;
    }
  },

  // Get genre list
  getGenres: async () => {
    try {
      const response = await tmdbAxios.get("/genre/movie/list");
      return response.data.genres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  },
};

// Make sure we're explicitly exporting the tmdbApi object
export default tmdbApi;
