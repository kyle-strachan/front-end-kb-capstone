// /src/theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: { main: "#672146" },
    secondary: { main: "#FF8800" },
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
            backgroundColor: "rgba(197, 54, 10, 0.75) !important",
          },
        },
      },
    },
  },
});

export default muiTheme;
