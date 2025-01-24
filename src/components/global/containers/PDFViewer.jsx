import { useState, useEffect, useCallback } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Material UI
import { Box, TablePagination, CircularProgress } from "@mui/material";

// Servicios
import PublicacionesServices from "@services/PublicacionesServices";

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ url, path, sxPagination = {}, setFile = null, fileType = "application/pdf" }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [pdfBlob, setPdfBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);

  const maxWidth = 1536;

  // Obtener el tamaño actual del contenedor
  const onResize = useCallback((entries) => {
    const entry = entries[0];
    if (entry) setContainerWidth(entry.contentRect.width);
  }, []);

  useEffect(() => {
    if (!containerRef || !("ResizeObserver" in window)) return undefined;

    const observer = new ResizeObserver(onResize);
    observer.observe(containerRef, {});

    return () => observer.disconnect();
  }, [containerRef, onResize]);

  const fetchPdf = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await PublicacionesServices.getPublicFile({ path });
      const { results, response, message } = result;

      if (results) {
        // Convertir base64 a ArrayBuffer
        const binaryString = window.atob(response.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        setPdfBlob(arrayBuffer);

        if (setFile !== null) {
          const blob = new Blob([arrayBuffer], { type: fileType });
          const url = URL.createObjectURL(blob);
          setFile(url);
        }
      } else throw new Error(message);
    } catch (error) {
      setPdfBlob("ERROR");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!url) fetchPdf();
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (e, newPage) => setPage(newPage);

  const handleChangePageSize = (e) => {
    setPage(0);
    setPageSize(parseInt(e.target.value, 10));
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setIsSuccess(true);
    setTotal(numPages);
  };

  const onDocumentLoadError = () => setIsSuccess(false);

  // Calcular el rango de números de página a mostrar
  const startPage = page * pageSize + 1;
  const endPage = Math.min((page + 1) * pageSize, total);
  const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  if ((!pdfBlob || isLoading) && !url) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 3, mb: 5 }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error && !url) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 3, mb: 5 }}>
        Ocurrió un inconveniente al cargar el archivo
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", overflow: "auto" }} ref={setContainerRef}>
      <TablePagination
        sx={{ width: "100%", display: "flex", justifyContent: "flex-end", px: 1, ...sxPagination }}
        component="div"
        page={page}
        rowsPerPage={pageSize}
        count={total}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageSize}
        labelRowsPerPage="Filas:"
      />

      <Document
        file={url ?? pdfBlob}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <Box sx={{ display: "flex", justifyContent: "center", my: 3, mb: 5 }}>
            <CircularProgress size={80} />
          </Box>
        }
        error={
          <Box sx={{ display: "flex", justifyContent: "center", my: 3, mb: 5 }}>
            Ocurrio un inconveniente al cargar el archivo
          </Box>
        }
      >
        {pagesToShow.map((page) => (
          <Page
            key={`page_${page}`}
            pageNumber={page}
            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
          />
        ))}
      </Document>

      {isSuccess && (
        <TablePagination
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end", px: 1, ...sxPagination }}
          component="div"
          page={page}
          rowsPerPage={pageSize}
          count={total}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
          labelRowsPerPage="Filas:"
        />
      )}
    </Box>
  );
};

export default PDFViewer;
