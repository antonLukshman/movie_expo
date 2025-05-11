import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Button,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import MovieDetails from "../components/movies/MovieDetails";
import MovieCard from "../components/movies/MovieCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import tmdbApi from "../api/tmdbApi";
import { useMovie } from "../context/MovieContext";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { genres } = useMovie();

  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a map of genre IDs to names for easier lookup
  const genreMap = {};
  genres.forEach((genre) => {
    genreMap[genre.id] = genre.name;
  });

  // Fetch movie details on component mount or when ID changes
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieData = await tmdbApi.getMovieDetails(id);
        setMovie(movieData);

        // Extract trailers
        if (movieData.videos && movieData.videos.results) {
          const videoResults = movieData.videos.results;
          // Filter for YouTube videos that are trailers, teasers, or clips
          const filteredTrailers = videoResults.filter(
            (video) =>
              video.site === "YouTube" &&
              ["Trailer", "Teaser", "Clip"].includes(video.type)
          );
          setTrailers(filteredTrailers);
        }

        // Extract similar movies
        if (movieData.similar && movieData.similar.results) {
          setSimilarMovies(movieData.similar.results.slice(0, 8));
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.");
        setLoading(false);
        console.error("Error fetching movie details:", err);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        >
          Movie not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Movie Details Component */}
      <MovieDetails movie={movie} trailers={trailers} />

      {/* Back Button */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 2 }}>
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
      </Container>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <Container maxWidth="xl" sx={{ mb: 8 }}>
          <Divider sx={{ mb: 4 }} />

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Similar Movies
          </Typography>

          <Grid container spacing={3}>
            {similarMovies.map((similar, index) => (
              <Grid item xs={12} sm={6} md={3} key={similar.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MovieCard movie={similar} genreMap={genreMap} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default MovieDetailsPage;
