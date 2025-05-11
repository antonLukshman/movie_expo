import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Rating,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  CalendarMonth,
  StarRate,
} from "@mui/icons-material";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const MovieCard = ({ movie, genres = [] }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // If genre IDs are provided but genres object isn't, find genres from IDs
  const movieGenres =
    movie.genres ||
    (movie.genreIds && genres.length > 0
      ? movie.genreIds
          .map((id) => genres.find((genre) => genre.id === id))
          .filter(Boolean)
      : []);

  // Format release date to show only the year
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "Unknown";

  // Handle card click - navigate to movie details page
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click event

    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  // Check if movie is in favorites
  const favorited = isFavorite(movie.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 8,
          },
        }}
        onClick={handleCardClick}
      >
        {movie.poster ? (
          <CardMedia
            component="img"
            height="300"
            image={movie.poster}
            alt={movie.title}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.300",
              color: "grey.600",
            }}
          >
            <Typography variant="body2">No image available</Typography>
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
          <Typography variant="h6" component="div" noWrap gutterBottom>
            {movie.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Tooltip title="Release year">
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <CalendarMonth
                  sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {releaseYear}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Rating">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StarRate sx={{ fontSize: 18, mr: 0.5, color: "gold" }} />
                <Typography variant="body2" color="text.secondary">
                  {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
            {movieGenres.slice(0, 2).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
            ))}
            {movieGenres.length > 2 && (
              <Chip
                label={`+${movieGenres.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
            )}
          </Box>
        </CardContent>

        <CardActions
          sx={{ justifyContent: "space-between", px: 2, pt: 1, pb: 2 }}
        >
          <Rating
            name="read-only"
            value={movie.rating / 2}
            precision={0.5}
            readOnly
            size="small"
          />

          {isAuthenticated && (
            <Tooltip
              title={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                onClick={handleFavoriteClick}
                color="primary"
                size="small"
              >
                {favorited ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
ft;
