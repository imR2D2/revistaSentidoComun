// Material UI
import { Typography, Box, Grid, Link, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Fade } from "@successtar/react-reveal";

// Images
import Logo_C27_Text_Dark from "@assets/logo/Logo_C27_Text_Dark.webp";
import Logo_C27 from "@assets/logo/Logo_C27.png";

// Utils
import { scrollToElement } from "@utils/utilities";

const Home = () => {
  return (
    <Box
      id="Inicio"
      component="section"
      sx={{ minHeight: "100vh", p: { xs: 4, sm: 5 }, pt: { xs: 12, sm: 20 }, backgroundColor: grey[300] }}
    >

    </Box>
  );
};

export default Home;
