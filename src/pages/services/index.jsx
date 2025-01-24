import { Fade } from "@successtar/react-reveal";

// Material UI
import { Container, Grid, Box, Typography, CardContent, Icon } from "@mui/material";

// Data
import services from "@data/constants/services";

const Services = () => {
  const colors = ["#ABC919", "#652384", "#FFCF13", "#1D95D1", "#E40037"];

  return (
    <Container
      id="Services"
      component="section"
      maxWidth="xl"
      sx={{
        px: { xs: 3 },
        py: 6,
        background: "linear-gradient(135deg, #f0f0f0 30%, #ffffff 100%)",
        borderRadius: "12px",
      }}
    >
      <Fade delay={300}>
        <Box sx={{ textAlign: "center", mb: 4, px: 3 }}>
          <Typography variant="h4" component="h2">
            Servicios
          </Typography>

          <Typography variant="subtitle1" color="textSecondary">
            Conoce qué tipo de desarrollos realizamos
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4} rowSpacing={3} justifyContent="center">
        <style>{`.service-item .react-reveal { height: 100%; } `}</style>

        {services.map((service, index) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={index} className="service-item">
            <Fade delay={400 + index * 5}>
              <Box
                sx={{
                  textAlign: "center",
                  height: "100%",
                  userSelect: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#f9f9f9",
                    "& .material-icons": { transform: "scale(1.4)" },
                    "& .service-title": { transform: "scale(1.1)" },
                  },
                }}
              >
                <CardContent>
                  <Icon
                    sx={{ fontSize: 60, color: colors[index % colors.length], transition: "all 0.3s ease" }}
                  >
                    {service.icon}
                  </Icon>
                  <Typography
                    className="service-title"
                    variant="h6"
                    sx={{
                      mt: 2,
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#1D95D1",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "#555",
                      textAlign: { xs: "justify", sm: "center", md: "justify" },
                      lineHeight: 1.6,
                      px: 1,
                    }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
