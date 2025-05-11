import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Tooltip,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import MovieGrid from "../components/movies/MovieGrid";
import { useAuth } from "../context/AuthContext";
import { useMovie } from "../context/MovieContext";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { favorites, removeFromFavorites } = useMovie();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [confirmAllDialog, setConfirmAllDialog] = useState(false);

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Open confirmation dialog for removing a movie
  const handleRemoveClick = (movie) => {
    setSelectedMovie(movie);
    setOpenDialog(true);
  };

  // Handle remove all favorites
  const handleRemoveAll = () => {
    setConfirmAllDialog(true);
  };

  // Confirm removal of a movie
  const handleConfirmRemove = () => {
    if (selectedMovie) {
      removeFromFavorites(selectedMovie.id);
    }
    setOpenDialog(false);
  };

  // Confirm removal of all movies
  const handleConfirmRemoveAll = () => {
    favorites.forEach((movie) => {
      removeFromFavorites(movie.id);
    });
    setConfirmAllDialog(false);
  };

  // Close dialogs
  const handleClose = () => {
    setOpenDialog(false);
    setConfirmAllDialog(false);
  };

  // Render content based on authentication status
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ textAlign: "center", py: 6 }}>
            <FavoriteBorderIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Sign in to view your favorites
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Create an account or sign in to save your favorite movies and
              access them from any device.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login", { state: { from: location } })}
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </motion.div>
      </Container>
    );
  }

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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={700}
            >
              Your Favorites
              <FavoriteIcon
                sx={{ ml: 1, color: "secondary.main", verticalAlign: "middle" }}
              />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {favorites.length > 0
                ? `You have ${favorites.length} favorite movie${
                    favorites.length > 1 ? "s" : ""
                  }`
                : "You haven't saved any favorites yet"}
            </Typography>
          </motion.div>

          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemoveAll}
              >
                Clear All
              </Button>
            </motion.div>
          )}
        </Box>

        {favorites.length === 0 && (
          <Alert
            severity="info"
            sx={{ my: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate("/")}
              >
                Browse Movies
              </Button>
            }
          >
            Start exploring and save movies to your favorites list.
          </Alert>
        )}
      </Box>

      {favorites.length > 0 ? (
        <MovieGrid
          movies={favorites}
          title={null}
          showFilters={true}
          emptyMessage="No favorite movies found"
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <FavoriteBorderIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Your favorites list is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start exploring movies and click the heart icon to add them to your
            favorites.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Discover Movies
          </Button>
        </Box>
      )}

      {/* Confirm Remove Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Remove from Favorites?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove "{selectedMovie?.title}" from your
            favorites?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Remove All Dialog */}
      <Dialog
        open={confirmAllDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title-all"
        aria-describedby="alert-dialog-description-all"
      >
        <DialogTitle id="alert-dialog-title-all">
          Clear All Favorites?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-all">
            Are you sure you want to remove all {favorites.length} movies from
            your favorites? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemoveAll} color="error" autoFocus>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FavoritesPage;
