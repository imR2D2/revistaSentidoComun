import { useState, useEffect } from "react";

// Material UI
import { Box, Card, Grid, IconButton, Icon } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { format } from 'date-fns';

// Alerts
import Swal from "sweetalert2";

// Components
import CustomTable from "@components/global/tables/BasicTable";
import RegisterFormAcademia from "@components/academia/RegisterFormAcademia";
import { showSnackbar } from '@global/alerts/CustomSnack';

// Helpers Firebase
import { getData, updateDataInFirebase, deleteDataInFirebase } from '@utils/firebase/firebaseHelpers';

// Utilities
import { generarURL } from "@utils/utilities";

// Constants
import { AuthorsSelect, postColumnsTable } from "@data/constants/academia";

const TableAcademia = (props) => {
  const { setIsLoading, refresh } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page] = useState(0);
  const [pageSize] = useState(50);
  const [openModal, setOpenModal] = useState(false);
  const [params, setParams] = useState({});

  const WhiteTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "#000",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      fontSize: 14,
    },
    [`& img:hover`]: {
      transform: "scale(1.1)",
      transition: "transform 0.3s ease-in-out",
    },
  });

  const handleEditClick = (value) => {
    const modifiedDate = new Date(value.date.seconds * 1000);
    const params = {
      ...value,
      date: modifiedDate
    }
    setParams(params);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUpdateData = async (values) => {
    const File = values?.Files[0]?.file;
    const FullName = values?.FullName;
    const ShortDescription = values?.ShortDescription;
    const Location = values?.Ubicacion;
    const dateString = values?.Date;
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
      setIsLoading(true);
      const response = await updateDataInFirebase(
        values.idUnico,
        File,
        FullName,
        ShortDescription,
        Location,
        Year,
        Month,
        Day,
        Link,
        Responsibility,
        Title,
        TitleURL,
        Content,
        DateValue,
        EducationHistory
      );

      if (response.success) {
        showSnackbar({
          message: "Post actualizado correctamente",
          color: "success",
          variant: "filled",
          vertical: "top",
          horizontal: "center",
        });
        setOpenModal(false);
        await ApiResponse();
      } else {
        showSnackbar({
          message: "No se pudo actualizar el post, intente de nuevo.",
          color: "error",
          variant: "filled",
          vertical: "top",
          horizontal: "center",
        });
      }
    } catch (error) {
      showSnackbar({
        message: "Error al actualizar el post.",
        color: "error",
        variant: "filled",
        vertical: "top",
        horizontal: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResponsableName = (idResponsabilidad) => {
    const option = AuthorsSelect.find(option => option?.value === idResponsabilidad);
    return option ? option?.label : "Sin responsable";
  };

  const ApiResponse = async () => {
    try {
      setLoading(true);
      const response = await getData();

      if (response.success) {
        const mappedData = response.data.map((item) => {
          // Formatea la fecha aquí
          const date = new Date(item.date.seconds * 1000);
          const formattedDate = format(date, 'yyyy-MM-dd');

          // Aquí, obtener el nombre del responsable
          const responsableName = item.fullName ? item.fullName : getResponsableName(item.idResponsabilidad);

          return {
            ...item,
            date: formattedDate,
            fullName: responsableName,
            action: (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton aria-label="edit" color="success" onClick={() => handleEditClick(item)}>
                  <Icon>edit</Icon>
                </IconButton>
                <IconButton aria-label="delete" color="error" onClick={() => deleteConfirmation(item)}>
                  <Icon>delete</Icon>
                </IconButton>
              </Box>
            ),
            imageFileHover: (
              <WhiteTooltip
                title={<img src={item.imageFile} style={{ maxWidth: 200, maxHeight: 200 }} />}
                placement="right"
              >
                <a href={item.imageFile} target="_blank" rel="noopener noreferrer">
                  {item.imageFile}
                </a>
              </WhiteTooltip>
            ),
          };
        });

        setData(mappedData);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {

      showSnackbar({
        message: "Error al importar los posts.",
        color: "error",
        variant: "filled",
        vertical: "top",
        horizontal: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteConfirmation = (item) => {
    Swal.fire({
      title: `¿Deseas eliminar el post "${item.title}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        const response = await deleteDataInFirebase(item.id);
        if (response.success) {
          showSnackbar({
            message: "Post eliminado correctamente",
            color: "success",
            variant: "filled",
            vertical: "top",
            horizontal: "center",
          });
          setIsLoading(false);

          await ApiResponse();
        } else {
          showSnackbar({
            message: "No se pudo eliminar el post, intente de nuevo.",
            color: "error",
            variant: "filled",
            vertical: "top",
            horizontal: "center",
          });
        }
      }
    });
  };

  useEffect(() => {
    ApiResponse();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <Box component={Card} variant="outlined" borderRadius={2} padding={2} minHeight={100} elevation={0}>
      <Grid container>
        <Grid item xs={12}>
          <CustomTable
            rows={data}
            columns={postColumnsTable}
            total={data.length}
            page={page}
            pageSize={pageSize}
            stickyHeader={true}
            isLoading={loading}
            maxHeight={600}
            disableCardType
          />
        </Grid>
      </Grid>
      {openModal && <RegisterFormAcademia onClose={handleCloseModal} setModalOpen={setOpenModal} title={"EDITAR POST"} modalOpen={openModal} params={params} setData={handleUpdateData} />}
    </Box>
  );
};

export default TableAcademia;
