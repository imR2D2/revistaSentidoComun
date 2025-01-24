import { createTheme } from "@mui/material";
import { esES } from "@mui/material/locale";

export const theme = createTheme(
  {
    breakpoints: {
      values: {
        xs: 0,
        sm: 400,
        md: 600,
        lg: 900,
        xl: 1200,
        xxl: 1536,
      },
    },

    zIndex: {
      mobileStepper: 200,
      fab: 250,
      speedDial: 250,
      drawer: 300,
      appBar: 400,
      modal: 500,
      snackbar: 600,
      tooltip: 700,
    },

    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      fontSize: 14,
      fontWeightBold: 700,
      fontWeightLight: 300,
      fontWeightMedium: 500,
      fontWeightRegular: 400,
      htmlFontSize: 16,
      // button: { fontWeight: 600 },
    },

    palette: {
      // mode: "dark",
    },

    /* components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    }, */
  },
  esES
);
