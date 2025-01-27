import { useEffect, useState } from "react";

// Material UI
import { TextField, Grid, Divider, Typography, Button, FormHelperText, Box, Icon } from "@mui/material";
import { Email, Facebook, X, Instagram, YouTube, Telegram, Language, Reddit } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { DatePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from "date-fns/locale/es";

// Components
import AdvancedSelect from "@components/global/selects/AdvancedSelect";
import UploadSingleFile from "@components/global/files/UploadSingleFile";
import RichTextEditor from "@components/global/containers/RichTextEditor";
import CustomModal from "@components/global/modal/Modal";

// Constants
import { AuthorsSelect, socialNetworksSelect, placeHoldersNetworks } from "@data/constants/academia";

// Schemas - Interfaces
import { useFormik } from "formik";
import { FormAcademia, socialNetworks } from "@data/schemas/academiaSchema";
import { formAcademiaInterface, socialNetworksInterface } from "@data/interfaces/academiaInterface";

const RegisterFormAcademia = (props) => {
  const { onClose, modalOpen, params = {}, title, setData } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [social, setSocial] = useState(null)
  const today = new Date();

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

  const formik = useFormik({
    initialValues: formAcademiaInterface,
    validationSchema: FormAcademia,
    enableReinitialize: false,
    onSubmit: async (values, actions) => {
      setIsSubmitting(true);
      console.log(values, 'values')
      try {
        await setData(values);
        actions.resetForm();
        onClose(false);
      } catch (error) {
        console.error("Error al registrar datos:", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetParams = () => {
    formik.resetForm();
    onClose(false);
  };

  const handleEditModalClose = () => {
    onClose(false);
  };

  const handleInputChange = (fieldName) => (e) => {
    const { value } = e.target;
    formik.setValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleTitle = handleInputChange("Title")
  const handleFullName = handleInputChange("FullName");
  const handleShortDescription = handleInputChange("ShortDescription");
  const handleUbicacion = handleInputChange("Ubicacion");
  const handleLink = handleInputChange("Link");

  const handleFiles = (e, fieldName) => {
    formik.setValues((prev) => ({
      ...prev,
      [fieldName]: [{ file: e }],
    }));
  };

  useEffect(() => {
    if (Object.keys(params).length > 0) {
      formik.setValues({
        idUnico: params.id || "",
        NombreCompleto: params.fullName || "",
        ShortDescription: params.shortDescription,
        Ubicacion: params.location,
        Files: [{ file: params.imageFile }],
        Date: params.date,
        IdResponsabilidad: params.idResponsabilidad,
        Title: params.title,
        TitleURL: params.titleURL,
        FullName: params.fullName,
        Link: params.link,
        Contenido: params.content,
        EducationHistory: params.educationHistory
      });
    }
    // eslint-disable-next-line
  }, [params]);

  const addSocialNetwork = (newEducation) => {
    const newData = [...formik.values.EducationHistory, newEducation];
    formik.setFieldValue("EducationHistory", newData, true);
    formikEducation.resetForm();
    setSocial(null);  // Reiniciar el estado del icono social de textfield
  };

  const removeSocialNetwork = (index) => {
    const updated = formik.values.EducationHistory.filter((_, i) => i !== index);
    formik.setFieldValue("EducationHistory", updated);
  };

  const formikEducation = useFormik({
    initialValues: socialNetworksInterface,
    validationSchema: socialNetworks,
    onSubmit: (values) => {
      addSocialNetwork(values)
    },
  });

  return (
    <CustomModal
      open={modalOpen}
      onClose={handleEditModalClose}
      title={title}
      maxWidth="xl"
    >
      <Divider sx={{ mt: -2 }} />
      <Grid container spacing={1} sx={{ mt: 1 }}>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <TextField
            id="Title"
            variant="outlined"
            label="Título"
            size="small"
            sx={{ width: "100%", mt: 1 }}
            value={formik.values.Title}
            onChange={handleTitle}
            onBlur={formik.handleBlur}
            error={formik.touched.Title && Boolean(formik.errors.Title)}
            helperText={formik.touched.Title && formik.errors.Title}
          />

        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <AdvancedSelect
            name="IdResponsabilidad"
            label="Autor"
            options={AuthorsSelect}
            value={formik.values.IdResponsabilidad}
            error={formik.touched.IdResponsabilidad && formik.errors.IdResponsabilidad}
            helperText={formik.touched.IdResponsabilidad && formik.errors.IdResponsabilidad}
            onChange={(e) => {
              const value = e.value;
              formik.setFieldValue("IdResponsabilidad", value);
              if (value !== 0) {
                formik.setFieldValue("FullName", "");
              }
            }}
            size="small"
            sx={{ mt: 1 }}
            fullWidth
          />
        </Grid>

        {formik.values.IdResponsabilidad === 0 && (
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <TextField
              id="FullName"
              variant="outlined"
              label="Nombre Completo"
              size="small"
              sx={{ width: "100%", mt: 1 }}
              value={formik.values.FullName}
              onChange={handleFullName}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.FullName && formik.errors.FullName)}
              helperText={formik.touched.FullName && formik.errors.FullName}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            id="ShortDescription"
            variant="outlined"
            label="Descripción Corta"
            size="small"
            sx={{ width: "100%", mt: 1 }}
            value={formik.values.ShortDescription}
            onChange={handleShortDescription}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.ShortDescription && formik.errors.ShortDescription)}
            helperText={formik.touched.ShortDescription && formik.errors.ShortDescription}
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <TextField
            id="ubicacion"
            variant="outlined"
            label="Ubicacion del Acontecimiento"
            placeholder="Durango, dgo"
            size="small"
            sx={{ width: "100%", mt: 1 }}
            value={formik.values.Ubicacion}
            onChange={handleUbicacion}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.Ubicacion && formik.errors.Ubicacion)}
            helperText={formik.touched.Ubicacion && formik.errors.Ubicacion}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <TextField
            id="link"
            variant="outlined"
            label="Link Página Externa (si aplica)"
            size="small"
            sx={{ width: "100%", mt: 1 }}
            value={formik.values.Link}
            onChange={handleLink}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.Link && formik.errors.Link)}
            helperText={formik.touched.Link && formik.errors.Link}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} >
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
            <DatePicker
              containerStyle={{ width: '100%' }}
              label="Fecha de Acontecimiento"
              onChange={(date) => formik.setFieldValue('Date', date)}
              value={formik.values.Date}
              maxDate={today}
              renderInput={(params) => (
                <TextField
                  error={formik.touched.Date && formik.errors.Date}
                  helperText={formik.touched.Date && formik.errors.Date}
                  size="large"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>

          <FormHelperText id="DatePicker" error={Boolean(formik.touched.Date && formik.errors.Date)}>
            {formik.touched.Date && formik.errors?.Date}
          </FormHelperText>
        </Grid>


        <Grid xs={12} lg={12} sx={{ p: { xs: 1, md: 10 } }}>
          <RichTextEditor
            value={formik.values.Contenido}
            onChange={(value) => formik.setFieldValue("Contenido", value)}
            placeholder="Escribe aquí..."
          />

          <FormHelperText id="RichTextEditor" error={Boolean(formik.touched.Contenido && formik.errors.Contenido)}>
            {formik.touched.Contenido && formik.errors?.Contenido}
          </FormHelperText>
        </Grid>

        <Grid container spacing={2} mt={2} justifyContent="center">
          <Grid item xs={8}>
            <UploadSingleFile
              file={formik.values.Files && formik.values.Files.length > 0 ? formik.values.Files[0].file : params.imagePath}
              setFile={(e) => handleFiles(e, "Files")}
              fileType="image"
              accept="image/*"
            />

            <FormHelperText id="RichTextEditor" error={Boolean(formik.touched.files && formik.errors.files)}>
              {formik.touched.Files && formik.errors?.Files && formik.errors.Files[0]?.file}
            </FormHelperText>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2} justifyContent="center">
          <Grid item xs={8}>
            <UploadSingleFile
              file={formik.values.FilesPdf && formik.values.FilesPdf.length > 0 ? formik.values.FilesPdf[0].file : params.imagePath}
              setFile={(e) => handleFiles(e, "FilesPdf")}
              fileType="pdf"
              accept="application/pdf"
            />

            <FormHelperText id="RichTextEditor" error={Boolean(formik.touched.files && formik.errors.files)}>
              {formik.touched.Files && formik.errors?.Files && formik.errors.Files[0]?.file}
            </FormHelperText>
          </Grid>
        </Grid>

        <LocalDivider title="Redes Sociales" />

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {/* Nombre de la red social */}
            <Grid item xs={12} md={6}>
              <AdvancedSelect
                size="small"
                label="Red Social"
                name="SocialNetworksType"
                options={socialNetworksSelect}
                value={formikEducation.values.SocialNetworksType}
                onChange={(e) => {
                  formikEducation.setFieldValue("SocialNetworksType", e.value)
                  setSocial(e.value)
                  formikEducation.setFieldValue("SocialNetworksLink", "");
                }
                }
                error={formikEducation.touched.SocialNetworksType && Boolean(formikEducation.errors.SocialNetworksType)}
                helperText={formikEducation.touched.SocialNetworksType && formikEducation.errors.SocialNetworksType}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Link de la Red Social"
                placeholder={placeHoldersNetworks[social] || null}
                name="SocialNetworksLink"
                value={formikEducation.values.SocialNetworksLink}
                onChange={formikEducation.handleChange}
                error={formikEducation.touched.SocialNetworksLink && Boolean(formikEducation.errors.SocialNetworksLink)}
                helperText={formikEducation.touched.SocialNetworksLink && formikEducation.errors.SocialNetworksLink}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: '8px', mt: 1 }}>
                      {socialIcons[social] || null}
                    </Box>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button color="primary" variant="outlined" fullWidth onClick={formikEducation.handleSubmit}>
                Agregar Red Social
              </Button>
            </Grid>

            {formik?.values?.EducationHistory?.map((item, index) => (
              <Grid item xs={12} lg={6} key={index} display="flex" gap={2}>
                {/* Botón para eliminar la entrada */}
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => removeSocialNetwork(index)}
                  sx={{ width: 'auto', minWidth: '30px', padding: '8px' }}

                >
                  <Icon>delete</Icon>
                </Button>

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold" fontSize={16}>
                    {socialIcons[item.SocialNetworksType]}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" fontSize={16}>
                    {item.SocialNetworksLink}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" size="small" onClick={resetParams} style={{ backgroundColor: red[600], color: "#fff" }}>
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" size="small" onClick={formik.submitForm} disabled={isSubmitting}>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal >
  );
};

const LocalDivider = ({ title = "", disabledDivider = false }) => (
  <Grid item xs={12}>
    {!disabledDivider && (
      <Divider
        sx={{
          borderStyle: "none",
          height: "2px",
          background:
            "repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12) 10px, transparent 10px, transparent 20px)",
          my: 3,
        }}
      />
    )}
    <Typography variant="h5" component="h2" align="center" mb={1}>
      {title}
    </Typography>
  </Grid>
);

export default RegisterFormAcademia;