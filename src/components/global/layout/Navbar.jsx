import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Menu, Home, DesignServices, HelpCenter, Groups, Newspaper, Phone } from "@mui/icons-material";

import Logo_C27 from "@assets/logo/Logo_C27.png";

// Utils
import { scrollToElement } from "@utils/utilities";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const clickItem = (route = "/", id = null) => {
    if (location.pathname !== "/") {
      navigate(`${route}${id ? `#${id}` : ""}`, { replace: true });
    } else if (id) {
      window.location.hash = id;
      setTimeout(() => {
        scrollToElement(id);
      }, 500);
    } else navigate(route);

    setDrawerOpen(false);
  };

  const perfil = [
    { image: true, title: "Logotipo", action: () => clickItem("/") },
    { title: "Inicio", icon: <Home />, action: () => clickItem("/", "Inicio") },
    { title: "Academia", icon: <Newspaper />, action: () => clickItem("/academia", "") },
    { title: "Servicios", icon: <DesignServices />, action: () => clickItem("/", "Services") },
    { title: "Quiénes somos", icon: <HelpCenter />, action: () => clickItem("/", "AboutUs") },
    { title: "Nuestro Equipo", icon: <Groups />, action: () => clickItem("/", "Team") },
    { title: "Contacto", icon: <Phone />, action: () => clickItem("/", "Contacto") },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar component="nav" sx={{ minHeight: { xs: 52 }, justifyContent: "center" }}>
          {/* Navegación en PC */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
              py: 1,
            }}
          >
            {perfil.map((item, index) =>
              !item.image ? (
                <Box
                  key={index}
                  sx={{
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 14,
                    transition: "all 200ms ease",
                    "&:hover": { color: "rgb(0,108,186)", cursor: "pointer" },
                  }}
                  onClick={item.action}
                >
                  {item.title}
                </Box>
              ) : (
                <Box key={index} sx={{ "&:hover": { cursor: "pointer" } }} onClick={item.action}>
                  <img src={Logo_C27} loading="lazy" alt="Logo" style={{ maxHeight: "30px" }} />
                </Box>
              )
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", lg: "none" }, py: 1 }}>
            <Box sx={{ "&:hover": { cursor: "pointer" } }} onClick={() => navigate("/")}>
              <img src={Logo_C27} loading="lazy" alt="Logo" style={{ maxHeight: "30px" }} />
            </Box>
          </Box>

          {/* Separación */}
          <Box sx={{ flexGrow: { xs: 1, lg: 0 } }} />

          {/* Botón del menú para dispositivos móviles */}
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "flex", lg: "none" } }}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ zIndex: (theme) => theme.zIndex.appBar - 1 }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {perfil.map((item, index) =>
              item.title !== "Logotipo" ? (
                <ListItem button key={index} onClick={item.action}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              ) : (
                <Box key={index} sx={{ textAlign: "center", py: 2 }}>
                  <img src={Logo_C27} alt="Logo" style={{ maxHeight: "50px" }} />
                </Box>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
