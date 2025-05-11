import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MovieFilter as MovieIcon } from "@mui/icons-material";

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: 300,
  padding: theme.spacing(3),
  textAlign: "center",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
  marginBottom: theme.spacing(2),
}));

const StyledMovieIcon = styled(MovieIcon)(({ theme }) => ({
  fontSize: 56,
  color: theme.palette.primary.main,
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: -28,
  marginLeft: -28,
}));

const LoadingSpinner = ({ message = "Loading movies..." }) => {
  return (
    <LoadingContainer>
      <IconWrapper>
        <CircularProgress size={80} thickness={4} />
        <StyledMovieIcon />
      </IconWrapper>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {message}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Please wait while we fetch the latest data
      </Typography>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
