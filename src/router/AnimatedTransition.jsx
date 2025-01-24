import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Material UI
import { Box } from "@mui/material";

// Utils
import { scrollToElement } from "@utils/utilities";

const AnimatedTransition = ({ sx, children }) => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(location);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/" && location.hash) {
      const id = location.hash.substring(1); // quitar el #
      scrollToElement(id);
    } else window.scrollTo(0, 0);

    if (prevLocation.pathname !== location.pathname) setPrevLocation(location);
    // eslint-disable-next-line
  }, [location]);

  return (
    <Box
      component="main"
      id="main"
      key={location.pathname}
      sx={{
        opacity: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        animation: `reveal 0.5s ease-in-out`,
        animationFillMode: "forwards",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedTransition;
