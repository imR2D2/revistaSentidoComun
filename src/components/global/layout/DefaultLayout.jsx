// Material UI
import { Box } from "@mui/material";
import { grey } from '@mui/material/colors';

const DefaultLayout = (props) => {
  const { children, sx, disablePadding = false, centerItems = false } = props;

  const padding = disablePadding ? {} : { p: 1.5, pt: 19, pl: 2 };
  const center = centerItems
    ? { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }
    : {};
  return (
    <Box component="section" sx={{ ...padding, ...center, ...sx, backgroundColor: grey[300] }}>
      {children}
    </Box>
  );
};

export default DefaultLayout;
