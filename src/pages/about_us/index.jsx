import { Box, Container, Typography, Grid } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Fade } from "@successtar/react-reveal";

const AboutUs = () => {
  return (
    <Container id="AboutUs" component="section" maxWidth="lg" sx={{ py: 6 }}>
      <Fade duration={3000}>
        <Box
          sx={{
            backgroundColor: grey[200],
            minHeight: "10vh",
            p: 4,
            borderRadius: 4,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={4}>
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
                ¿Quiénes Somos?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Container>
                <Typography align="justify" sx={{ fontSize: "16px", lineHeight: "1.7" }}>
                  En Código 27, somos una empresa privada especializada en el desarrollo de soluciones
                  digitales innovadoras. Nos dedicamos a la creación de páginas web a medida y plataformas
                  digitales que ayudan a nuestros clientes a alcanzar sus objetivos en el mundo digital.
                  <br />
                  <br />
                  Con un equipo de desarrolladores apasionados y expertos en tecnología, nuestro enfoque se
                  basa en brindar productos de alta calidad, optimizando cada detalle para mejorar la
                  experiencia del usuario y adaptándonos a las necesidades específicas de cada proyecto.
                  <br />
                  <br />
                  Nos enorgullece ser un socio confiable en el desarrollo de proyectos digitales, trabajando
                  estrechamente con nuestros clientes para convertir sus ideas en realidades. Nuestro
                  compromiso con la excelencia y la innovación es lo que nos impulsa a seguir creciendo.
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default AboutUs;
