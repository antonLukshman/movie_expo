import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import LoginForm from "../components/user/LoginForm";
import { useAuth } from "../context/AuthContext";
import { IMAGE_SIZES } from "../api/tmdbApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Sample featured movies (in a real app, would fetch from API)
  const featuredMovies = [
    {
      id: 299534,
      title: "Avengers: Endgame",
      backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    },
    {
      id: 299536,
      title: "Avengers: Infinity War",
      backdrop_path: "/kbGO5mHPK7rh516MgAIJUQ9RvqD.jpg",
    },
    {
      id: 1726,
      title: "The Iron Man",
      backdrop_path: "/vbY95t58MDArtyUXUIb8Fx1dCry.jpg",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 8,
        bgcolor: "background.subtle",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          {/* Login Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              order: { xs: 2, md: 1 },
            }}
          >
            <LoginForm />
          </Grid>

          {/* Right Side - Featured Movies */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              order: { xs: 1, md: 2 },
              mb: { xs: 4, md: 0 },
            }}
          >
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 500,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  {featuredMovies.map((movie, index) => (
                    <Box
                      key={movie.id}
                      component={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        zIndex: featuredMovies.length - index,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.2,
                      }}
                      sx={{
                        position: "absolute",
                        top: index * 40,
                        right: index * 40,
                        width: "90%",
                        height: 400,
                        borderRadius: 4,
                        boxShadow: 8,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={`${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`}
                        alt={movie.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                        }}
                      >
                        <Typography variant="h6" color="white" fontWeight={600}>
                          {movie.title}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Discover and save your favorite movies
                </Typography>
              </motion.div>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
