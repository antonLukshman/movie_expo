import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";

// Components
import Header from "./components/common/Header";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Pages (lazy loaded)
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MovieDetailsPage = lazy(() => import("./pages/MovieDetailsPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));

// Auth-protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = JSON.parse(localStorage.getItem("user")) !== null;

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: window.location }} replace />;
  }

  return children;
};

// Loading fallback
const PageLoading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <LoadingSpinner />
  </Box>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <FavoritesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Box>
            </Box>
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
