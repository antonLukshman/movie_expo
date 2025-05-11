import React, { createContext, useState, useEffect, useMemo } from "react";
import tmdbApi from "../api/tmdbApi";

// Create context
export const MovieContext = createContext({
  favorites: [],
  lastSearched: null,
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => {},
  setLastSearched: () => {},
  genres: [],
});

export const MovieProvider = ({ children }) => {
  // State for favorites
  const [favorites, setFavorites] = useState([]);
  // State for the last searched movie
  const [lastSearched, setLastSearched] = useState(null);
  // State for genres
  const [genres, setGenres] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    const storedLastSearched = localStorage.getItem("lastSearched");
    if (storedLastSearched) {
      setLastSearched(JSON.parse(storedLastSearched));
    }
  }, []);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await tmdbApi.getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save last searched to localStorage whenever it changes
  useEffect(() => {
    if (lastSearched) {
      localStorage.setItem("lastSearched", JSON.stringify(lastSearched));
    }
  }, [lastSearched]);

  // Add a movie to favorites
  const addToFavorites = (movie) => {
    setFavorites((prevFavorites) => {
      // Check if the movie is already in favorites
      if (prevFavorites.some((favMovie) => favMovie.id === movie.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, movie];
    });
  };

  // Remove a movie from favorites
  const removeFromFavorites = (movieId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== movieId)
    );
  };

  // Check if a movie is in favorites
  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  // Update last searched movie
  const updateLastSearched = (movie) => {
    setLastSearched(movie);
  };

  // Context value
  const movieContextValue = useMemo(
    () => ({
      favorites,
      lastSearched,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      setLastSearched: updateLastSearched,
      genres,
    }),
    [favorites, lastSearched, genres]
  );

  return (
    <MovieContext.Provider value={movieContextValue}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook for using movie context
export const useMovie = () => {
  const context = React.useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};
