import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Whatshot as WhatshotIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "../components/movies/SearchBar";
import MovieCard from "../components/movies/MovieCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useMovie } from "../context/MovieContext";
import tmdbApi, { IMAGE_SIZES } from "../api/tmdbApi";

// Motion components
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const { lastSearched, genres } = useMovie();

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Create a map of genre IDs to names for easier lookup
  const genreMap = {};
  genres.forEach((genre) => {
    genreMap[genre.id] = genre.name;
  });

  // Fetch movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // Fetch trending movies
        const trendingData = await tmdbApi.getTrending("day");
        setTrendingMovies(trendingData.results.slice(0, 10));

        // Fetch popular movies
        const popularData = await tmdbApi.getPopularMovies();
        setPopularMovies(popularData.results.slice(0, 10));

        // Fetch top rated movies
        const topRatedData = await tmdbApi.getTopRatedMovies();
        setTopRatedMovies(topRatedData.results.slice(0, 10));

        // Fetch upcoming movies
        const upcomingData = await tmdbApi.getUpcomingMovies();
        setUpcomingMovies(upcomingData.results.slice(0, 10));

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch movies. Please try again later.");
        setLoading(false);
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get movies based on active tab
  const getActiveTabMovies = () => {
    switch (tabValue) {
      case 0:
        return trendingMovies;
      case 1:
        return popularMovies;
      case 2:
        return topRatedMovies;
      case 3:
        return upcomingMovies;
      default:
        return trendingMovies;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie recommendations..." />;
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "background.subtle",
          pt: 8,
          pb: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <MotionTypography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight={700}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Discover Your Next Favorite Movie
              </MotionTypography>

              <MotionTypography
                variant="h6"
                color="text.secondary"
                paragraph
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Explore thousands of movies, save your favorites, and find what
                to watch next with our comprehensive movie database powered by
                TMDb.
              </MotionTypography>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SearchBar showRecent={false} />
              </MotionBox>

              <MotionBox
                display="flex"
                gap={2}
                mt={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  component={RouterLink}
                  to="/trending"
                  variant="contained"
                  size="large"
                  startIcon={<WhatshotIcon />}
                >
                  Trending Movies
                </Button>
                <Button
                  component={RouterLink}
                  to="/popular"
                  variant="outlined"
                  size="large"
                  startIcon={<ExploreIcon />}
                >
                  Explore All
                </Button>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={5}>
              {trendingMovies.length > 0 && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  sx={{
                    display: { xs: "none", md: "block" },
                    position: "relative",
                    height: 450,
                  }}
                >
                  {trendingMovies.slice(0, 3).map((movie, index) => (
                    <Box
                      key={movie.id}
                      component={RouterLink}
                      to={`/movie/${movie.id}`}
                      sx={{
                        position: "absolute",
                        top: index * 30,
                        right: index * 40,
                        width: 250,
                        height: 380,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8],
                        transition: "transform 0.3s ease",
                        transform: `rotate(${index * 5 - 5}deg)`,
                        "&:hover": {
                          transform: `rotate(${
                            index * 5 - 5
                          }deg) translateY(-10px)`,
                          zIndex: 10,
                        },
                        zIndex: 3 - index,
                      }}
                    >
                      <img
                        src={`${IMAGE_SIZES.poster.medium}${movie.poster_path}`}
                        alt={movie.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  ))}
                </MotionBox>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Last Searched Movie (if available) */}
      {lastSearched && (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              p: 3,
              borderRadius: 2,
              bgcolor: "background.subtle",
            }}
          >
            <Box
              component={RouterLink}
              to={`/movie/${lastSearched.id}`}
              sx={{
                flexShrink: 0,
                textDecoration: "none",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", sm: 120 },
                  height: { xs: 180, sm: 180 },
                  borderRadius: 1,
                  objectFit: "cover",
                }}
                image={
                  lastSearched.poster_path
                    ? `${IMAGE_SIZES.poster.small}${lastSearched.poster_path}`
                    : "https://via.placeholder.com/120x180?text=No+Image"
                }
                alt={lastSearched.title}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" color="text.secondary">
                Continue Watching
              </Typography>
              <Typography
                variant="h5"
                component={RouterLink}
                to={`/movie/${lastSearched.id}`}
                gutterBottom
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {lastSearched.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                {lastSearched.overview}
              </Typography>

              <Button
                component={RouterLink}
                to={`/movie/${lastSearched.id}`}
                variant="outlined"
                size="small"
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Container>
      )}

      {/* Featured Movies Tabs */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            centered={!isMobile}
            sx={{ mb: 3 }}
          >
            <Tab
              icon={<WhatshotIcon />}
              label="Trending"
              iconPosition="start"
            />
            <Tab
              icon={<TrendingUpIcon />}
              label="Popular"
              iconPosition="start"
            />
            <Tab icon={<StarIcon />} label="Top Rated" iconPosition="start" />
            <Tab
              icon={<PlayCircleOutlineIcon />}
              label="Upcoming"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {getActiveTabMovies()
            .slice(0, 8)
            .map((movie, index) => (
              <Grid item xs={12} sm={6} md={3} key={movie.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} genreMap={genreMap} />
                </motion.div>
              </Grid>
            ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            component={RouterLink}
            to={
              tabValue === 0
                ? "/trending"
                : tabValue === 1
                ? "/popular"
                : tabValue === 2
                ? "/top-rated"
                : "/upcoming"
            }
            variant="contained"
            endIcon={<ExploreIcon />}
            size="large"
          >
            View All
          </Button>
        </Box>
      </Container>

      {/* Genres Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 4 }}
        >
          Explore by Genre
        </Typography>

        <Grid container spacing={2}>
          {genres.slice(0, 12).map((genre) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={genre.id}>
              <Card
                component={RouterLink}
                to={`/genres/${genre.id}`}
                sx={{
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  bgcolor: "background.subtle",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    bgcolor: "primary.main",
                    "& .MuiTypography-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    p: 2,
                  }}
                >
                  {genre.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
