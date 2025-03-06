import React, { useState, useEffect, Fragment } from "react";
import { useParams, useLocation } from "react-router-dom";

// Material UI
import {
  Container,
  Box,
  Skeleton,
  Typography,
  Icon,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Button
} from "@mui/material";
import { ArrowBack, ArrowForward, Download as DownloadIcon, ContentCopy as ContentCopyIcon } from "@mui/icons-material";

// Components
import NotFound from "@global/text/NotFound";
import HtmlText from "@global/text/HtmlText";
import "@global/text/htmlText.css";

// Utils - Assets
import { showRandom, getArray } from "@utils/utilities";
import { isEmptyOrNullObject } from "@utils/validations";

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

  const { titleURL } = useParams();
  const locations = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [noticia, setNoticia] = useState({});
  const [open, setOpen] = useState(false);

  // const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [numPages, setNumPages] = useState();

  const getNew = async () => {
    try {
      setIsLoading(true);
      const result = await getDataByTitleAndId(titleURL, locations?.state?.id);
      if (result.success) {
        setNoticia(result.data[0]);
      } else {
        setNoticia({});
      }
    } catch (e) {
      setNoticia({});
    } finally {
      setIsLoading(false);
    }
  };

  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    getNew();
    // eslint-disable-next-line
  }, []);

  const { day, month, year, title, content, fullName, location, idResponsabilidad } = noticia;

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


  const getResponsableName = (idResponsabilidad) => {
    const option = AuthorsSelect.find(option => option.value === idResponsabilidad);
    return option ? option.label : "Sin responsable";
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // const handleNextPage = () => {
  //   if (currentPage < numPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  const handleDownloadPDF = () => {
    if (noticia.pdfFile) {
      window.open(noticia.pdfFile, '_blank');
    } else {
      console.error("No se encontró el archivo PDF.");
    }
  };

  const text = `https://consentidocomun.mx/wp-content/uploads/revista-digital/build/${titleURL}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setOpen(true)
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <IconButton onClick={() => window.location.href = 'https://consentidocomun.mx/revista-digital/'}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(228, 228, 228, 0.49)",
              borderRadius: "10px",
              padding: "8px 12px",
              maxWidth: "100%",
              overflow: "hidden",
              width: "65%",
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "rgb(0,90,91)",
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {text}
            </Typography>
            <IconButton
              onClick={handleCopy}
              sx={{
                backgroundColor: "rgb(0,90,91)",
                color: "white",
                borderRadius: "8px",
                marginLeft: "8px",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "rgb(3, 59, 60)" },
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
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
              <Typography sx={{ fontSize: { xs: 30, md: 60, fontWeight: 700 }, textAlign: 'center', width: '100%' }}>
                {title}
              </Typography>

              <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                {
                  fullName || idResponsabilidad &&
                  <Typography color="text.secondary" gutterBottom sx={{ display: 'inline', fontSize: 16, fontWeight: 500 }}>
                    <strong style={{ fontSize: 16, fontWeight: 'bold', color: 'rgb(0,90,91)' }}>Por: </strong>
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
                  <Typography color="text.secondary" gutterBottom sx={{ display: 'inline', fontSize: 16, fontWeight: 500 }}>
                    <strong style={{ fontSize: 16, fontWeight: 'bold', color: 'rgb(0,90,91)' }}>Fecha: </strong>
                    {`${day}/${month}/${year}`}
                  </Typography>
                }
                {
                  location &&
                  <Typography color="text.secondary" gutterBottom sx={{ display: 'inline', fontSize: 16, fontWeight: 500 }}>
                    <strong style={{ fontSize: 16, fontWeight: 'bold', color: 'rgb(0,90,91)' }}>Lugar de Emisión: </strong>
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
              <Box sx={{ overflow: "hidden", width: "100%", display: "flex", justifyContent: "center" }}>
                <HTMLFlipBook
                  width={width > 500 ? 500 : 320}
                  height={width > 500 ? 700 : 500}
                  size={"fixed"}
                >
                  {
                    [...Array(numPages).keys()].map((pNum) => (
                      <Pages key={pNum} number={pNum + 1}>
                        <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
                          <Page pageNumber={pNum + 1} width={width > 500 ? 500 : 320} height={width > 500 ? 700 : 400} renderAnnotationLayer={false} renderTextLayer={false} />
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
                <Button
                  onClick={handleDownloadPDF}
                  sx={{
                    backgroundColor: "rgb(0,90,91)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textTransform: "none",
                    transition: "background-color 0.3s ease",
                    "&:hover": { backgroundColor: "rgb(3, 59, 60)" },
                  }}
                  endIcon={<DownloadIcon />}
                >
                  Descargar PDF
                </Button>
              </Box>


              <Box sx={{ my: { xs: 5, md: 10 } }}>
                <HtmlText content={content} />
              </Box>
            </Box>
          </>
        ) : (
          <NotFound subTitle="Intenta con otra noticia." />
        )}
      </Container>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%", backgroundColor: "rgba(107, 154, 155, 0.45)", color: "rgb(0,90,91)", fontWeight: 600 }}>
          ¡Link copiado en el portapapeles!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TemplateAcademia;
