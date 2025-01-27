import { useState } from 'react';

// Material UI
import { Grid, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";

// Components
import { showSnackbar } from '@global/alerts/CustomSnack';
import LoadingForm from "@components/global/progress/LoadingForm";
import TableAcademia from "@components/academia/TableAcademia";
import RegisterFormAcademia from "@components/academia/RegisterFormAcademia";

// Utils - Assets
import { generarURL } from "@utils/utilities";

// Helpers Firebase
import { uploadDataToFirebase } from '@utils/firebase/firebaseHelpers';

const RegisterAcademia = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshApi, setRefreshApi] = useState(false);

  const handleInsertData = async (values) => {
    const File = values?.Files[0]?.file;
    const FilePdf = values?.FilesPdf[0]?.file;
    const FullName = values?.FullName;
    const ShortDescription = values?.ShortDescription;
    const Location = values?.Ubicacion;
    const dateString = values?.date;
    const Link = values?.Link;
    const Responsibility = values?.IdResponsabilidad
    const Title = values?.Title
    const TitleURL = generarURL(values?.Title)
    const Content = values?.Contenido
    const DateValue = values?.Date
    const date = new Date(dateString);
    const Year = date.getFullYear();
    const Month = date.getMonth() + 1;
    const Day = date.getDate();
    const EducationHistory = values?.EducationHistory
    try {
      const result = await uploadDataToFirebase(File, FilePdf, FullName, ShortDescription, Location, Year, Month, Day, Link, Responsibility, Title, TitleURL, Content, DateValue, EducationHistory);

      if (result.success) {
        showSnackbar({
          message: "Post creado correctamente",
          color: "success",
          variant: "filled",
          vertical: "top",
          horizontal: "center",
        });
        setRefreshApi(prevState => !prevState);
        setOpenModal(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      showSnackbar({
        message: "No se pudo crear el post, intente de nuevo.",
        color: "error",
        variant: "filled",
        vertical: "top",
        horizontal: "center",
      });
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 10 }}>
      <Button variant="contained" size="small" endIcon={<Add />} sx={{ mb: 4 }} onClick={() => setOpenModal(true)}>
        Agregar Nuevo
      </Button>
      <LoadingForm isLoading={loading} isOpen={loading} setIsOpen={() => setLoading(!loading)} loadinMessage={"Cargando..."} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableAcademia setIsLoading={(e) => setLoading(e)} refresh={refreshApi} />
        </Grid>
      </Grid>
      {openModal && <RegisterFormAcademia onClose={setOpenModal} modalOpen={openModal} title={"Registrar nuevo post"} setData={handleInsertData} />}
    </Container>
  );
};

export default RegisterAcademia;
