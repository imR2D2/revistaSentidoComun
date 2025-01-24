import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Material UI y Estilos
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@src/theme";
import "@src/index.css";

// Context y Rutas
import { GlobalContextProvider } from "@context/GlobalContext";
import Router from "@router/Router";

createRoot(document.getElementById("body")).render(
  <StrictMode>
    <GlobalContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </GlobalContextProvider>
  </StrictMode>
);
