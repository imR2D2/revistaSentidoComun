import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Material UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Icon,
  LinearProgress,
  Typography,
} from "@mui/material";

const LoadingForm = (props) => {
  const {
    isOpen = false,
    canClose = false,
    setIsOpen = null,
    success = true,
    isLoading = true,
    icon,
    message = "Cargando...",
  } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const close = () => {
    if (setIsOpen) setIsOpen(false);
    else console.error("La propiedad 'setIsOpen' es requerida para poder cerrar el LoadingForm.");
  };

  return (
    <Dialog onClose={canClose ? close : () => {}} open={open} sx={{ zIndex: 1000 }}>
      {!isLoading && (
        <DialogTitle sx={{ display: "flex", justifyContent: "right", p: 0, px: 1 }}>
          <IconButton aria-label="close" onClick={close} sx={{}}>
            <Icon sx={{ fontSize: 20 }}>close</Icon>
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent
        align="center"
        dividers
        sx={{ p: 3, px: { xs: 2, sm: 3 }, pt: !isLoading ? 2 : 3, overflow: "hidden" }}
      >
        {isLoading && (
          <>
            <LinearProgress
              color="info"
              sx={{ height: 8, marginBottom: message !== "" ? 1 : 0, borderRadius: 4, minWidth: 150 }}
            />
            <Typography
              variant="subtitle1"
              component="header"
              sx={{ flex: 1, fontWeight: "medium", fontSize: 20, px: 3 }}
            >
              {message}
            </Typography>
          </>
        )}

        {!isLoading && (
          <>
            <Icon color={success ? "success" : "error"} sx={{ fontSize: 50 }}>
              {icon ?? success ? "check_circle" : "error"}
            </Icon>
            <Typography
              variant="subtitle1"
              component="header"
              sx={{ flex: 1, fontWeight: "medium", fontSize: 20 }}
            >
              {message}
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

LoadingForm.propTypes = {
  icon: PropTypes.string,
  message: PropTypes.string,
  success: PropTypes.bool,
  canClose: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default LoadingForm;
