import PropTypes from "prop-types";

// Material UI
import { Box, Typography } from "@mui/material";

// Estilos
import "react-quill/dist/quill.snow.css";
import "@global/text/htmlText.css";

const HtmlText = ({ content, sx = {}, sxText = {} }) => (
  <Box sx={sx} className="ql-container ql-snow">
    <Typography
      variant="body1"
      align="justify"
      className="ql-editor "
      sx={sxText}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </Box>
);

HtmlText.propTypes = {
  sx: PropTypes.object,
  sxText: PropTypes.object,
};

export default HtmlText;
