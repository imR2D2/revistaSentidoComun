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
import { ArrowBack, ArrowForward, Download as DownloadIcon } from "@mui/icons-material";

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
import useWindowDimensions from '@hooks/useWindowDimensions';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref} >
      <p>{props.children}</p>
    </div>
  );
});

Pages.displayName = 'Pages';

const TemplateAcademia = () => {
  const { width } = useWindowDimensions();
  console.log(width)

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
      console.log(result)
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

  const [pdfData, setPdfData] = useState(null);


  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(noticia.pdfFile);
        const blob = await response.blob();
        setPdfData(blob);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, [noticia]);

  const { day, month, year, title, content, fullName, imageFile, location, idResponsabilidad } = noticia;

  const getResponsableName = (idResponsabilidad) => {
    const option = AuthorsSelect.find(option => option.value === idResponsabilidad);
    return option ? option.label : "Sin responsable";
  };

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = noticia.pdfFile;
    link.download = "revista.pdf";
    link.click();
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <Icon>arrow_back</Icon>
          </IconButton>
        </Box>

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
                mt: 20,
                width: { xs: '90%', md: '70%' },
                margin: '0 auto'
              }}
            >
              <Typography sx={{ fontSize: { xs: 16, md: 18, fontWeight: 600, color: "#da3e3e" }, textAlign: 'center', width: '100%' }}>
                Revista
              </Typography>

              <Typography sx={{ fontSize: { xs: 30, md: 60, fontWeight: 700 }, textAlign: 'center', width: '100%' }}>
                {title}
              </Typography>



              <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {
                  fullName || idResponsabilidad &&
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'inline' }}>
                    <strong>Por: </strong>
                    {
                      idResponsabilidad === 1 ? (
                        <a
                          href="https://www.youtube.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'black',
                            textDecoration: 'none'
                          }}
                          onMouseOver={(e) => e.target.style.color = 'green'}
                          onMouseOut={(e) => e.target.style.color = 'black'}
                        >
                          {fullName || getResponsableName(idResponsabilidad) || "Sin Autor"}
                        </a>
                      ) : (
                        fullName || getResponsableName(idResponsabilidad) || "Sin Autor"
                      )
                    }
                  </Typography>
                }
                {
                  day && month && year &&
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'inline' }}>
                    <strong>Fecha: </strong>
                    {`${day}/${month}/${year}`}
                  </Typography>
                }
                {
                  location &&
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Lugar de Emisión: </strong>
                    {location}
                  </Typography>
                }
              </Box>
            </Box>

            <Box>
              <Divider
                sx={{
                  height: 3,
                  background: "linear-gradient(to right, transparent, rgb(236, 238, 240), transparent)",
                  border: "none",
                  my: 3
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                <HTMLFlipBook width={width > 500 ? 400 : 200} height={width > 500 ? 600 : 300}>
                  {
                    [...Array(numPages).keys()].map((pNum) => (
                      <Pages key={pNum} number={pNum + 1}>
                        <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
                          <Page pageNumber={pNum + 1} width={width > 500 ? 400 : 200} renderAnnotationLayer={false} renderTextLayer={false} />
                        </Document>
                      </Pages>
                    ))
                  }
                </HTMLFlipBook>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IconButton onClick={handlePrevPage}>
                  <ArrowBack />
                </IconButton>

                <IconButton onClick={handleDownloadPDF}>
                  <DownloadIcon />
                </IconButton>

                <IconButton onClick={handleNextPage}>
                  <ArrowForward />
                </IconButton>
              </Box>

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
