import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import {
  SentimentVeryDissatisfied,
  Home as HomeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Logo from "../components/ui/Logo";

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 200px)",
          py: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Logo size="xlarge" showText={false} linkTo={null} />

            <SentimentVeryDissatisfied
              sx={{ fontSize: 70, color: "text.secondary", my: 3 }}
            />

            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "3rem", md: "4rem" },
              }}
            >
              404
            </Typography>

            <Typography variant="h5" gutterBottom>
              Page Not Found
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ mb: this.paragraph, maxWidth: 500, mx: "auto" }}
            >
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </Typography>

            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              sx={{ px: 4, py: 1.5, borderRadius: 50, mt: 2 }}
            >
              Back to Home
            </Button>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFound;
