// Export the direct API implementation
import tmdbDirectApi from "./tmdbDirectApi";

// Default export
export default tmdbDirectApi;

// Named exports for individual functions
export const {
  searchMovies,
  getTrending,
  getMovieDetails,
  getRecommendations,
  getGenres,
} = tmdbDirectApi;
