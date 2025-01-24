// Material UI
import { Typography, Box, Grid, Link, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Fade } from "@successtar/react-reveal";

// Images
import Logo_C27_Text_Dark from "@assets/logo/Logo_C27_Text_Dark.webp";
import Logo_C27 from "@assets/logo/Logo_C27.png";

// Utils
import { scrollToElement } from "@utils/utilities";

const Home = () => {
  return (
    <Box
      id="Inicio"
      component="section"
      sx={{ minHeight: "100vh", p: { xs: 4, sm: 5 }, pt: { xs: 12, sm: 20 }, backgroundColor: grey[300] }}
    >
      <Fade duration={3000}>
        <>
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "absolute",
              zIndex: 100,
              right: { xs: 4, sm: 10, xl: 80 },
              top: { xs: 30, sm: 30 },
              height: { xs: "320px", md: "400px", lg: "480px" },
              width: { xs: "320px", md: "400px", lg: "480px" },
              borderRadius: "50%",
              filter: "blur(100px)",
              animation: "pulse 1s ease-in-out infinite",
              backgroundImage:
                "linear-gradient(to bottom right, rgba(106, 27, 154, 0.8), rgba(123, 31, 162, 0.6))",
            }}
          />

          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={Logo_C27}
              alt="Imagen superpuesta"
              sx={{
                zIndex: 200,
                position: "absolute",
                top: 50,
                right: { xs: 10, xl: 120 },
                width: "400px",
                display: { xs: "none", lg: "block" },
              }}
            />
          </Box>
        </>
      </Fade>

      <Fade left>
        <Grid container spacing={2} sx={{ pl: { xs: 0, sm: 2, md: 5 } }}>
          <Grid item lg={6} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h5"
              align="left"
              sx={{
                fontWeight: "bold",
                backgroundImage: "linear-gradient(to right, rgb(138,190,20), rgb(34,115,44))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Únete y potencia tu éxito
            </Typography>

            <Typography
              align="left"
              sx={{
                fontSize: { xs: 40, sm: 50, md: 60 },
                fontWeight: "bold",
                color: "black",
                lineHeight: "normal",
              }}
            >
              Explora experiencias únicas con
            </Typography>
            <img
              src={Logo_C27_Text_Dark}
              alt="C27"
              style={{
                marginTop: 30,
                marginBottom: 20,
                display: "inline-block",
                background: "linear-gradient(to right, #ab47bc, #8e24aa)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                maxWidth: "100%",
              }}
            />
            {/* <Typography
                align="center"
                sx={{
                mt: -2,
                fontSize: "17px",
                fontWeight: "bold",
                color: "rgb(232,0,63)",
                }}
            >
                Comunicación Pólitica
            </Typography> */}

            <Typography
              sx={{
                mt: { xs: 5, md: 0 },
                color: "#757575",
                fontWeight: 400,
                fontSize: 20,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              En Código 27 hacemos estrategias de comunicación que brindan ventajas competitivas para ganar!
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                component={Link}
                variant="contained"
                onClick={() => scrollToElement("Contacto")}
                sx={{
                  mt: { xs: 8, md: 10 },
                  fontWeight: 700,
                  bgcolor: "rgb(138,190,0)",
                  color: "white",
                  textTransform: "none",
                  width: "150px",
                  height: "40px",
                  "&:hover": {
                    bgcolor: "rgb(50,152,63)",
                  },
                }}
              >
                Contactanos
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  );
};

export default Home;
