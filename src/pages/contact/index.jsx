import { useFormik } from "formik";

// Material UI
import { Grid, Typography, TextField, Button, Container, Divider, Box } from "@mui/material";
import { Fade } from "@successtar/react-reveal";

// Data
import { contacto } from "@schemas/contact";

// Utils
import { validatePhone } from "@utils/validations";

const Contacto = () => {
  const EmailC27 = "contacto@codigo27.mx";

  const formik = useFormik({
    initialValues: { nombre: "", telefono: "", mensaje: "" },
    validationSchema: contacto,
    onSubmit: async (values) => handleGuardar(values),
  });

  const handleGuardar = (values) => {
    const subject = "Consulta desde el sitio Código27: Duda o Comentario";
    const body = `
      Nombre: ${values.nombre}\n
      Teléfono: ${values.telefono}\n
      ${values.mensaje}
    `;
    const mailtoLink = `mailto:${EmailC27}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;
    window.location.href = mailtoLink;
    formik.resetForm();
  };

  const setValues = (title, value) => formik.setValues((prev) => ({ ...prev, [title]: value }));

  const setErrors = (title, value) => formik.setErrors((prev) => ({ ...prev, [title]: value }));

  return (
    <Container id="Contacto" component="section" maxWidth="lg" sx={{ mt: 6 }}>
      <Fade duration={3000}>
        <>
          <Divider />
          <Box sx={{ textAlign: "center", my: 4, px: 3 }}>
            <Typography variant="h4" component="h2">
              Contacto
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              ¿Tienes alguna duda o comentario? Déjanos un mensaje
            </Typography>
          </Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  variant="outlined"
                  placeholder="Ingresa tu nombre"
                  size="small"
                  value={formik.values.nombre}
                  onChange={(e) => setValues("nombre", e.target.value)}
                  error={Boolean(formik.errors.nombre)}
                  helperText={formik.errors.nombre}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Teléfono"
                  variant="outlined"
                  placeholder="Ingresa tu número de teléfono"
                  size="small"
                  value={formik.values.telefono}
                  onChange={({ target: { value } }) => {
                    if (validatePhone(value)) setValues("telefono", value);
                    else setErrors("telefono", "Número de teléfono no válido");
                  }}
                  error={Boolean(formik.errors.telefono)}
                  helperText={formik.errors.telefono}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                variant="outlined"
                placeholder="Escribe tu mensaje"
                multiline
                rows={4}
                size="small"
                value={formik.values.mensaje}
                onChange={(e) => setValues("mensaje", e.target.value)}
                error={Boolean(formik.errors.mensaje)}
                helperText={formik.errors.mensaje}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={!formik.isValid}
                onClick={formik.submitForm}
              >
                Enviar Datos
              </Button>
            </Grid>
          </Grid>
        </>
      </Fade>
    </Container>
  );
};

export default Contacto;
