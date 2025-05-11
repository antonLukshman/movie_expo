import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(
        `favorites_${user.username}`
      );
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `favorites_${user.username}`,
        JSON.stringify(favorites)
      );
    }
  }, [favorites, user]);

  // Add movie to favorites
  const addFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      // Check if movie already exists in favorites
      if (!prevFavorites.some((fav) => fav.id === movie.id)) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  };

  // Remove movie from favorites
  const removeFavorite = (movieId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== movieId)
    );
  };

  // Check if a movie is in favorites
  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
