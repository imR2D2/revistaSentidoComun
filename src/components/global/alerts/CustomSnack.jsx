import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// Material UI
import { Box, Snackbar, Alert } from "@mui/material";

const CustomSnack = (props) => {
  const {
    message = "",
    color = "error",
    variant = "standard",
    maxWidth = 500,
    vertical = "bottom",
    horizontal = "right",
    hideDuration = 5000,
    onClose = () => {},
  } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <Box sx={{ maxWidth }}>
      <Snackbar
        sx={{ maxWidth }}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={hideDuration}
        open={open}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={color}
          variant={variant}
          sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const showSnackbar = (props) => {
  const { message, color, variant, maxWidth, vertical, horizontal, hideDuration } = props;

  const div = document.createElement("div");
  document.body.appendChild(div);

  const handleClose = () => {
    setTimeout(() => {
      if (div.parentNode === document.body) document.body.removeChild(div);
    }, 1000);
  };

  const root = createRoot(div);
  root.render(
    <CustomSnack
      message={message ?? ""}
      color={color ?? "error"}
      variant={variant ?? "standard"}
      maxWidth={maxWidth ?? 500}
      vertical={vertical ?? "bottom"}
      horizontal={horizontal ?? "right"}
      hideDuration={hideDuration ?? 5000}
      onClose={handleClose}
    />
  );

  return { success: false, results: false, data: {} };
};

CustomSnack.propTypes = {
  message: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["error", "info", "success", "warning", "string"]),
  variant: PropTypes.oneOf(["filled", "outlined", "standard", "string"]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  horizontal: PropTypes.oneOf(["center", "left", "right"]),
  vertical: PropTypes.oneOf(["bottom", "top"]),
  hideDuration: PropTypes.number,
  onClose: PropTypes.func,
};

export default CustomSnack;
