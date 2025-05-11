import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  Paper,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBack,
  PlayArrow,
  Bookmark,
  BookmarkBorder,
  Close,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import YouTube from "react-youtube";

// Import from the index.js file instead
import { getMovieDetails, getRecommendations } from "../api";
import MovieGrid from "../components/ui/MovieGrid";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  // Removed unused isMobile variable
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const [trailerOpen, setTrailerOpen] = useState(false);

  // Fetch movie details with the updated import method
  const {
    data: movie,
    isLoading,
    error,
  } = useQuery(["movie", id], () => getMovieDetails(id), {
    enabled: !!id,
  });

  // Fetch movie recommendations
  const { data: recommendationsData } = useQuery(
    ["recommendations", id],
    () => getRecommendations(id),
    {
      enabled: !!id,
    }
  );

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins}m`;
  };

  // YouTube options
  const youtubeOpts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", my: 8, py: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading movie details
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error?.message || "Movie not found."}
          </Typography>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  // Release year extracted from release date
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "";

  // Compute user score as a percentage
  const userScore = Math.round((movie.rating / 10) * 100);

  return (
    <>
      {/* Full-width backdrop section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "90vh", sm: "70vh" },
          overflow: "hidden",
        }}
      >
        {/* Backdrop image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${movie.backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)",
            },
          }}
        />

        {/* Back button */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        {/* Content overlay */}
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pb: 5,
          }}
        >
          <Grid container spacing={4} alignItems="flex-end">
            {/* Movie poster (visible on larger screens) */}
            {!isSmall && (
              <Grid item xs={12} sm={4} md={3}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper
                    elevation={5}
                    sx={{
                      overflow: "hidden",
                      borderRadius: 2,
                      width: "100%",
                      maxWidth: 300,
                      mx: "auto",
                    }}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            )}

            {/* Movie info */}
            <Grid item xs={12} sm={8} md={9}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography
                  variant={isSmall ? "h5" : "h3"}
                  component="h1"
                  fontWeight="bold"
                  color="white"
                  gutterBottom
                >
                  {movie.title}{" "}
                  {releaseYear && (
                    <Box
                      component="span"
                      sx={{ opacity: 0.8, fontWeight: "normal" }}
                    >
                      ({releaseYear})
                    </Box>
                  )}
                </Typography>

                {/* Movie metadata */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    color: "white",
                  }}
                >
                  {/* Rating */}
                  <Chip
                    label={movie.adult ? "R" : "PG"}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />

                  {/* Release date */}
                  {movie.releaseDate && (
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ opacity: 0.8 }}
                    >
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </Typography>
                  )}

                  {/* Runtime */}
                  {movie.runtime > 0 && (
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ opacity: 0.8 }}
                      >
                        •
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ opacity: 0.8 }}
                      >
                        {formatRuntime(movie.runtime)}
                      </Typography>
                    </>
                  )}

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ opacity: 0.8 }}
                      >
                        •
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ opacity: 0.8 }}
                      >
                        {movie.genres.map((g) => g.name).join(", ")}
                      </Typography>
                    </>
                  )}
                </Box>

                {/* User score */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: { xs: 1, sm: 3 },
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 60,
                        height: 60,
                      }}
                    >
                      {/* Circular progress background */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          bgcolor: "rgba(0,0,0,0.5)",
                          border: "3px solid rgba(0,0,0,0.2)",
                        }}
                      />

                      {/* Colored progress circle */}
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          transform: "rotate(-90deg)",
                        }}
                      >
                        <circle
                          cx="30"
                          cy="30"
                          r="26"
                          fill="none"
                          stroke={
                            userScore >= 70
                              ? "#21d07a" // Green for high scores
                              : userScore >= 40
                              ? "#d2d531" // Yellow for medium scores
                              : "#db2360" // Red for low scores
                          }
                          strokeWidth="3"
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={
                            2 * Math.PI * 26 * (1 - userScore / 100)
                          }
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Score text */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          color: "white",
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          fontWeight="bold"
                          lineHeight={1}
                        >
                          {userScore}
                          <Typography
                            variant="caption"
                            component="span"
                            sx={{ verticalAlign: "super", ml: 0.2 }}
                          >
                            %
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                      <Typography
                        variant="body2"
                        color="white"
                        fontWeight="medium"
                      >
                        User
                      </Typography>
                      <Typography
                        variant="body2"
                        color="white"
                        fontWeight="medium"
                      >
                        Score
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Favorite button */}
                    {isAuthenticated && (
                      <IconButton
                        onClick={handleFavoriteToggle}
                        sx={{
                          color: "white",
                          bgcolor: "rgba(0,0,0,0.5)",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.7)",
                          },
                        }}
                      >
                        {isFavorite(movie.id) ? (
                          <Bookmark />
                        ) : (
                          <BookmarkBorder />
                        )}
                      </IconButton>
                    )}

                    {/* Play trailer button */}
                    {movie.trailer && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => setTrailerOpen(true)}
                        sx={{
                          bgcolor: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        }}
                      >
                        Play Trailer
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Tagline */}
                {movie.tagline && (
                  <Typography
                    variant="h6"
                    color="white"
                    sx={{ opacity: 0.8, fontStyle: "italic", mb: 2 }}
                  >
                    {movie.tagline}
                  </Typography>
                )}

                {/* Overview section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    color="white"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Overview
                  </Typography>
                  <Typography
                    variant="body1"
                    color="white"
                    sx={{ opacity: 0.9, maxWidth: 900 }}
                  >
                    {movie.overview || "No overview available."}
                  </Typography>
                </Box>

                {/* Credits section */}
                {movie.crew && (
                  <Grid container spacing={2} sx={{ color: "white", mt: 1 }}>
                    {movie.crew
                      .filter((person) =>
                        ["Director", "Writer", "Screenplay"].includes(
                          person.job
                        )
                      )
                      .slice(0, 3)
                      .map((person) => (
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          key={`${person.id}-${person.job}`}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {person.name}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            {person.job}
                          </Typography>
                        </Grid>
                      ))}
                  </Grid>
                )}
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main content section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Cast section */}
          {movie.cast && movie.cast.length > 0 && (
            <Grid item xs={12}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Top Cast
              </Typography>
              <Grid container spacing={2}>
                {movie.cast.slice(0, 6).map((person) => (
                  <Grid item xs={6} sm={4} md={2} key={person.id}>
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        height: "100%",
                      }}
                    >
                      {person.profile ? (
                        <Box
                          sx={{
                            height: 180,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={person.profile}
                            alt={person.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            height: 180,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0,0,0,0.1)",
                            color: "text.secondary",
                          }}
                        >
                          No Image
                        </Box>
                      )}
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          noWrap
                        >
                          {person.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {person.character}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Recommendations section */}
          {recommendationsData && recommendationsData.results.length > 0 && (
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Recommendations
              </Typography>
              <MovieGrid
                movies={recommendationsData.results.slice(0, 6)}
                genres={movie.genres}
              />
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Trailer dialog */}
      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#000",
            boxShadow: 24,
            m: { xs: 1, sm: 2 },
            width: "100%",
            maxWidth: "900px",
            height: { xs: "60vh", sm: "70vh", md: "70vh" }, // Set a height for the dialog
          },
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <IconButton
            aria-label="close"
            onClick={() => setTrailerOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 1,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <Close />
          </IconButton>
          <DialogContent
            sx={{
              p: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#000",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: "40vh", sm: "60vh", md: "65vh" },
                maxHeight: "100%",
                maxWidth: "100%",
                position: "relative",
              }}
            >
              <YouTube
                videoId={movie.trailer}
                opts={youtubeOpts} // Use the youtubeOpts variable here
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                containerClassName="youtube-container"
              />
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default MovieDetails;
