import { useState, useEffect } from "react";

import {
  Paper,
  InputBase,
  IconButton,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = ({ onSearch, initialQuery = "", loading = false }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  // Update searchQuery when initialQuery changes
  useEffect(() => {
    if (initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Call the onSearch prop with the trimmed query
      onSearch(searchQuery.trim());

      // Only navigate if we're not already on the search page
      if (location.pathname !== "/search") {
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      }

      // Save to localStorage for persistence
      localStorage.setItem("lastSearchQuery", searchQuery.trim());
    }
  };

  // Add keyboard event handler for Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    // Focus the input after clearing
    document.getElementById("search-input").focus();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: isMobile ? "100%" : 600,
        mx: "auto",
        mb: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          borderRadius: "50px",
          transition: "all 0.3s",
          border: "2px solid transparent",
          "&:hover": {
            borderColor: "primary.main",
          },
        }}
      >
        <IconButton disabled sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          id="search-input"
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          inputProps={{ "aria-label": "search movies" }}
          autoFocus={!isMobile}
        />
        {loading && (
          <CircularProgress size={24} sx={{ mx: 1, color: "primary.main" }} />
        )}
        {searchQuery && !loading && (
          <IconButton
            sx={{ p: "10px" }}
            aria-label="clear"
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        )}
        <IconButton
          type="submit"
          sx={{
            p: "10px",
            bgcolor: "primary.main",
            color: "white",
            borderRadius: "0 50px 50px 0",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            ml: 1,
            mr: -0.5,
          }}
          aria-label="search"
          disabled={!searchQuery.trim() || loading}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
