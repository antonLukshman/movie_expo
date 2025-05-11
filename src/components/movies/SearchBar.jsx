import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Divider,
  Chip,
  useTheme,
  Popper,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import tmdbApi, { IMAGE_SIZES } from "../../api/tmdbApi";
//import noImage from "../../assets/images/no-image.png"; // You'll need to add this image

// Custom styled component for the search input
const StyledSearchBar = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 800,
  padding: theme.spacing(0.5, 1),
  margin: "0 auto",
  borderRadius: 30,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 8px rgba(0, 0, 0, 0.4)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 12px rgba(0, 0, 0, 0.5)"
        : "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

// Custom styled component for the suggestions
const SuggestionsContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 800,
  maxHeight: 400,
  overflow: "auto",
  borderRadius: 12,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 20px rgba(0, 0, 0, 0.5)"
      : "0 8px 20px rgba(0, 0, 0, 0.15)",
  zIndex: 1300,
}));

// Get recent searches from localStorage
const getRecentSearches = () => {
  try {
    const recentSearches = localStorage.getItem("recentSearches");
    return recentSearches ? JSON.parse(recentSearches) : [];
  } catch (error) {
    console.error("Error retrieving recent searches:", error);
    return [];
  }
};

// Save recent search to localStorage
const saveRecentSearch = (query) => {
  try {
    const recentSearches = getRecentSearches();
    // Only add if not already in the list
    if (!recentSearches.includes(query)) {
      // Add to beginning and limit to 5 items
      const updatedSearches = [query, ...recentSearches].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
};

const SearchBar = ({
  initialValue = "",
  size = "large",
  showRecent = true,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularQueries] = useState([
    "Avengers",
    "Star Wars",
    "Jurassic Park",
    "Batman",
    "Harry Potter",
  ]);

  const navigate = useNavigate();
  const theme = useTheme();

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    let debounceTimer;

    if (query.trim() && query.length >= 2) {
      setLoading(true);
      debounceTimer = setTimeout(async () => {
        try {
          const { results } = await tmdbApi.searchMovies(query);
          setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
      setShowSuggestions(false);
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (movieId) => {
    setShowSuggestions(false);
    navigate(`/movie/${movieId}`);
  };

  // Handle recent or popular search click
  const handleQueryClick = (selectedQuery) => {
    setQuery(selectedQuery);
    saveRecentSearch(selectedQuery);
    setRecentSearches(getRecentSearches());
    setShowSuggestions(false);
    navigate(`/search?query=${encodeURIComponent(selectedQuery)}`);
  };

  // Clear search input
  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Open suggestions when input is focused
  const handleInputFocus = (event) => {
    setAnchorEl(event.currentTarget);
    if (query.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle click away to close suggestions
  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ width: "100%", position: "relative" }}>
        <form onSubmit={handleSearch}>
          <StyledSearchBar
            elevation={3}
            sx={{
              py: size === "large" ? 1 : 0.5,
              backgroundColor: "background.paper",
            }}
          >
            <IconButton type="submit" sx={{ p: size === "large" ? 1.5 : 1 }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for movies..."
              inputProps={{ "aria-label": "search movies" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              fullWidth
            />
            {loading && <CircularProgress size={24} sx={{ mr: 1 }} />}
            {query && (
              <IconButton
                onClick={handleClearSearch}
                sx={{ p: size === "large" ? 1.5 : 1 }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </StyledSearchBar>
        </form>

        {showRecent && recentSearches.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HistoryIcon
                fontSize="small"
                sx={{ color: "text.secondary", mr: 0.5 }}
              />
              <Typography variant="body2" color="text.secondary">
                Recent:
              </Typography>
            </Box>
            {recentSearches.map((search, index) => (
              <Chip
                key={index}
                label={search}
                size="small"
                onClick={() => handleQueryClick(search)}
                sx={{
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              />
            ))}
          </Box>
        )}

        {showRecent && (
          <Box
            sx={{
              mt: showRecent && recentSearches.length > 0 ? 1 : 2,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingIcon
                fontSize="small"
                sx={{ color: "text.secondary", mr: 0.5 }}
              />
              <Typography variant="body2" color="text.secondary">
                Popular:
              </Typography>
            </Box>
            {popularQueries.map((query, index) => (
              <Chip
                key={index}
                label={query}
                size="small"
                onClick={() => handleQueryClick(query)}
                sx={{
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Popper
          open={showSuggestions && suggestions.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{
            width: anchorEl ? anchorEl.clientWidth : null,
            zIndex: 1300,
          }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={200}>
              <SuggestionsContainer>
                <List sx={{ py: 0 }}>
                  {suggestions.map((movie, index) => (
                    <React.Fragment key={movie.id}>
                      <ListItem
                        button
                        onClick={() => handleSuggestionClick(movie.id)}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={
                              movie.poster_path
                                ? `${IMAGE_SIZES.poster.small}${movie.poster_path}`
                                : noImage
                            }
                            alt={movie.title}
                            sx={{ width: 50, height: 70, borderRadius: 1 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" component="span">
                              {movie.title}
                              {movie.release_date && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="span"
                                  sx={{ ml: 1 }}
                                >
                                  ({new Date(movie.release_date).getFullYear()})
                                </Typography>
                              )}
                            </Typography>
                          }
                          secondary={
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
                              {movie.overview
                                ? movie.overview
                                : "No overview available."}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < suggestions.length - 1 && (
                        <Divider component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </SuggestionsContainer>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
