import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { showSnackbar } from '@global/alerts/CustomSnack';

// Material UI
import {
    Button,
    TextField,
    FormControl,
    FormControlLabel,
    InputLabel,
    OutlinedInput,
    Checkbox,
    Box,
    Typography,
    Container,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

// Components
import Registro from "@pages/academia/RegisterAcademia";

// Utilities - Images
import { setVars, getVars } from "@utils/global";
import Logo from "@assets/logo/Logo_C27.png";

const { C27_ACADEMIA_USERNAME, C27_ACADEMIA_PASSWORD } = import.meta.env;

const validationSchema = Yup.object({
    usuario: Yup.string()
        .matches(/^[a-zA-Z0-9_]+$/, "El usuario solo puede contener letras, números y guiones bajos")
        .required("Usuario requerido"),
    password: Yup.string()
        .required("Contraseña requerida"),
});

const LoginAcademia = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [initialValues, setInitialValues] = useState({
        usuario: "",
        password: "",
        rememberMe: false,
    });

    useEffect(() => {
        const saved = getVars("rememberMe", "");

        if (saved) {
            const savedValues = JSON.parse(saved);
            if (savedValues.rememberMe) {
                setInitialValues({
                    usuario: savedValues.usuario || "",
                    password: savedValues.password || "",
                    rememberMe: savedValues.rememberMe,
                });
            }
        }
    }, []);

    const handleSubmit = async (values) => {
        const { usuario, password, rememberMe } = values;

        sessionStorage.clear();

        // Verificar credenciales antes de guardar el localeStorage
        if (usuario !== C27_ACADEMIA_USERNAME || password !== C27_ACADEMIA_PASSWORD) {
            showSnackbar({
                message: "Credenciales inválidas, intenta de nuevo",
                color: "error",
                variant: "filled",
                vertical: "top",
                horizontal: "center",
            });
            return;
        }

        if (rememberMe) {
            setVars("rememberMe", JSON.stringify({ usuario, password, rememberMe }));
        } else {
            localStorage.removeItem("rememberMe");
        }

        setIsAuthenticated(true);
        showSnackbar({
            message: "Inicio de sesión exitoso",
            color: "success",
            variant: "filled",
            vertical: "top",
            horizontal: "center",
        });
    };


    return (
        <>
            {isAuthenticated ?
                <Registro />
                : (<>
                    <Container
                        component="section"
                        maxWidth="xs"
                        sx={{ minHeight: "100vh", p: { xs: 4, sm: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}
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
                                alt="logo de la cggg"
                                loading="lazy"
                                sx={{ height: 80, mb: 1 }}
                            />

                            <Typography component="h1" variant="h5">
                                Iniciar sesión
                            </Typography>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true} // Permite que Formik se reinicie con nuevos valores iniciales
                            >
                                {({ values, handleChange, handleBlur, errors, touched }) => (
                                    <Form noValidate>
                                        <Field
                                            as={TextField}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="usuario"
                                            name="usuario"
                                            label="Usuario"
                                            autoComplete="username"
                                            autoFocus
                                            value={values.usuario}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={touched.usuario && errors.usuario ? errors.usuario : ""}
                                            error={touched.usuario && Boolean(errors.usuario)}
                                        />

                                        <FormControl
                                            variant="outlined"
                                            fullWidth
                                            required
                                            margin="normal"
                                            error={touched.password && Boolean(errors.password)}
                                        >
                                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                                            <Field
                                                as={OutlinedInput}
                                                id="password"
                                                name="password"
                                                label="Contraseña"
                                                type={showPassword ? "text" : "password"}
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                            {touched.password && errors.password && (
                                                <Typography variant="caption" color="error">
                                                    {errors.password}
                                                </Typography>
                                            )}
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Field
                                                    as={Checkbox}
                                                    name="rememberMe"
                                                    color="primary"
                                                    checked={values.rememberMe}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Recuérdame"
                                        />
                                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                            Iniciar sesión
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Container>
                </>)}
        </>
    );
};

export default LoginAcademia;
