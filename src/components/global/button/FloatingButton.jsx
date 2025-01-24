import PropTypes from "prop-types";

// Material UI
import { Box, Fab, Icon, Tooltip } from "@mui/material";

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
  return (
    <Box position={"fixed"} bottom={"24px"} right={"24px"} zIndex={10} sx={sx}>
      <Tooltip title={label} disableInteractive arrow>
        <Fab
          size={"small"}
          aria-label={label}
          color="primaryDark"
          sx={{ backgroundColor: color, "&:hover": { backgroundColor: colorHover } }}
          onClick={onClick}
        >
          <Icon sx={{ fontSize: iconSize, color: iconColor ?? "#ffffff" }}>{icon}</Icon>
        </Fab>
      </Tooltip>
    </Box>
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
