import { useEffect, useState } from "react";

//MUI
import {
  Box,
  Collapse,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

const FilterCollapse = ({
  children,
  expand,
  effect,
}) => {
  //States
  const [checked, setChecked] = useState(expand ? expand : false);

  useEffect(() => {
    setChecked(expand ? expand : false);
    //eslint-disable-next-line
  }, [effect]);

  //Functions and Handlers
  const handleChecked = () => {
    setChecked((prevState) => !prevState);
  };

  return (
    <>
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="right"
        flexWrap="wrap"
        ml={2}
      >
        <Box display="flex" gap={1} alignItems="center">
          <IconButton
            onClick={handleChecked}
            sx={{
              width: "32px",
              height: "32px",
              backgroundColor: checked ? "none" : "rgba(0, 0, 0, 0.04)",
              border: checked ? "1px solid #0041a0" : "none",
              borderRadius: "20%",
            }}
          >
            <Icon sx={{ color: checked && "#0041a0" }}>
              {checked
                ? "keyboard_double_arrow_up"
                : "keyboard_double_arrow_down"}
            </Icon>
          </IconButton>

          <Typography
            variant="subtitle2"
            fontWeight={700}
            color={checked && "#0041a0"}
          >
            FILTROS
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />
      </Stack>

      {checked && (
        <Box marginTop={"1rem"}>
          <Collapse in={checked}>
            <div>{children}</div>
          </Collapse>
        </Box>
      )}
    </>
  );
};

export default FilterCollapse;
