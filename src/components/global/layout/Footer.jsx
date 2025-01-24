import { getYear } from "date-fns";
import { useNavigate } from "react-router-dom";

// Material UI
import { Container, Box, Grid } from "@mui/material";

// Componentes
import SocialsButtons from "@global/button/SocialsButtons";

// Assets
import Logo_C27 from "@assets/logo/Logo_C27.png";

// Utils
import { scrollToElement } from "@utils/utilities";

const Footer = () => {
  const navigate = useNavigate();

  const clickItem = (route = "/", id = null) => {
    if (location.pathname !== "/") {
      navigate(`${route}${id ? `#${id}` : ""}`, { replace: true });
    } else if (id) {
      window.location.hash = id;
      setTimeout(() => {
        scrollToElement(id);
      }, 500);
    } else navigate(route);
  };

  const links = [
    { title: "Inicio", action: () => clickItem("/", "Inicio") },
    { title: "Academia", action: () => clickItem("/academia", "") },
    { title: "Servicios", action: () => clickItem("/", "Services") },
    { title: "Quiénes somos", action: () => clickItem("/", "AboutUs") },
    { title: "Nuestro Equipo", action: () => clickItem("/", "Team") },
    { title: "Contacto", action: () => clickItem("/", "Contacto") },
  ];

  const currentYear = getYear(new Date());

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        mt: 3,
        pt: 7.5,
        pb: 5,
        px: 3,
        backgroundColor: "rgba(124, 56, 160, 0.08)",
      }}
    >
      <Container
        component="article"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <Box component="section">
          <Box sx={{ "&:hover": { cursor: "pointer" } }} onClick={() => navigate("/")}>
            <img src={Logo_C27} loading="lazy" alt="Logo" style={{ maxHeight: "80px" }} />
          </Box>
        </Box>
        <Grid
          component="section"
          container
          spacing={1}
          rowSpacing={2}
          sx={{ flex: 1, px: { xs: 0, md: 3 }, minWidth: { xs: 0, lg: 518 } }}
        >
          {links.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
              sx={{
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
                transition: "all 200ms ease",
                "&:hover": { color: "rgb(0,108,186)", cursor: "pointer" },
                textAlign: { xs: "center", sm: "left" },
                whiteSpace: "nowrap",
              }}
              onClick={item.action}
            >
              {item.title}
            </Grid>
          ))}
        </Grid>

        <SocialsButtons disableYouTube disableTelegram disableLinkedIn disableGitHub />
      </Container>
      <Box
        component="article"
        sx={{ color: "#707070", lineHeight: "22px", fontWeight: 400, fontSize: "14px", textAlign: "center" }}
      >
        <Box component="section" sx={{ mb: { xs: 2, sm: 1, lg: 0.5 } }}>
          Teléfono: (477) 514 7000 ext. 153 y 154
        </Box>
        <Box component="section" sx={{ mb: { xs: 2, sm: 1, lg: 0.5 } }}>
          Av. 16 de Septiembre No. 130, Colonia Obrera, Silvestre Dorador, 34070 Durango, Dgo., México
        </Box>
        <Box component="section">{currentYear} Coordinación General de Gestión Gubernamental de Durango</Box>
      </Box>
    </Box>
  );
};

export default Footer;
