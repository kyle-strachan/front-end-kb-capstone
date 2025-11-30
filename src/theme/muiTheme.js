// theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: { main: "#672146" },
    secondary: { main: "#FF8800" },
  },

  typography: {
    h1: {
      fontSize: "1.6rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.3,
      marginBottom: "1.5rem",
    },
    h3: {
      fontSize: "1.2rem",
      fontWeight: 500,
      lineHeight: 1.3,
      marginBottom: "1.5rem",
    },
  },

  components: {
    // Outlined Button hover
    MuiButton: {
      styleOverrides: {
        outlinedPrimary: {
          "&:hover": {
            borderColor: "#672146",
            backgroundColor: "rgba(103, 33, 70, 0.08)",
          },
        },
      },
    },

    // MenuItem wrapper (outer li)
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(14, 14, 14, 0.12) !important",
          },
        },
      },
    },

    // The actual clickable area inside MenuItem
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#fcc6e3ff",
          },
        },
      },
    },

    // Outlined TextField background
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#6721460F", // light grey background
          borderRadius: 4, // optional, keeps it neat
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.06)", // slightly darker on hover
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(0,0,0,0.08)", // darker when focused
          },
        },
        input: {
          backgroundColor: "transparent", // keep the actual text area transparent
        },
      },
    },
  },
});

export default muiTheme;
