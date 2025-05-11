import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Container,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Divider,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FilterAlt as FilterIcon } from "@mui/icons-material";
import MovieCard from "./MovieCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { useMovie } from "../../context/MovieContext";
import { motion } from "framer-motion";

const MotionGrid = motion(Grid);

const MovieGrid = ({
  movies,
  isLoading,
  error,
  title,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  emptyMessage = "No movies found",
  showFilters = false,
}) => {
  const { genres } = useMovie();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [filteredMovies, setFilteredMovies] = useState(movies);

  // Create a map of genre IDs to names for easier lookup
  const genreMap = useMemo(() => {
    return genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }, [genres]);

  // Update filtered movies when original movies, genre, or sort order changes
  useEffect(() => {
    if (!movies) return;

    let result = [...movies];

    // Filter by genre if selected
    if (selectedGenre) {
      result = result.filter(
        (movie) =>
          movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
      );
    }

    // Sort the movies
    result = sortMovies(result, sortBy);

    setFilteredMovies(result);
  }, [movies, selectedGenre, sortBy]);

  // Handle page change
  const handlePageChange = (event, value) => {
    if (onPageChange) {
      onPageChange(value);
    }
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Handle genre filter change
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedGenre("");
    setSortBy("popularity.desc");
  };

  // Sort movies based on selected sort option
  const sortMovies = (moviesToSort, sortOption) => {
    const sorted = [...moviesToSort];

    switch (sortOption) {
      case "popularity.desc":
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case "popularity.asc":
        return sorted.sort((a, b) => a.popularity - b.popularity);
      case "vote_average.desc":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "vote_average.asc":
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case "release_date.desc":
        return sorted.sort((a, b) => {
          if (!a.release_date) return 1;
          if (!b.release_date) return -1;
          return new Date(b.release_date) - new Date(a.release_date);
        });
      case "release_date.asc":
        return sorted.sort((a, b) => {
          if (!a.release_date) return 1;
          if (!b.release_date) return -1;
          return new Date(a.release_date) - new Date(b.release_date);
        });
      case "title.asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title.desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {title && (
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "60%",
                height: "4px",
                bottom: "-8px",
                left: 0,
                backgroundColor: "primary.main",
                borderRadius: "2px",
              },
            }}
          >
            {title}
          </Typography>
        )}

        {showFilters && genres.length > 0 && (
          <Box sx={{ mt: 3, mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="genre-filter-label">
                    Filter by Genre
                  </InputLabel>
                  <Select
                    labelId="genre-filter-label"
                    id="genre-filter"
                    value={selectedGenre}
                    label="Filter by Genre"
                    onChange={handleGenreChange}
                  >
                    <MenuItem value="">All Genres</MenuItem>
                    {genres.map((genre) => (
                      <MenuItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-by-label">Sort by</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    id="sort-by"
                    value={sortBy}
                    label="Sort by"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="popularity.desc">
                      Popularity (High to Low)
                    </MenuItem>
                    <MenuItem value="popularity.asc">
                      Popularity (Low to High)
                    </MenuItem>
                    <MenuItem value="vote_average.desc">
                      Rating (High to Low)
                    </MenuItem>
                    <MenuItem value="vote_average.asc">
                      Rating (Low to High)
                    </MenuItem>
                    <MenuItem value="release_date.desc">
                      Release Date (Newest)
                    </MenuItem>
                    <MenuItem value="release_date.asc">
                      Release Date (Oldest)
                    </MenuItem>
                    <MenuItem value="title.asc">Title (A-Z)</MenuItem>
                    <MenuItem value="title.desc">Title (Z-A)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={handleClearFilters}
                  disabled={!selectedGenre && sortBy === "popularity.desc"}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </Grid>

              {selectedGenre && (
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Active filters:
                    </Typography>
                    <Chip
                      label={`Genre: ${genreMap[parseInt(selectedGenre)]}`}
                      size="small"
                      onDelete={handleClearFilters}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}

        {filteredMovies && filteredMovies.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {filteredMovies.map((movie, index) => (
                <MotionGrid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.05, 0.5),
                    ease: "easeOut",
                  }}
                >
                  <MovieCard movie={movie} genreMap={genreMap} />
                </MotionGrid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 3 }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isSmallScreen ? "small" : "medium"}
                  showFirstButton={!isSmallScreen}
                  showLastButton={!isSmallScreen}
                  siblingCount={isSmallScreen ? 0 : 1}
                />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 5,
              minHeight: 300,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {emptyMessage}
            </Typography>
            {selectedGenre && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MovieGrid;
