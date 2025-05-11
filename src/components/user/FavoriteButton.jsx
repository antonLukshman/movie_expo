import React from "react";
import { IconButton, Tooltip, Badge } from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useMovie } from "../../context/MovieContext";
import { useNavigate } from "react-router-dom";

const FavoriteButton = ({
  movie,
  showCount = false,
  size = "medium",
  color = "default",
}) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, favorites } =
    useMovie();
  const navigate = useNavigate();

  const isFav = movie && isFavorite(movie.id);

  const handleFavoriteToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (isFav) {
      removeFromFavorites(movie.id);
    } else if (movie) {
      addToFavorites(movie);
    }
  };

  if (!movie) {
    return (
      <Tooltip
        title={isAuthenticated ? "View favorites" : "Login to see favorites"}
      >
        <IconButton
          color={color}
          size={size}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("/favorites");
          }}
        >
          {showCount ? (
            <Badge badgeContent={favorites.length} color="secondary">
              <FavoriteIcon
                color={
                  isAuthenticated && favorites.length > 0
                    ? "secondary"
                    : "inherit"
                }
              />
            </Badge>
          ) : (
            <FavoriteIcon
              color={
                isAuthenticated && favorites.length > 0
                  ? "secondary"
                  : "inherit"
              }
            />
          )}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        isAuthenticated
          ? isFav
            ? "Remove from favorites"
            : "Add to favorites"
          : "Login to save favorites"
      }
    >
      <IconButton
        onClick={handleFavoriteToggle}
        color={isFav ? "secondary" : color}
        size={size}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;
