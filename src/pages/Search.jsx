import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Grid,
  Paper,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close, TuneOutlined } from "@mui/icons-material";
import { useQuery } from "react-query";

import SearchBar from "../components/ui/SearchBar";
import MovieGrid from "../components/ui/MovieGrid";
// Changed from importing entire tmdbApi to named imports
import { searchMovies, getGenres } from "../api";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("query") || "";

  // Local state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  // Filter states
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");

  // Get genres for filtering - Updated to use named import
  const { data: genresData } = useQuery("genres", getGenres, {
    staleTime: 600000, // 10 minutes
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery(
    [
      "search",
      searchQuery,
      page,
      sortBy,
      yearRange,
      ratingRange,
      selectedGenres,
    ],
    () => searchMovies(searchQuery, page),
    {
      enabled: !!searchQuery,
      keepPreviousData: true,
    }
  );

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery !== initialQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`, {
        replace: true,
      });
    }
  }, [searchQuery, initialQuery, navigate]);

  // Update movies list when data changes
  useEffect(() => {
    if (searchData) {
      if (page === 1) {
        setAllMovies(searchData.results);
      } else {
        setAllMovies((prev) => [...prev, ...searchData.results]);
      }
    }
  }, [searchData, page]);

  // Trigger refetch when filters change
  useEffect(() => {
    // Only refetch if we already have a search query and we're on page 1
    if (searchQuery && page === 1) {
      refetchSearch();
    }
  }, [
    sortBy,
    yearRange,
    ratingRange,
    selectedGenres,
    searchQuery,
    page,
    refetchSearch,
  ]);

  // Handle search submission
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (searchData && page < searchData.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Handle year range change
  const handleYearChange = (event, newValue) => {
    setYearRange(newValue);
    setPage(1); // Reset to page 1 when filters change
  };

  // Handle rating range change
  const handleRatingChange = (event, newValue) => {
    setRatingRange(newValue);
    setPage(1); // Reset to page 1 when filters change
  };

  // Handle genre selection
  const handleGenreToggle = (genreId) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId];
      setPage(1); // Reset to page 1 when filters change
      return newGenres;
    });
  };

  // Handle sort by change
  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to page 1 when filters change
  };

  // Apply filters
  const applyFilters = () => {
    // Filter the movies based on selected criteria
    if (!searchData) return [];

    return allMovies.filter((movie) => {
      // Filter by year
      const releaseYear = movie.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : null;

      if (
        releaseYear &&
        (releaseYear < yearRange[0] || releaseYear > yearRange[1])
      ) {
        return false;
      }

      // Filter by rating
      if (movie.rating < ratingRange[0] || movie.rating > ratingRange[1]) {
        return false;
      }

      // Filter by genres
      if (selectedGenres.length > 0) {
        const movieGenreIds = movie.genreIds || [];
        if (!selectedGenres.some((id) => movieGenreIds.includes(id))) {
          return false;
        }
      }

      return true;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setYearRange([1900, new Date().getFullYear()]);
    setRatingRange([0, 10]);
    setSelectedGenres([]);
    setSortBy("popularity.desc");
  };

  // Get filtered movies
  const filteredMovies = applyFilters();

  // Show loading state if this is the first search
  if (searchQuery && searchLoading && page === 1) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <SearchBar
          onSearch={handleSearch}
          initialQuery={searchQuery}
          loading={searchLoading}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Filters Section */}
        {filtersOpen && (
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                position: "sticky",
                top: 80,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Filters
                </Typography>

                {isMobile && (
                  <Button
                    variant="text"
                    color="inherit"
                    size="small"
                    onClick={() => setFiltersOpen(false)}
                    startIcon={<Close />}
                  >
                    Close
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Sort By */}
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-label"
                    id="sort-select"
                    value={sortBy}
                    label="Sort By"
                    onChange={handleSortByChange}
                  >
                    <MenuItem value="popularity.desc">
                      Popularity (Desc)
                    </MenuItem>
                    <MenuItem value="popularity.asc">Popularity (Asc)</MenuItem>
                    <MenuItem value="vote_average.desc">Rating (Desc)</MenuItem>
                    <MenuItem value="vote_average.asc">Rating (Asc)</MenuItem>
                    <MenuItem value="release_date.desc">
                      Release Date (Desc)
                    </MenuItem>
                    <MenuItem value="release_date.asc">
                      Release Date (Asc)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Year Range */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Release Year
                </Typography>
                <Slider
                  value={yearRange}
                  onChange={handleYearChange}
                  valueLabelDisplay="auto"
                  min={1900}
                  max={new Date().getFullYear()}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    {yearRange[0]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {yearRange[1]}
                  </Typography>
                </Box>
              </Box>

              {/* Rating Range */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Rating
                </Typography>
                <Slider
                  value={ratingRange}
                  onChange={handleRatingChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  step={0.5}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    {ratingRange[0]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ratingRange[1]}
                  </Typography>
                </Box>
              </Box>

              {/* Genres */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Genres
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {genresData &&
                    genresData.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        clickable
                        color={
                          selectedGenres.includes(genre.id)
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleGenreToggle(genre.id)}
                        size="small"
                      />
                    ))}
                </Box>
              </Box>

              {/* Reset Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={resetFilters}
                sx={{ mt: 2 }}
              >
                Reset Filters
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Results Section */}
        <Grid item xs={12} md={filtersOpen ? 9 : 12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Start Searching"}
            </Typography>

            {!filtersOpen && (
              <Button
                variant="outlined"
                onClick={() => setFiltersOpen(true)}
                startIcon={<TuneOutlined />}
              >
                Filters
              </Button>
            )}
          </Box>

          {searchQuery && !searchLoading && filteredMovies.length === 0 && (
            <Box sx={{ textAlign: "center", my: 6 }}>
              <Typography variant="h6" gutterBottom>
                No movies found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters.
              </Typography>
            </Box>
          )}

          {searchQuery && (
            <MovieGrid
              movies={filteredMovies}
              genres={genresData || []}
              loading={searchLoading && page > 1}
              error={searchError}
              hasMore={searchData ? page < searchData.totalPages : false}
              onLoadMore={handleLoadMore}
              useInfiniteScroll={true}
            />
          )}

          {!searchQuery && (
            <Box sx={{ textAlign: "center", my: 6 }}>
              <Typography variant="h6" gutterBottom>
                Enter a search term to find movies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try searching for your favorite movie or actor.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
