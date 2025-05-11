import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Logo = ({ size = "medium", showText = true, linkTo = "/" }) => {
  const { mode } = useTheme();

  // Define logo sizes
  const sizes = {
    small: 24,
    medium: 32,
    large: 48,
    xlarge: 64,
  };

  const logoSize = sizes[size] || sizes.medium;
  const textVariant = size === "small" ? "body1" : "h6";

  // Logo with SVG content - this is the same as our favicon
  const LogoSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={logoSize}
      height={logoSize}
    >
      {/* Background */}
      <rect width="64" height="64" rx="14" fill="#3f51b5" />

      {/* Film Strip Element */}
      <rect
        x="8"
        y="10"
        width="48"
        height="44"
        rx="4"
        fill="#121212"
        opacity="0.7"
      />

      {/* Film Holes */}
      <circle cx="14" cy="16" r="2" fill="#fff" opacity="0.9" />
      <circle cx="14" cy="24" r="2" fill="#fff" opacity="0.9" />
      <circle cx="14" cy="32" r="2" fill="#fff" opacity="0.9" />
      <circle cx="14" cy="40" r="2" fill="#fff" opacity="0.9" />
      <circle cx="14" cy="48" r="2" fill="#fff" opacity="0.9" />

      <circle cx="50" cy="16" r="2" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="24" r="2" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="32" r="2" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="40" r="2" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="48" r="2" fill="#fff" opacity="0.9" />

      {/* Letter M */}
      <path
        d="M22 18L22 46L28 46L32 36L36 46L42 46L42 18L36 18L36 36L32 26L28 36L28 18L22 18Z"
        fill="#ff4081"
      />

      {/* Play Button */}
      <circle
        cx="32"
        cy="32"
        r="14"
        fill="none"
        stroke="#ff4081"
        strokeWidth="2"
        opacity="0.6"
      />
      <path d="M28 24L40 32L28 40Z" fill="#ff4081" opacity="0.8" />
    </svg>
  );

  // If this is just an icon with no link
  if (!linkTo) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LogoSvg />
        {showText && (
          <Typography
            variant={textVariant}
            sx={{
              fontWeight: 700,
              color: mode === "dark" ? "#ffffff" : "#333333",
            }}
          >
            Movie Explorer
          </Typography>
        )}
      </Box>
    );
  }

  // With link
  return (
    <Box
      component={Link}
      to={linkTo}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <LogoSvg />
      {showText && (
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 700,
          }}
        >
          Movie Explorer
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
