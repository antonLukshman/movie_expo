import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Grid,
  Paper,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  SentimentDissatisfied,
  Movie as MovieIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useQuery } from "react-query";

import MovieCard from "../components/ui/MovieCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import tmdbApi from "../api/tmdbApi";

const Favorites = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { favorites, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Get genres for filtering
  const { data: genresData } = useQuery("genres", tmdbApi.getGenres, {
    staleTime: 600000, // 10 minutes
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/favorites" } } });
    }
  }, [isAuthenticated, navigate]);

  // Handle clear all favorites
  const handleClearAll = () => {
    // Simple confirmation
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      favorites.forEach((movie) => {
        removeFavorite(movie.id);
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login via useEffect
  }

  return (
    <Container maxWidth="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FavoriteIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Your Favorites
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </Box>

        {favorites.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" component="h2">
                {favorites.length} {favorites.length === 1 ? "Movie" : "Movies"}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAll}
                startIcon={<DeleteIcon />}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Clear All" : "Remove All Favorites"}
              </Button>
            </Box>

            <Grid container spacing={3}>
              {favorites.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <Box sx={{ position: "relative" }}>
                    <MovieCard movie={movie} genres={genresData || []} />
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => removeFavorite(movie.id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.8)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <SentimentDissatisfied
              sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              Your favorites list is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start exploring and add some movies to your favorites!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<MovieIcon />}
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Explore Movies
            </Button>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
};

export default Favorites;
