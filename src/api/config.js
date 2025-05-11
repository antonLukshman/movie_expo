// TMDb API Configuration
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "";
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN || "";
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL =
  process.env.REACT_APP_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

// Image sizes for TMDb
const BACKDROP_SIZE = "w1280";
const POSTER_SIZE = "w500";

// Preferred authentication method
const USE_ACCESS_TOKEN = !!ACCESS_TOKEN;

export {
  API_KEY,
  ACCESS_TOKEN,
  BASE_URL,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
  USE_ACCESS_TOKEN,
};
