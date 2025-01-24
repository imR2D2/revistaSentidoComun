import { useState } from "react";
import PropTypes from "prop-types";

// Material UI
import {
  Dialog,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Box,
  Tooltip,
  IconButton,
  Icon,
  Button,
} from "@mui/material";

import { SwalImage } from "@utils/alerts";
import { isEmptyOrNullObject } from "@utils/validations";

// Importa la imagen predeterminada si no hay una imagen disponible
import defaultImage from "@assets/image_example.jpg";

const CustomModal = (props) => {
  const {
    children,
    open,
    onClose = () => {},
    title = "",
    image = {},
    displayImage = false,
    buttons = [],
    actionButtons = null,
    fullWidth = false,
    maxWidth = "lg",
    fullScreen = false,
    sizeToFullScreen = "sm",
    disabledCancel = false,
    disableClose = false,
    isLoading = false,
    sxCard = {},
    sxModal = {},
    sxContent = {},
  } = props;

  const [error, setError] = useState(false);

  const onError = (e) => {
    e.currentTarget.src = defaultImage;
    setError(true);
  };

  const localDI = !error && displayImage;

  const borderRadius = fullScreen ? {} : { [sizeToFullScreen]: "16px" };
  const size = fullScreen ? {} : { [sizeToFullScreen]: "calc(100% - 64px)" };

  const { src, title: imageTitle = "", height = "200", component = "img" } = image;

  return (
    <Dialog
      open={open}
      onClose={() => (disableClose ? {} : onClose())}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          m: 0,
          backgroundColor: "transparent",
          borderRadius: { xs: "0", ...borderRadius },
          width: { xs: "100%", ...size },
          maxHeight: { xs: "100%", ...size },
          ...sxModal,
        },
      }}
      disableEscapeKeyDown={disableClose}
    >
      <Card
        elevation={3}
        sx={{
          padding: 0,
          overflowY: "auto",
          borderRadius: { xs: "0", ...borderRadius },
          "&::-webkit-scrollbar": { width: { xs: "5px", sm: "8px" }, left: 0 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: "6px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "rgb(255, 255, 255)" },
          ...sxCard,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: 10,
            top: 8,
            display: "flex",
            justifyContent: "right",
            flexDirection: "row-reverse",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Cerrar" placement="bottom" disableInteractive arrow>
            <IconButton
              size="small"
              aria-label="close"
              onClick={onClose}
              sx={{
                color: "inherit",
                zIndex: 10,
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#bdbdbd" },
              }}
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>

          {buttons?.map((item, index) => (
            <Tooltip title={item?.title ?? ""} placement="bottom" disableInteractive arrow key={index}>
              <IconButton
                size="small"
                aria-label={item?.title ?? ""}
                onClick={item?.action ?? (() => {})}
                sx={{
                  color: item?.color ?? "inherit",
                  zIndex: 10,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#bdbdbd" },
                }}
              >
                <Icon> {item?.icon ?? "close"}</Icon>
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        {title && <CardHeader title={title} />}

        {!isEmptyOrNullObject(image) && (
          <CardMedia
            component={component}
            height={height}
            image={src ?? defaultImage}
            alt={imageTitle ?? ""}
            onClick={() => (localDI ? SwalImage({ image: src, imageTitle }) : {})}
            sx={{ cursor: localDI ? "pointer" : "auto" }}
            onError={onError}
          />
        )}

        <CardContent sx={sxContent}>{children}</CardContent>

        {Array.isArray(actionButtons) && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              backgroundColor: "white",
              padding: 2,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            {disabledCancel && (
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancelar
              </Button>
            )}

            {actionButtons?.map((item, index) => (
              <Button
                key={index}
                variant={item.variant ?? "outlined"}
                color={item.color ?? "primary"}
                onClick={() => (item.action ? item.action() : {})}
                href={item?.link ?? ""}
                target={item?.target ?? "_blank"}
                startIcon={item.icon ? <Icon>{item.icon}</Icon> : undefined}
                disabled={isLoading}
              >
                {item?.title ?? "botón"}
              </Button>
            ))}
          </Box>
        )}
      </Card>
    </Dialog>
  );
};

const breaks = ["xs", "sm", "md", "lg", "xl"];

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  displayImage: PropTypes.bool,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(breaks),
  fullScreen: PropTypes.bool,
  sizeToFullScreen: PropTypes.oneOf(breaks),
  disableClose: PropTypes.bool,
  isLoading: PropTypes.bool,
  image: PropTypes.shape({
    title: PropTypes.string,
    src: PropTypes.string,
    component: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string,
      action: PropTypes.func.isRequired,
    })
  ),
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string,
      action: PropTypes.func,
      link: PropTypes.string,
      target: PropTypes.string,
    })
  ),
  disabledCancel: PropTypes.bool,
  sxCard: PropTypes.object,
  sxModal: PropTypes.object,
  sxContent: PropTypes.object,
};

export default CustomModal;
