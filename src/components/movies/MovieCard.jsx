import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Rating,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useMovie } from "../../context/MovieContext";
import { IMAGE_SIZES } from "../../api/tmdbApi";
import noImage from "../../assets/images/no-image.png"; // You'll need to add this image

const MovieCard = ({ movie, genreMap = {} }) => {
  const { isFavorite, addToFavorites, removeFromFavorites, setLastSearched } =
    useMovie();
  const isFav = isFavorite(movie.id);

  // Format release date to show just the year
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  // Get genre names if genre IDs are available
  const movieGenres = movie.genre_ids
    ? movie.genre_ids.slice(0, 2).map((id) => genreMap[id] || "")
    : [];

  // Handle click on movie card
  const handleCardClick = () => {
    setLastSearched(movie);
  };

  // Handle favorite toggling
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/movie/${movie.id}`}
        onClick={handleCardClick}
        sx={{ flexGrow: 1 }}
      >
        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              zIndex: 10,
              bgcolor: "primary.main",
              color: "white",
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            {movie.vote_average.toFixed(1)}
          </Box>
        )}

        <CardMedia
          component="img"
          height="280"
          image={
            movie.poster_path
              ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
              : noImage
          }
          alt={movie.title}
          sx={{
            objectFit: "cover",
          }}
        />

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CalendarIcon
              sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {releaseYear}
            </Typography>

            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
              size="small"
              sx={{ ml: "auto" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
            {movieGenres.map(
              (genre, index) =>
                genre && (
                  <Chip
                    key={index}
                    label={genre}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      backgroundColor: "background.subtle",
                    }}
                  />
                )
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 40,
            }}
          >
            {movie.overview || "No overview available."}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ pt: 0 }}>
        <Tooltip title={isFav ? "Remove from favorites" : "Add to favorites"}>
          <IconButton
            onClick={handleFavoriteToggle}
            color={isFav ? "secondary" : "default"}
            aria-label={isFav ? "remove from favorites" : "add to favorites"}
          >
            {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
