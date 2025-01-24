import PropTypes from "prop-types";

// Material UI
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Box,
  Stack,
  LinearProgress,
  CircularProgress,
  Icon,
  Avatar,
} from "@mui/material";
import { grey } from "@mui/material/colors";

// Utilidades
import { numberWithCommas, convertToNumber } from "@utils/format";

const AdaptiveCard = (props) => {
  const {
    title = null,
    icon = null,
    variant = "elevation",
    disableCardType = false,
    config = null,
    leftConfig = null,
    rightConfig = null,
    loading = false,
    fixed = false, // Deja el numero del percent con el primer decimal
    adjust = false, // Quita el borde inferior y pone todo el alto (hace que todas las cards sean iguales)
    noHover = false, // Quita el hover en general
    avatar = false, // Quita el avatar
    avatarsx = {},
    sx = {},
  } = props;

  const adjustHeight = adjust ? { height: "100%", marginBottom: { xs: 0 } } : {};

  return (
    <Card
      className={disableCardType ? "" : "cardStyle"}
      variant={variant}
      sx={{
        display: "flex",
        flexDirection: { xs: avatar ? "column" : "row", sm: "row" },
        ...adjustHeight,
        ...sx,
      }}
    >
      {avatar && (
        <>
          <Box sx={{ p: { xs: 2, sm: 1 }, px: { xs: 2, sm: 3 }, ml: { xs: 0, sm: 1 }, alignSelf: "center" }}>
            <Avatar
              src={typeof avatar === "string" ? avatar : "/broken-image.jpg"}
              sx={{ width: 64, height: 64, ...avatarsx }}
            />
          </Box>
          <Divider orientation={"vertical"} flexItem sx={{ display: { xs: "none", sm: "block" } }} />
          <Divider flexItem sx={{ display: { xs: "block", sm: "none" } }} />
        </>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {title && (
          <Stack direction={"row"} spacing={1} justifyContent="center" marginTop={2} marginX={1}>
            {icon && <Icon sx={{ color: grey[600] }}>{icon}</Icon>}
            <Typography fontWeight={600} variant="h6">
              {title}
            </Typography>
          </Stack>
        )}
        {config !== null && (
          <CardContent
            sx={{
              alignContent: "center",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Item config={config} loading={loading} fixed={fixed} noHover={noHover} content />
          </CardContent>
        )}

        {config !== null && (leftConfig !== null || rightConfig !== null) && (
          <Divider sx={{ mt: title ? 1 : 0 }} />
        )}

        {(leftConfig !== null || rightConfig !== null) && (
          <CardActions sx={{ textAlign: "center", mt: config === null && title ? 1 : 0, flex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
              sx={{ width: "100%", height: "100%" }}
            >
              {/* Izquierdo */}
              {leftConfig !== null && (
                <Item config={leftConfig} loading={loading} fixed={fixed} noHover={noHover} />
              )}

              {/* Derecho */}
              {rightConfig !== null && (
                <Item config={rightConfig} loading={loading} fixed={fixed} noHover={noHover} />
              )}
            </Stack>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

const Item = (props) => {
  const { config, loading, fixed, noHover, content = false } = props;

  const getColor = (value) => {
    if (value >= 0 && value < 20) return "#EF4624";
    else if (value >= 20 && value < 40) return "#F9912A";
    else if (value >= 40 && value < 60) return "#EBC100";
    else if (value >= 60 && value < 80) return "#A6CE3A";
    else return "#2CB451";
  };

  const localHover = config?.noHover === undefined ? false : config?.noHover;

  const hover = noHover || localHover ? {} : { "&:hover": { transform: "scale(1.3)" } };

  const scale = {
    width: "100%",
    display: "inline-flex",
    justifyContent: "center",
    transition: "transform 0.3s ease-in-out",
    ...hover,
  };

  const title = config?.title !== undefined ? config?.title : null;
  const data = config?.data !== undefined ? convertToNumber(config?.data) : null;
  const percent = config?.percent !== undefined ? convertToNumber(config?.percent) : null;

  return (
    <Stack sx={{ width: "100%", gap: percent ? 1 : 0 }}>
      {title !== null && (
        <Typography align="center" sx={{ fontWeight: "light", fontFamily: "Helvetica Neue" }}>
          {title}
        </Typography>
      )}

      {percent !== null && (
        <>
          {config?.type === "linear" ? (
            <Box
              sx={{
                ...scale,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: 0.3,
              }}
            >
              {!loading && (
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Helvetica Neue",
                    fontSize: content ? 18 : 14,
                    color: getColor(percent),
                  }}
                >{`${percent >= 100 ? 100 : percent.toFixed(fixed ? 1 : 0)}%`}</Typography>
              )}

              <LinearProgress
                variant={loading ? "indeterminate" : "determinate"}
                value={parseInt(percent) >= 100 ? 100 : parseInt(percent)}
                sx={{
                  height: 8,
                  width: "80%",
                  backgroundColor: "#eeeeee",
                  animationDuration: "550ms",
                  borderRadius: "30px",
                  "& span": { borderRadius: "30px", backgroundColor: getColor(percent) },
                }}
              />
            </Box>
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
              <Box sx={{ ...scale, mt: 0.3, position: "relative" }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant={loading ? "indeterminate" : "determinate"}
                    sx={{ color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800] }}
                    size={content ? 80 : 60}
                    thickness={4}
                    value={100}
                  />
                  <CircularProgress
                    variant={loading ? "indeterminate" : "determinate"}
                    value={parseInt(percent) >= 100 ? 100 : parseInt(percent)}
                    sx={{
                      color: getColor(percent),
                      animationDuration: "550ms",
                      position: "absolute",
                      left: 0,
                      [`& circle`]: { strokeLinecap: "round" },
                    }}
                    size={content ? 80 : 60}
                    thickness={4}
                  />
                </Box>

                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!loading && (
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "Helvetica Neue",
                        fontSize: content ? 18 : 14,
                        color: getColor(percent),
                      }}
                    >{`${percent >= 100 ? 100 : percent.toFixed(fixed ? 1 : 0)}%`}</Typography>
                  )}
                </Box>
              </Box>
            </Stack>
          )}
        </>
      )}

      {data !== null && (
        <>
          {loading && percent === null ? (
            <Stack alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
              <CircularProgress sx={{ m: 1 }} size={19} />
            </Stack>
          ) : (
            !loading && (
              <Box sx={scale}>
                <Typography
                  sx={{
                    fontSize: content ? 18 : 16,
                    fontWeight: content ? "bold" : "medium",
                    fontFamily: "Helvetica Neue",
                  }}
                >
                  {numberWithCommas(parseInt(data))}
                </Typography>
              </Box>
            )
          )}
        </>
      )}
    </Stack>
  );
};

const shape = PropTypes.shape({
  title: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  percent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf(["circular", "linear"]), // Tipo de grafica
  noHover: PropTypes.bool, // Quita el hover de ese campo
});

AdaptiveCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  variant: PropTypes.oneOf(["", "elevation", "outlined"]),
  disableCardType: PropTypes.bool,
  config: shape,
  leftConfig: shape,
  rightConfig: shape,
  loading: PropTypes.bool,
  fixed: PropTypes.bool,
  adjust: PropTypes.bool,
  noHover: PropTypes.bool,
  avatar: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  avatarsx: PropTypes.object,
  sx: PropTypes.object,
};

export default AdaptiveCard;
