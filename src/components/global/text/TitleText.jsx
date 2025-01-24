import PropTypes from "prop-types";

// Material UI
import { Typography } from "@mui/material";

const TitleText = ({ title = null, sx = {} }) => (
  <Typography
    variant="h5"
    color="initial"
    sx={{ color: "rgb(0,108,186)", fontSize: 26, fontWeight: 700, ...sx }}
  >
    {title}
  </Typography>
);

TitleText.propTypes = {
  title: PropTypes.string,
  sx: PropTypes.object,
};

export default TitleText;
