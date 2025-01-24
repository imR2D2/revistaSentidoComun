import { Box, Container, Typography, Grid } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Fade } from "@successtar/react-reveal";

const VisionMission = () => {
  return (
    <Container id="VisionMision" component="section" maxWidth="xl" sx={{ py: 6 }}>
      <Fade duration={3000}>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid item xs={12} lg={6} md={12} sm={12} sx={{ display: "flex" }}>
            {/* Sección de Visión */}
            <Box
              sx={{
                backgroundColor: grey[200],
                minHeight: "10vh",
                p: 4,
                borderRadius: 4,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Grid container spacing={4} sx={{ flexGrow: 1 }}>
                <Grid item xs={12}>
                  <Typography
                    marginTop={2}
                    variant="h5"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      color: "black",
                      lineHeight: "1.5",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Visión
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ flexGrow: 1 }}>
                  <Container>
                    <Typography align="justify" sx={{ fontSize: "16px", lineHeight: "1.7" }}>
                      En <strong>Código 27</strong>, aspiramos a ser líderes en el desarrollo web, reconocidos
                      por nuestra creatividad, innovación y compromiso con la excelencia. Buscamos evolucionar
                      continuamente junto con las tendencias tecnológicas para ofrecer soluciones que definan
                      el futuro digital de nuestros clientes.
                    </Typography>
                  </Container>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12} sx={{ display: "flex" }}>
            {/* Sección de Misión */}
            <Box
              sx={{
                backgroundColor: grey[200],
                minHeight: "10vh",
                p: 4,
                borderRadius: 4,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Grid container spacing={4} sx={{ flexGrow: 1 }}>
                <Grid item xs={12}>
                  <Typography
                    marginTop={2}
                    variant="h5"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      color: "black",
                      lineHeight: "1.5",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Misión
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ flexGrow: 1 }}>
                  <Container>
                    <Typography align="justify" sx={{ fontSize: "16px", lineHeight: "1.7" }}>
                      Nuestra misión en <strong>Código 27</strong> es proporcionar soluciones web de alta
                      calidad, personalizadas a las necesidades de nuestros clientes. Nos dedicamos a
                      transformar ideas en proyectos digitales eficientes y escalables, siempre enfocándonos
                      en ofrecer una experiencia de usuario óptima y resultados que impulsen el crecimiento de
                      nuestros clientes.
                    </Typography>
                  </Container>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
};

export default VisionMission;
