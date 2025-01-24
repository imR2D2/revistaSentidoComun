// Material UI
import { Box } from "@mui/material";
import { Fade } from "@successtar/react-reveal";

// Data
import logos from "@data/constants/sponsors";

const Sponsors = () => (
  <Box
    id="Sponsors"
    component="section"
    sx={{ overflow: "hidden", whiteSpace: "nowrap", display: "flex", py: 5 }}
  >
    <Logos logos={logos} />
    <Logos logos={logos} first={logos.length * 2} />
  </Box>
);

const Logos = ({ logos = [], first = 0 }) => {
  const initialDelay = 400;

  const gap = 8;

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: gap,
        mx: gap / 2,
        my: 4,
        animation: "slide 220s linear infinite",
      }}
    >
      {[...logos, ...logos].map((logo, i) => {
        // Incrementar el delay en 50 para cada logo
        const delay = initialDelay + i * 50;
        return (
          <Fade key={i + first} up delay={delay}>
            <Box
              component="img"
              src={logo}
              alt={`Sponsor ${i + first}`}
              sx={{ height: 40, margin: "0 20px", transition: "transform 0.3s ease, opacity 0.3s ease" }}
            />
          </Fade>
        );
      })}
    </Box>
  );
};

export default Sponsors;
