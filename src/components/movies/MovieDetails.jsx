import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Paper,
  Divider,
  Rating,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PlayArrow as PlayArrowIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme, styled } from "@mui/material/styles";
import { useMovie } from "../../context/MovieContext";
import { IMAGE_SIZES } from "../../api/tmdbApi";
import { motion } from "framer-motion";
//import noImage from "../../assets/images/no-image.png"; // You'll need to add this image

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Styled components
const BackdropWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "70vh",
  minHeight: 400,
  maxHeight: 600,
  width: "100%",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, ${theme.palette.background.default} 100%)`,
    zIndex: 1,
  },
}));

const BackdropImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center top",
  filter: theme.palette.mode === "dark" ? "brightness(0.7)" : "none",
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: "relative",
  marginTop: "-250px",
  zIndex: 2,
  [theme.breakpoints.down("md")]: {
    marginTop: "-200px",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: "-150px",
  },
}));

const PosterImage = styled(CardMedia)(({ theme }) => ({
  height: 450,
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0, 0, 0, 0.6)"
      : "0 10px 30px rgba(0, 0, 0, 0.3)",
  [theme.breakpoints.down("sm")]: {
    height: 300,
  },
}));

const InfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 16px rgba(0, 0, 0, 0.4)"
      : "0 8px 16px rgba(0, 0, 0, 0.1)",
}));

const DetailChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.background.subtle,
}));

const MovieDetails = ({ movie, trailers = [] }) => {
  const theme = useTheme();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovie();
  const isFav = isFavorite(movie.id);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle favorite toggling
  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Open trailer dialog
  const openTrailer = (trailer) => {
    setCurrentTrailer(trailer);
    setTrailerOpen(true);
  };

  // Get main trailer if available
  const mainTrailer =
    trailers && trailers.length > 0
      ? trailers.find((trailer) => trailer.type === "Trailer") || trailers[0]
      : null;

  return (
    <>
      <BackdropWrapper>
        <BackdropImage
          src={
            movie.backdrop_path
              ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}`
              : noImage
          }
          alt={movie.title}
        />
      </BackdropWrapper>

      <ContentWrapper maxWidth="xl">
        <Grid container spacing={4}>
          {/* Poster and actions */}
          <Grid item xs={12} md={4} lg={3}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PosterImage
                image={
                  movie.poster_path
                    ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
                    : noImage
                }
                title={movie.title}
              />

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                {mainTrailer && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<PlayArrowIcon />}
                    size="large"
                    onClick={() => openTrailer(mainTrailer)}
                    sx={{
                      py: 1.5,
                      flex: 2,
                    }}
                  >
                    Watch Trailer
                  </Button>
                )}

                <Button
                  variant={isFav ? "outlined" : "contained"}
                  color={isFav ? "secondary" : "primary"}
                  onClick={handleFavoriteToggle}
                  startIcon={isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  sx={{
                    py: 1.5,
                    flex: 1,
                  }}
                >
                  {isFav ? "Saved" : "Save"}
                </Button>
              </Box>
            </MotionBox>
          </Grid>

          {/* Movie information */}
          <Grid item xs={12} md={8} lg={9}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ mb: 3 }}>
                <MotionTypography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {movie.title}
                  {movie.release_date && (
                    <Typography
                      variant="h5"
                      component="span"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({new Date(movie.release_date).getFullYear()})
                    </Typography>
                  )}
                </MotionTypography>

                {movie.tagline && (
                  <MotionTypography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontStyle: "italic", mb: 2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    "{movie.tagline}"
                  </MotionTypography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {movie.vote_average > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Rating
                        value={movie.vote_average / 2}
                        precision={0.5}
                        readOnly
                      />
                      <Typography
                        variant="body1"
                        sx={{ ml: 1, fontWeight: "bold" }}
                      >
                        {(movie.vote_average / 2).toFixed(1)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        ({movie.vote_count.toLocaleString()} votes)
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {movie.genres &&
                    movie.genres.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        sx={{
                          fontWeight: 500,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.08)",
                        }}
                      />
                    ))}
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InfoBox>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Overview
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {movie.overview || "No overview available."}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {movie.runtime > 0 && (
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <AccessTimeIcon color="primary" sx={{ mb: 1 }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              Runtime
                            </Typography>
                            <Typography variant="body1" align="center">
                              {formatRuntime(movie.runtime)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {movie.release_date && (
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <CalendarIcon color="primary" sx={{ mb: 1 }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              Release Date
                            </Typography>
                            <Typography variant="body1" align="center">
                              {formatDate(movie.release_date)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {movie.original_language && (
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <LanguageIcon color="primary" sx={{ mb: 1 }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              Language
                            </Typography>
                            <Typography
                              variant="body1"
                              align="center"
                              textTransform="uppercase"
                            >
                              {movie.original_language}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {movie.budget > 0 && (
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <MoneyIcon color="primary" sx={{ mb: 1 }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              Budget
                            </Typography>
                            <Typography variant="body1" align="center">
                              {formatCurrency(movie.budget)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </InfoBox>
                </Grid>

                {movie.credits &&
                  movie.credits.cast &&
                  movie.credits.cast.length > 0 && (
                    <Grid item xs={12}>
                      <InfoBox>
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Top Cast
                        </Typography>
                        <Grid container spacing={2}>
                          {movie.credits.cast.slice(0, 6).map((person) => (
                            <Grid item xs={6} sm={4} md={2} key={person.id}>
                              <Card
                                elevation={0}
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <Avatar
                                  variant="rounded"
                                  src={
                                    person.profile_path
                                      ? `${IMAGE_SIZES.profile.medium}${person.profile_path}`
                                      : noImage
                                  }
                                  alt={person.name}
                                  sx={{
                                    width: "100%",
                                    height: "auto",
                                    aspectRatio: "2/3",
                                    mb: 1,
                                    borderRadius: 2,
                                  }}
                                />
                                <CardContent sx={{ p: 1, pt: 0, flexGrow: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    component="div"
                                  >
                                    {person.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {person.character}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </InfoBox>
                    </Grid>
                  )}

                {trailers.length > 0 && (
                  <Grid item xs={12}>
                    <InfoBox>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Videos & Trailers
                      </Typography>
                      <Grid container spacing={2}>
                        {trailers.slice(0, 3).map((trailer) => (
                          <Grid item xs={12} sm={6} md={4} key={trailer.id}>
                            <Card
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  transition: "transform 0.3s ease",
                                },
                              }}
                              onClick={() => openTrailer(trailer)}
                            >
                              <Box sx={{ position: "relative" }}>
                                <CardMedia
                                  component="img"
                                  height="180"
                                  image={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                                  alt={trailer.name}
                                />
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
                                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                                  }}
                                >
                                  <Tooltip title="Play">
                                    <IconButton
                                      sx={{
                                        color: "white",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        "&:hover": {
                                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        },
                                      }}
                                    >
                                      <PlayArrowIcon sx={{ fontSize: 40 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                              <CardContent>
                                <Typography
                                  variant="subtitle1"
                                  component="div"
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {trailer.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {trailer.type} •{" "}
                                  {trailer.published_at
                                    ? new Date(
                                        trailer.published_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </InfoBox>
                  </Grid>
                )}
              </Grid>
            </MotionBox>
          </Grid>
        </Grid>
      </ContentWrapper>

      {/* Trailer Dialog */}
      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="lg"
        fullWidth={true}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setTrailerOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ p: 0, height: "70vh", overflow: "hidden" }}>
            {currentTrailer && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1`}
                title={currentTrailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default MovieDetails;
