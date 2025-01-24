import PropTypes from "prop-types";

// Material UI
import { Stack, Box, Typography, LinearProgress, CircularProgress, Chip, Icon } from "@mui/material";

// Utils
import { getColor } from "@utils/utilities";

const ProgressPercent = (props) => {
  const {
    value = 0,
    size = 60,
    fontSize = 14,
    height = 8,
    fixed = 0,
    type = "circular",
    disableFontColor = false,
    iconFlag = false,
    sizeChip = "medium",
    customColors = null,
  } = props;
  const { color, font, icon } = customColors ? customColors(value) : getColor(value);
  const percent = `${value >= 100 ? 100 : value % 1 !== 0 ? value.toFixed(fixed) : value}%`;

  return type === "linear" ? (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography sx={{ fontWeight: "bold", fontFamily: "Helvetica Neue", fontSize: fontSize, color: color }}>
        {percent}
      </Typography>

      <LinearProgress
        variant={"determinate"}
        value={parseInt(value) >= 100 ? 100 : parseInt(value)}
        sx={{
          height: height,
          width: "80%",
          backgroundColor: "#eeeeee",
          animationDuration: "550ms",
          borderRadius: "30px",
          "& span": { borderRadius: "30px", backgroundColor: color },
        }}
      />
    </Box>
  ) : type === "chip" ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Chip
        label={percent}
        icon={
          iconFlag ? (
            <Icon
              sx={{
                color: `${disableFontColor ? "#000" : font} !important`,
                fontSize: `${fontSize + 4}px !important`,
              }}
            >
              {icon}
            </Icon>
          ) : (
            <></>
          )
        }
        sx={{
          backgroundColor: color,
          color: font,
          fontWeight: 500,
          fontSize: fontSize,
          lineHeight: 1,
          py: 0.5,
          height: "fit-content",
        }}
        size={sizeChip}
      />
    </Box>
  ) : (
    <Stack alignItems="center" justifyContent="center">
      <Box sx={{ position: "relative" }}>
        <Box sx={{ display: "flex" }}>
          <CircularProgress
            variant={"determinate"}
            sx={{ color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800] }}
            size={size}
            thickness={4}
            value={100}
          />
          <CircularProgress
            variant={"determinate"}
            value={parseInt(value) >= 100 ? 100 : parseInt(value)}
            sx={{
              color: color,
              animationDuration: "550ms",
              position: "absolute",
              left: 0,
              [`& circle`]: { strokeLinecap: "round" },
            }}
            size={size}
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
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Helvetica Neue",
              fontSize: fontSize,
              color: disableFontColor ? "#000" : color,
              lineHeight: 0,
            }}
          >
            {percent}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

ProgressPercent.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.number,
  fontSize: PropTypes.number,
  height: PropTypes.number,
  fixed: PropTypes.number,
  type: PropTypes.oneOf(["circular", "linear", "chip"]), // Tipo de grafica
  disableFontColor: PropTypes.bool,
  iconFlag: PropTypes.bool,
  sizeChip: PropTypes.string,
  customColors: PropTypes.func,
};

export default ProgressPercent;
