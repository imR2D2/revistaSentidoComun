import { isString } from "lodash";
import { useDropzone } from "react-dropzone";
import UploadImage from "@assets/img/ic_img.svg";
import UploadPdf from "@assets/img/ic_pdf.svg";

// material
import { Box, Typography, styled } from "@mui/material";

// ----------------------------------------------------------------------
const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  display: "flex",
  overflow: "hidden",
  textAlign: "center",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5, 0),
  borderRadius: 6,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.grey[50],
  border: `1px dashed ${theme.palette.grey[400]}`,
  "&:hover": {
    opacity: 0.72,
    cursor: "pointer",
  },
  [theme.breakpoints.up("md")]: { textAlign: "left", flexDirection: "row" },
}));

// ----------------------------------------------------------------------

const UploadSingleFile = ({ file, setFile, fileType, sx, ...other }) => {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      multiple: false,
      onDrop,
      accept: fileType === "pdf" ? "application/pdf" : "image/*",  // Aquí controlas el tipo de archivo
      ...other,
    });

  // Define los íconos según el tipo de archivo
  const fileIcon = fileType === "pdf" ? UploadPdf : UploadImage;

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...(isDragReject && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && { padding: "12% 0" }), //12% padding: "12% 0"
        }}
      >
        <input {...getInputProps()} />

        <Box
          component="img"
          alt="file upload"
          src={fileIcon}
          width={140}
        />

        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            {fileType === "pdf" ? "Arrastre o seleccione un PDF" : "Arrastre o seleccione la imagen"}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Coloque el archivo aquí o haga click en&nbsp;
            <Typography
              variant="body2"
              component="span"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              navegar
            </Typography>
            &nbsp;a través de su máquina
          </Typography>
        </Box>

        {file && (
          <>
            <Box
              component="img"
              alt="file preview"
              src={isString(file) ? file : file.preview}
              sx={{
                top: 8,
                borderRadius: 1,
                position: "absolute",
                width: "calc(100% - 16px)",
                height: "calc(100% - 16px)",
              }}
            />
          </>
        )}
      </DropZoneStyle>
    </Box>
  );
};

export default UploadSingleFile;