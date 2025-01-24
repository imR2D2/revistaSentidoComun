import PropTypes from "prop-types";

// Material UI
import { Box, Drawer, Stack, Icon, Typography, IconButton, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// Hooks
import useWindowDimensions from "@hooks/useWindowDimensions";

const DrawerRelative = (props) => {
  const {
    open = true,
    setOpen = () => {},
    title = null,
    icon = null,
    titleSpace = true,
    titleComponent = null,
    titleComponentPlace = "between",
    variant = "persistent",
    anchor = "left",
    className = "",
    sx = {},
    sxPaper = {},
    sxTitle = {},
    isSticky = false,
    maxHeight = {},
    screenHeight = null,
  } = props;

  const { height: screenH } = useWindowDimensions();

  const sticky = isSticky ? { position: "sticky", top: "5rem", height: "fit-content" } : { height: "100%" };

  const localHeight = screenHeight
    ? { [screenHeight]: screenH - 96 }
    : {
        xs: maxHeight?.xs ?? "100%",
        sm: maxHeight?.sm,
        md: maxHeight?.md,
        lg: maxHeight?.lg,
        xl: maxHeight?.xl,
      };

  return (
    <Box sx={sticky}>
      <Drawer
        variant={variant}
        anchor={anchor}
        open={open}
        className={className}
        sx={{
          height: "100%",
          display: open ? "block" : "none",
          ...sx,
          "& .MuiDrawer-paper": {
            zIndex: 10,
            overflowY: "auto",
            position: "relative",
            maxHeight: localHeight,
            border: 0,
            paddingBottom: 2,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: "6px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            ...sxPaper,
          },
        }}
      >
        {(title || titleComponent) && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              padding={2}
              sx={{ ...sxTitle }}
            >
              {title && (
                <Stack direction="row" alignItems="center" spacing={1} marginBottom="0.5rem">
                  {icon && <Icon>{icon}</Icon>}
                  <Typography fontWeight={600} variant="body2">
                    {title}
                  </Typography>
                </Stack>
              )}
              {titleSpace && <span style={{ flex: 1 }} />}
              {titleComponent && titleComponentPlace === "between" && titleComponent}
              <IconButton onClick={() => setOpen(false)}>
                {anchor === "left" ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Stack>
            {titleComponent && titleComponentPlace === "under" && titleComponent}
            <Divider sx={{ marginBottom: "1rem" }} />
          </>
        )}
        {props.children}
      </Drawer>
    </Box>
  );
};

DrawerRelative.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.string,
  titleSpace: PropTypes.bool,
  titleComponent: PropTypes.node,
  titleComponentPlace: PropTypes.oneOf(["under", "between"]),
  variant: PropTypes.oneOf(["persistent", "permanent", "temporary"]),
  anchor: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string,
  sx: PropTypes.object,
  sxPaper: PropTypes.object,
  sxTitle: PropTypes.object,
  isSticky: PropTypes.bool,
  maxHeight: PropTypes.object,
  screenHeight: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
};

export default DrawerRelative;
