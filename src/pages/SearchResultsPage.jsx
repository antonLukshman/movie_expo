import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Alert,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Pagination,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import MovieGrid from "../components/movies/MovieGrid";
import SearchBar from "../components/movies/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import tmdbApi from "../api/tmdbApi";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get query from URL params
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const pageParam = parseInt(queryParams.get("page")) || 1;

  const [searchResults, setSearchResults] = useState([]);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Fetch search results when query or page changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setTotalPages(1);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await tmdbApi.searchMovies(query, currentPage);

        setSearchResults(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb API limits to 500 pages max

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch search results. Please try again later.");
        setLoading(false);
        console.error("Error fetching search results:", err);
      }
    };

    // Update current query when URL query changes
    setCurrentQuery(query);

    fetchSearchResults();
  }, [query, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Update URL with new page number
    navigate(`/search?query=${encodeURIComponent(query)}&page=${page}`);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Search Results
          </Typography>

          <SearchBar
            initialValue={currentQuery}
            size="medium"
            showRecent={true}
          />

          {query && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <>
                  Found{" "}
                  {searchResults.length > 0 ? (
                    <strong>{searchResults.length} results</strong>
                  ) : (
                    <strong>no results</strong>
                  )}{" "}
                  for "{query}"
                </>
              )}
            </Typography>
          )}
        </motion.div>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : !query ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            textAlign: "center",
          }}
        >
          <SearchIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Enter a movie title to start searching
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You can search by movie title, actor, or director
          </Typography>
        </Box>
      ) : loading ? (
        <LoadingSpinner message={`Searching for "${query}"...`} />
      ) : searchResults.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No results found for "{query}"
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search terms or try another query
          </Typography>
        </Box>
      ) : (
        <MovieGrid
          movies={searchResults}
          isLoading={loading}
          error={error}
          title={null}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          emptyMessage={`No results found for "${query}"`}
          showFilters={true}
        />
      )}
    </Container>
  );
};

export default SearchResultsPage;
