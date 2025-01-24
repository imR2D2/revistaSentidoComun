import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const NotFound = ({
  title = "No se encontraron resultados",
  subTitle = "Intenta utilizar los filtros",
  customText = null,
}) => (
  <Box sx={{ textAlign: "center", mt: -2 }}>
    <SearchOff style={{ fontSize: 80, color: "#999" }} />

    {customText}

    {title && (
      <Typography variant="h5" mt={2} mb={1}>
        {title}
      </Typography>
    )}

    {subTitle && (
      <Typography variant="body1" color="textSecondary">
        {subTitle}
      </Typography>
    )}
  </Box>
);

NotFound.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  customText: PropTypes.node,
};

export default NotFound;
