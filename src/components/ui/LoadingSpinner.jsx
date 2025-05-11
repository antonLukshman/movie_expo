import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

/**
 * A reusable loading spinner component with optional text
 *
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner ('small', 'medium', 'large')
 * @param {string} [props.message='Loading...'] - Text to display under the spinner
 * @param {number} [props.minHeight=400] - Minimum height of the container
 * @param {boolean} [props.fullPage=false] - Whether to take up the full page height
 */
const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  minHeight = 400,
  fullPage = false,
}) => {
  // Determine spinner size based on the size prop
  const spinnerSizes = {
    small: 30,
    medium: 50,
    large: 70,
  };

  const spinnerSize = spinnerSizes[size] || spinnerSizes.medium;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullPage ? "calc(100vh - 150px)" : minHeight,
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CircularProgress size={spinnerSize} thickness={4} />
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Typography
            variant={size === "small" ? "body2" : "body1"}
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default LoadingSpinner;
