import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// Material UI
import {
  Container,
  Box,
  Skeleton,
  Card,
  Typography,
  CardMedia,
  Icon,
  Dialog,
  IconButton,
  Divider
} from "@mui/material";
import { CalendarToday as CalendarTodayIcon, Person as PersonIcon, Place as Place } from '@mui/icons-material';
import { Email, Facebook, X, Instagram, YouTube, Telegram, Language, Reddit } from "@mui/icons-material";

// Components
import NotFound from "@global/text/NotFound";
import HtmlText from "@global/text/HtmlText";
import "@global/text/htmlText.css";

// Utils - Assets
import { showRandom, getArray } from "@utils/utilities";
import { isEmptyOrNullObject } from "@utils/validations";
import defaultImage from "@assets/image_example.jpg";

// Helpers Firebase
import { getDataByTitleAndId } from "@utils/firebase/firebaseHelpers";
import { AuthorsSelect } from "@data/constants/academia";

import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import pdf from './ByteBeatJan2024.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const Pages = React.forwardRef((props, ref) => {
  return (
      <div className="demoPage" ref={ref} >
          <p>{props.children}</p>
          <p>Page number: {props.number}</p>
      </div>
  );
});

Pages.displayName = 'Pages';

const TemplateAcademia = () => {
  const { titleURL } = useParams();
  const navigate = useNavigate();
  const locations = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [noticia, setNoticia] = useState({});
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    getNew();
    // eslint-disable-next-line
  }, []);

  const getNew = async () => {
    try {
      setIsLoading(true);
      const result = await getDataByTitleAndId(titleURL, locations?.state?.id);
      if (result.success) {
        setNoticia(result.data[0]);
      } else {
        setNoticia({});
        console.error(result.message);
      }
    } catch (e) {
      setNoticia({});
      console.error("Error fetching noticia:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewImage = ({ imageFile, Titulo }) => {
    setPost({ imageFile, Titulo });
    setOpen(true);
  };

  const { day, month, year, title, content, fullName, imageFile, location, educationHistory, idResponsabilidad } = noticia;

  const socialIcons = {
    1: <Language style={{ color: '' }} />,
    2: <Facebook style={{ color: '#3b5998' }} />,
    3: <Instagram style={{ color: '#C13584' }} />,
    4: <Email style={{ color: 'rgba(0, 0, 0, 0.70)' }} />,
    5: <X style={{ color: '#1DA1F2' }} />,
    6: <YouTube style={{ color: '#FF0000' }} />,
    7: <Telegram style={{ color: '#0088CC' }} />,
    8: <Reddit style={{ color: 'rgb(255, 69, 0)' }} />
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  // Filtrar posts por el año y mes seleccionados
  const getResponsableName = (idResponsabilidad) => {
    const option = AuthorsSelect.find(option => option.value === idResponsabilidad);
    return option ? option.label : "Sin responsable";
  };

  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <Icon>arrow_back</Icon>
          </IconButton>
        </Box>

        <HTMLFlipBook width={400} height={570}>
          {
            [...Array(numPages).keys()].map((pNum) => (
              <Pages key={pNum} number={pNum + 1}>
                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pNum} width={400} renderAnnotationLayer={false} renderTextLayer={false} />
                </Document>
                <p>
                  Page {pNum} of {numPages}
                </p>
              </Pages>
            ))
          }
        </HTMLFlipBook>

        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Skeletons para la carga */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton animation="wave" variant="rounded" width="80%" height={60} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton animation="wave" variant="text" width={230} height={24} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton animation="wave" variant="text" width={120} height={24} />
            </Box>

            <Box>
              <Skeleton animation="wave" variant="text" width="100%" height={24} />
              <Skeleton
                animation="wave"
                variant="text"
                width={showRandom() ? (showRandom() ? "25%" : "50%") : showRandom() ? "75%" : "100%"}
                height={24}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Skeleton animation="wave" variant="rounded" width={400} height={400} />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Skeleton animation="wave" variant="text" width={showRandom() ? "80%" : "100%"} height={24} />
              {getArray(20).map((item, index) => (
                <Fragment key={index}>
                  {showRandom() && (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width={showRandom() ? (showRandom() ? "40%" : "60%") : showRandom() ? "80%" : "100%"}
                      height={24}
                    />
                  )}
                </Fragment>
              ))}
            </Box>
          </Box>
        ) : !isEmptyOrNullObject(noticia) ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: 'flex-start',
                gap: 1,
                width: { xs: '90%', md: '70%' },
                margin: '0 auto'
              }}
            >
              <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 60 }, textAlign: 'center', width: '100%' }}>
                {title}
              </Typography>

              {
                day && month && year &&
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <CalendarTodayIcon sx={{ verticalAlign: 'middle', fontSize: 20, mr: 1 }} />
                  <strong>Fecha de Emisión: </strong>
                  {`${day}/${month}/${year}`}
                </Typography>
              }

              {
                location &&
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <Place sx={{ verticalAlign: 'middle', fontSize: 20, mr: 1 }} />
                  <strong>Ubicación de Emisión: </strong>
                  {location}
                </Typography>
              }

              {
                post?.fullName || idResponsabilidad &&
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <PersonIcon sx={{ verticalAlign: 'middle', fontSize: 20, mr: 1 }} />
                  <strong>Persona o Entidad Emisora: </strong>

                  {post?.fullName || getResponsableName(idResponsabilidad) || "Sin Autor"}
                </Typography>
              }

              {
                educationHistory.length > 0 &&
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <Language sx={{ verticalAlign: 'middle', fontSize: 20, mr: 1 }} />
                  <strong>Redes Sociales de Persona o Entidad Emisora: </strong>
                </Typography>
              }
            </Box>

            <Box sx={{ mt: -2 }}>
              {!isLoading && educationHistory.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  {educationHistory.map((item, index) => (
                    <IconButton key={index} onClick={() => handleSocialClick(item.name)}>
                      {socialIcons[item.type] || <Language />}
                    </IconButton>
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'center', width: { xs: '90%', md: '75%' }, margin: '0 auto', mt: 2 }}>
                <Divider sx={{ width: '100%', borderBottomWidth: 2 }} />
              </Box>

              <CardMedia
                component="img"
                height="400"
                width="400"
                image={imageFile}
                alt={fullName}
                onClick={() => (imageFile ? handleViewImage({ imageFile, fullName }) : {})}
                sx={{ cursor: imageFile ? "pointer" : "auto", my: 8, objectFit: "contain" }}
              />
              <HtmlText content={content} sx={{ mt: 2 }} />
            </Box>
          </>
        ) : (
          <NotFound subTitle="Intenta con otra noticia." />
        )}
      </Container>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ style: { backgroundColor: "transparent", borderRadius: "8px" } }}
        disableEscapeKeyDown
      >
        <Card
          elevation={3}
          sx={{
            borderRadius: "8px",
            padding: 0,
            minHeight: "100px",
            overflowY: post?.FileURL ? "auto" : "none",
            "&::-webkit-scrollbar": { width: { xs: "5px", md: "10px" }, left: 0 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: "6px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "rgb(255, 255, 255)" },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "inherit",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#bdbdbd" },
            }}
          >
            <Icon>close</Icon>
          </IconButton>

          {post && <CardMedia component="img" image={imageFile ?? defaultImage} alt={title} />}
        </Card>
      </Dialog>
    </>
  );
};

export default TemplateAcademia;
