import PropTypes from "prop-types";
import { Box, Fab, Icon, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";

const FloatingButton = ({
  onClick = () => {},
  icon = "arrow_left",
  label = "Mostrar",
  color,
  colorHover = "#0250C1",
  iconSize = "35px",
  iconColor,
  sx = {},
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Comprobar la posición del scroll
      if (window.scrollY > 10) {
        setShowButton(true); // Mostrar el botón después de 10px de desplazamiento
      } else {
        setShowButton(false); // Ocultar el botón si el scroll está por debajo de 10px
      }
    };

    // Agregar el evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    showButton && (
      <Box position={"fixed"} bottom={"24px"} right={"24px"} zIndex={10} sx={sx}>
        <Tooltip title={label} disableInteractive arrow>
          <Fab
            size={"small"}
            aria-label={label}
            color="primaryDark"
            sx={{
              backgroundColor: color,
              "&:hover": { backgroundColor: colorHover },
            }}
            onClick={onClick}
          >
            <Icon sx={{ fontSize: iconSize, color: iconColor ?? "#ffffff" }}>
              {icon}
            </Icon>
          </Fab>
        </Tooltip>
      </Box>
    )
  );
};

FloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  colorHover: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.string,
  sx: PropTypes.object,
};

export default FloatingButton;
