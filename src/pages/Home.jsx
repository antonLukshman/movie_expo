import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Paper,
  useMediaQuery,
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { TrendingUp } from "@mui/icons-material";
import { useQuery } from "react-query";
import { motion } from "framer-motion";

// Components
import SearchBar from "../components/ui/SearchBar";
import MovieGrid from "../components/ui/MovieGrid";
import Logo from "../components/ui/Logo";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// API

import { getTrending, getGenres } from "../api";

const Home = () => {
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [timeWindow, setTimeWindow] = useState("day");
  const [page, setPage] = useState(1);

  // Get trending movies
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
  } = useQuery(
    ["trending", timeWindow, page],
    () => getTrending(timeWindow, page),
    {
      keepPreviousData: true,
    }
  );

  // Get genres for movie cards
  const { data: genresData } = useQuery("genres", getGenres, {
    staleTime: 600000, // 10 minutes
  });

  // Handle search
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);

      // Save to localStorage
      localStorage.setItem("lastSearchQuery", query.trim());
    }
  };

  // Handle time window change (day/week)
  const handleTimeWindowChange = (event, newValue) => {
    setTimeWindow(newValue);
    setPage(1); // Reset to page 1 when changing time window
  };

  // Handle load more
  const handleLoadMore = () => {
    if (trendingData && page < trendingData.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Combine movies from all pages
  const allMovies = React.useMemo(() => {
    if (!trendingData) return [];

    // If we're on page 1, just return the results
    if (page === 1) return trendingData.results;

    // Otherwise, we need to combine with previous results
    // We're using the keepPreviousData option in useQuery
    return trendingData.results;
  }, [trendingData, page]);

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          mt: 2,
          mb: 6,
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          backgroundImage: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(45deg, #2a2a2a 0%, #1a1a1a 100%)"
              : "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Logo size="xlarge" showText={false} linkTo={null} />
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                align="center"
                gutterBottom
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                Discover Your Next Favorite Movie
              </Typography>

              <Typography
                variant="h6"
                component="h2"
                align="center"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, maxWidth: 800, mx: "auto" }}
              >
                Search, explore, and keep track of the best films from around
                the world.
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </motion.div>
      </Paper>

      {/* Trending Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingUp sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Trending Movies
              </Typography>
            </Box>

            <Tabs
              value={timeWindow}
              onChange={handleTimeWindowChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ minHeight: "auto" }}
            >
              <Tab label="Today" value="day" />
              <Tab label="This Week" value="week" />
            </Tabs>
          </Box>

          {trendingLoading && page === 1 ? (
            <LoadingSpinner message="Loading trending movies..." />
          ) : trendingError ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Error loading trending movies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trendingError.message || "Please try again later"}
              </Typography>
            </Box>
          ) : (
            <MovieGrid
              movies={allMovies}
              genres={genresData || []}
              loading={trendingLoading && page > 1}
              error={trendingError}
              hasMore={trendingData ? page < trendingData.totalPages : false}
              onLoadMore={handleLoadMore}
              useInfiniteScroll={false} // Using Load More button instead
            />
          )}
        </Box>
      </motion.div>
    </Container>
  );
};

export default Home;
