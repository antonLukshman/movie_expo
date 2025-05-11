import React, { useRef, useCallback } from "react";
import { Grid, Box, Typography, Button, CircularProgress } from "@mui/material";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";

const MovieGrid = ({
  movies,
  genres = [],
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  useInfiniteScroll = true,
  title = "",
}) => {
  const observer = useRef();

  // Reference for the last element in the grid for infinite scrolling
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading || !useInfiniteScroll) return;

      // Disconnect previous observer
      if (observer.current) observer.current.disconnect();

      // Create new IntersectionObserver
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      // Observe the last node
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore, useInfiniteScroll]
  );

  // If there's an error, display error message
  if (error) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading movies
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message || "Please try again later."}
        </Typography>
      </Box>
    );
  }

  // If there are no movies and not loading, display empty message
  if (!movies.length && !loading) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h6" gutterBottom>
          No movies found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              fontWeight: 700,
              borderBottom: (theme) =>
                `2px solid ${theme.palette.primary.main}`,
              pb: 1,
              display: "inline-block",
            }}
          >
            {title}
          </Typography>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`${movie.id}-${index}`}
            ref={
              useInfiniteScroll && movies.length === index + 1
                ? lastMovieElementRef
                : null
            }
          >
            <MovieCard movie={movie} genres={genres} />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!useInfiniteScroll && hasMore && !loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Button
            variant="contained"
            onClick={onLoadMore}
            size="large"
            sx={{
              minWidth: 200,
              borderRadius: "50px",
              boxShadow: 2,
              py: 1,
            }}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;
