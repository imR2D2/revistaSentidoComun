import { useState, useEffect } from "react";

// Material UI
import { Container, Box, Button, Card, CardContent, Typography, Avatar, IconButton } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { Fade } from "@successtar/react-reveal";

// Componentes
import Curriculum from "@components/team/Curriculum";
import Modal from "@global/modal/Modal";

// Carrusel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Data
import teamData from "@data/constants/team";

// Flecha personalizada
const Arrow = ({ onClick = () => {}, next = false, prev = false }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        color: "black",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        right: next ? "0px" : undefined,
        left: prev ? "0px" : undefined,
      }}
    >
      <ArrowForwardIos sx={{ transform: prev ? "rotate(180deg)" : "" }} />
    </IconButton>
  );
};

const Team = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState({});

  const clickItem = (item) => {
    setCurrent(item);
    setIsOpen(true);
  };

  // Función para dividir el equipo en subgrupos
  const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    nextArrow: <Arrow next />,
    prevArrow: <Arrow prev />,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 3, autoplay: true } },
      { breakpoint: 700, settings: { slidesToShow: 2, autoplay: false } },
      { breakpoint: 550, settings: { slidesToShow: 1, autoplay: false } },
    ],
  };

  // Dividir los datos del equipo en subgrupos
  const chunkedTeamData = chunkArray(teamData, 2);

  // Función para calcular la altura máxima
  const adjustHeight = () => {
    const slickSlides = document.querySelectorAll(".slick-slide > div");
    if (!slickSlides.length) return;

    slickSlides.forEach((div) => (div.style.height = ""));

    const slickList = document.querySelector(".slick-list");
    if (!slickList) return;
    const maxHeight = slickList.offsetHeight;

    slickSlides.forEach((div) => {
      if (div.offsetHeight !== maxHeight) div.style.height = `${maxHeight}px`;
    });
  };

  useEffect(() => {
    adjustHeight();
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container id="Team" component="section" maxWidth="xl" sx={{ px: { xs: 1 }, py: 4 }}>
      <Fade duration={3000}>
        <>
          <Box sx={{ textAlign: "center", mb: 4, px: 3 }}>
            <Typography variant="h4" component="h2">
              Nuestro equipo
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Conoce a las personas detrás del proyecto
            </Typography>
          </Box>

          <Slider {...settings}>
            {chunkedTeamData.map((teamChunk, chunkIndex) => (
              <Box
                key={chunkIndex}
                sx={{
                  display: "flex !important",
                  flexDirection: "column",
                  gap: 2,
                  py: 2,
                  px: 1,
                  height: "100%",
                }}
              >
                {teamChunk.map((member, memberIndex) => (
                  <Button
                    key={memberIndex}
                    sx={{
                      flex: 1,
                      p: 0,
                      borderRadius: 5,
                      textTransform: "none",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.08)",
                        "& .MuiAvatar-root": { transform: "scale(1.2)" },
                      },
                    }}
                    onClick={() => clickItem(member)}
                  >
                    <Card
                      sx={{
                        maxWidth: 300,
                        width: "100%",
                        height: "100%",
                        mx: "auto",
                        borderRadius: 5,
                        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Avatar
                          src={member.image}
                          alt={`${member.name} ${member.lastname}`}
                          sx={{ width: 100, height: 100, transition: "transform 0.3s ease-in-out" }}
                        />
                      </Box>

                      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <Typography gutterBottom variant="h6" component="div" align="center">
                          {member.name} {member.lastname}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" align="center">
                          {member.workstation.join(" / ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Button>
                ))}
              </Box>
            ))}
          </Slider>

          <Modal maxWidth="md" open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
            <Curriculum user={current} />
          </Modal>
        </>
      </Fade>
    </Container>
  );
};

export default Team;
