import { createTheme } from "@mui/material/styles";

// Function to create a theme based on mode (dark/light)
const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2",
        light: mode === "dark" ? "#a6d4fa" : "#42a5f5",
        dark: mode === "dark" ? "#648dae" : "#1565c0",
      },
      secondary: {
        main: mode === "dark" ? "#f48fb1" : "#e91e63",
        light: mode === "dark" ? "#f6a5c0" : "#f48fb1",
        dark: mode === "dark" ? "#bf5f82" : "#c2185b",
      },
      error: {
        main: mode === "dark" ? "#f44336" : "#d32f2f",
      },
      warning: {
        main: mode === "dark" ? "#ff9800" : "#ed6c02",
      },
      info: {
        main: mode === "dark" ? "#29b6f6" : "#0288d1",
      },
      success: {
        main: mode === "dark" ? "#66bb6a" : "#2e7d32",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
        subtle: mode === "dark" ? "#262626" : "#f0f0f0",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
        secondary:
          mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
        disabled:
          mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)",
      },
      action: {
        active: mode === "dark" ? "#ffffff" : "rgba(0, 0, 0, 0.54)",
        hover:
          mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
      },
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.2,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.2,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: 1.2,
      },
      subtitle1: {
        fontSize: "1rem",
        lineHeight: 1.5,
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: "0.875rem",
        lineHeight: 1.57,
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.43,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "dark"
                ? "0 8px 16px rgba(0, 0, 0, 0.4)"
                : "0 8px 16px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                mode === "dark"
                  ? "0 12px 20px rgba(0, 0, 0, 0.5)"
                  : "0 12px 20px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 6px 10px rgba(0, 0, 0, 0.3)"
                  : "0 6px 10px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "dark"
                ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                : "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#555555" : "#cccccc",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "dark" ? "#333333" : "#f0f0f0",
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
};

export default createAppTheme;
