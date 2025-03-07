import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Material UI y Estilos
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Typography, Box } from "@mui/material";
import { theme } from "@src/theme";
import "@src/index.css";

// Context y Rutas
import { GlobalContextProvider } from "@context/GlobalContext";
import Router from "@router/Router";

function Version() {
  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Typography variant="caption" color="text.secondary" fontSize={14}>
        Versión: {import.meta.env.SC_VERSION}
      </Typography>
    </Box>
  );
}

createRoot(document.getElementById("body")).render(
  <StrictMode>
    <GlobalContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename="/wp-content/uploads/revista-digital/build">
          <Router />
          <Version /> {/* Aquí se muestra la versión debajo del contenido */}
        </BrowserRouter>
      </ThemeProvider>
    </GlobalContextProvider>
  </StrictMode>
);
