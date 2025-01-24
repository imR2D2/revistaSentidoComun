import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swal } from "@utils/alerts";

// Material UI
import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Fab,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Download, VisibilityOff, Visibility } from "@mui/icons-material";

// Componentes
import LoadingForm from "@global/progress/LoadingForm";

// Utilidades
import { setVars, setStorage, getStorage } from "@utils/global";

// Servicios
import AuthServices from "@services/AuthServices";

// Recursos
import Logo from "@assets/logo/Logo_C27.png";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    const saved = getStorage("rememberMe", {});

    if (saved?.rememberMe) {
      setFormData({
        ...formData,
        email: saved.email || "",
        password: saved.password || "",
        rememberMe: saved.rememberMe,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Descargar APP Inicio

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      setIsReadyForInstall(true);
    });
  }, []);

  const downloadApp = async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      console.log("oops, no es posible instalar");
      return;
    }
    promptEvent.prompt();
    window.deferredPrompt = null;
    setIsReadyForInstall(false);
  };

  // Fin

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = formData;
    setIsLoading(true);

    // Guardar datos en LocalStorage si se marca "Recuérdame"
    if (rememberMe) setStorage("rememberMe", { email, password, rememberMe });
    else localStorage.removeItem("rememberMe");

    sessionStorage.clear();
    try {
      const params = { email, password };

      const result = await AuthServices.login(params);
      const { results, message, response } = result;

      if (results) {
        setVars("user", response.user);
        setVars("menus", response.menus);
        setVars("token", response.access_token);
        navigate("/home");
      } else Swal.fire({ title: message, icon: "warning" });
    } catch (error) {
      Swal.fire({ title: error.message, icon: "warning" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingForm isOpen={isLoading} isloading={isLoading} message="Iniciando sesión" />
      <Container
        component="section"
        maxWidth="xs"
        sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={`${Logo}`}
            alt="logo"
            loading="lazy"
            sx={{ height: 80, mb: 1 }}
          />

          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
            />

            <FormControl
              variant="outlined"
              fullWidth
              required
              autoComplete="current-password"
              margin="normal"
            >
              <InputLabel htmlFor="password">Contraseña</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  color="primary"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
              }
              label="Recuérdame"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Iniciar sesión
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" onClick={() => navigate("/register")}>
                  {"¿No tienes una cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      {isReadyForInstall && (
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          onClick={downloadApp}
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <Download sx={{ mr: 1 }} />
          Descargar APP
        </Fab>
      )}
    </>
  );
};

export default Login;
