import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  MovieFilter as MovieIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError("");

    // Simple validation
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      const result = await login(username, password);

      if (result.success) {
        // Redirect to the page they were trying to access or home
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Failed to login. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <MotionPaper
      elevation={6}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 450,
        mx: "auto",
        borderRadius: 2,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        <MovieIcon
          sx={{
            fontSize: 50,
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography component="h1" variant="h4" gutterBottom fontWeight={700}>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Log in to access your favorite movies and personalized recommendations
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Don't have an account?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1, py: 1.5 }}
          onClick={() => {
            // For demo purposes, pre-fill the form with a demo account
            setUsername("demo");
            setPassword("password");
          }}
        >
          Use Demo Account
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, fontSize: "0.8rem" }}
        >
          This is a demo app. In a real application, proper authentication would
          be implemented.
        </Typography>
      </Box>
    </MotionPaper>
  );
};

export default LoginForm;
