import { useState } from "react";
import { Fade } from "@successtar/react-reveal";
import { useFormik } from "formik";

// Material UI
import {
  Container,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Divider,
  Typography,
  Box,
  Icon,
  Link,
} from "@mui/material";
import { Email, Facebook, X, Instagram, YouTube, LinkedIn, GitHub } from "@mui/icons-material";

// Componentes
import AdvancedSelect from "@global/selects/AdvancedSelect";
import { showSnackbar } from "@global/alerts/CustomSnack";

// Utils
import { getStorage, setStorage } from "@utils/global";

// Data
import { formSchema, jobSchema, educationSchema, certificationSchema } from "@schemas/form";
import { formInterface, jobInterface, educationInterface, certificationInterface } from "@interfaces/form";
import { typeCatalog, timeCatalog } from "@data/constants/form";

const MyForm = () => {
  const [workstationInput, setWorkstationInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [jsonData, setJsonData] = useState("");

  const formik = useFormik({
    initialValues: getStorage("form", formInterface),
    validationSchema: formSchema,
    onSubmit: (values) => {
      // Itera sobre el jobsHistory y elimina jobInput
      values.jobsHistory.forEach((job) => delete job.jobInput);

      let formatValues = {
        name: values.name,
        lastname: values.lastname,
        fullname: values.fullname,
        description: values.description,
        workstation: values.workstation,
        social: {
          email: values.social.email,
          facebook: values.social.facebook,
          x: values.social.x,
          instagram: values.social.instagram,
          youtube: values.social.youtube,
          github: values.social.github,
          linkedin: values.social.linkedin,
        },
        skills: values.skills,
        jobsHistory: values.jobsHistory.sort(sortByDate),
        educationHistory: values.educationHistory.sort(sortByDate),
        certificationsHistory: values.certificationsHistory,
      };

      setStorage("form", formatValues);

      // Elimina campos sociales vacios
      Object.keys(formatValues.social).forEach((key) => {
        if (!formatValues.social[key]) delete formatValues.social[key];
      });

      const jsonStr = JSON.stringify(formatValues, null, 2);
      setJsonData(jsonStr);
    },
  });

  const formikJob = useFormik({
    initialValues: jobInterface,
    validationSchema: jobSchema,
    onSubmit: (values) => addJob(values),
  });

  const formikEducation = useFormik({
    initialValues: educationInterface,
    validationSchema: educationSchema,
    onSubmit: (values) => addEducation(values),
  });

  const formikCertification = useFormik({
    initialValues: certificationInterface,
    validationSchema: certificationSchema,
    onSubmit: (values) => addCertification(values),
  });

  // Función de ordenación
  const sortByDate = (a, b) => {
    // Usamos una fecha de fin ficticia muy lejana para los elementos sin `dateEnd`
    const aEnd = a.dateEnd || "9999-12-31";
    const bEnd = b.dateEnd || "9999-12-31";

    // Primero, ordenamos por `dateEnd`
    if (new Date(aEnd) > new Date(bEnd)) return -1;
    else if (new Date(aEnd) < new Date(bEnd)) return 1;
    else {
      // Si `dateEnd` es igual, ordenamos por `dateStart`
      const aStart = a.dateStart || "9999-12-31";
      const bStart = b.dateStart || "9999-12-31";

      if (new Date(aStart) > new Date(bStart)) return -1;
      else if (new Date(aStart) < new Date(bStart)) return 1;
      else return 0; // Si ambos son iguales
    }
  };

  const addWorkstation = (station) => {
    if (station && formik.values.workstation.length < 2) {
      formik.setFieldValue("workstation", [
        ...formik.values.workstation,
        station.charAt(0).toUpperCase() + station.slice(1),
      ]);
    }
  };

  const removeWorkstation = (index) => {
    const updated = formik.values.workstation.filter((_, i) => i !== index);
    formik.setFieldValue("workstation", updated);
  };

  const addSkill = (skill) => {
    if (skill) {
      formik.setFieldValue("skills", [
        ...formik.values.skills,
        skill.charAt(0).toUpperCase() + skill.slice(1),
      ]);
    }
  };

  const removeSkill = (index) => {
    const updated = formik.values.skills.filter((_, i) => i !== index);
    formik.setFieldValue("skills", updated);
  };

  const addJob = (newJob) => {
    const newData = [...formik.values.jobsHistory, newJob].sort(sortByDate);

    formik.setFieldValue("jobsHistory", newData);
    formikJob.resetForm();
  };

  const removeJob = (index) => {
    const updated = formik.values.jobsHistory.filter((_, i) => i !== index);
    formik.setFieldValue("jobsHistory", updated);
  };

  const addJobItem = (job) => {
    if (job) {
      formikJob.setFieldValue("job", [...formikJob.values.job, job.charAt(0).toUpperCase() + job.slice(1)]);
      formikJob.setFieldValue("jobInput", "");
    }
  };

  const removeJobItem = (index) => {
    const updated = formikJob.values.job.filter((_, i) => i !== index);
    formikJob.setFieldValue("job", updated);
  };

  const addEducation = (newEducation) => {
    const newData = [...formik.values.educationHistory, newEducation].sort(sortByDate);

    formik.setFieldValue("educationHistory", newData);
    formikEducation.resetForm();
  };

  const removeEducation = (index) => {
    const updated = formik.values.educationHistory.filter((_, i) => i !== index);
    formik.setFieldValue("educationHistory", updated);
  };

  const addCertification = (newCertification) => {
    const newData = [...formik.values.certificationsHistory, newCertification].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    formik.setFieldValue("certificationsHistory", newData);
    formikCertification.resetForm();
  };

  const removeCertification = (index) => {
    const updated = formik.values.certificationsHistory.filter((_, i) => i !== index);
    formik.setFieldValue("certificationsHistory", updated);
  };

  const socials = (name) => {
    if (!formik.touched?.social || !formik.touched?.social[name]) return {};
    if (!formik.errors?.social || !formik.errors?.social[name]) return {};

    return {
      error: formik.touched.social[name] && Boolean(formik.errors.social[name]),
      helperText: formik.touched.social[name] && formik.errors.social[name],
    };
  };

  const handleCopy = async () => {
    const textArea = document.createElement("textarea");
    textArea.value = jsonData;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      showSnackbar({ message: "¡Texto copiado!", color: "success" });
    } catch (error) {
      showSnackbar({ message: "Error al copiar el texto.", color: "error" });
    }

    document.body.removeChild(textArea);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: "text/plain;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "form_data.txt";
    link.click();

    showSnackbar({ message: "¡Texto descargado!", color: "success" });
  };

  return (
    <Container id="Form" component="section" maxWidth="lg" sx={{ p: { xs: 4 }, pt: { xs: 12 } }}>
      <Fade duration={3000}>
        <Grid container spacing={2}>
          <LocalDivider title="Datos básicos" disabledDivider />

          {/* Nombre */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nombre Favorito"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          {/* Apellido */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastname"
              name="lastname"
              label="Apellido Favorito"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
              helperText={formik.touched.lastname && formik.errors.lastname}
            />
          </Grid>

          {/* Nombre completo */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="fullname"
              name="fullname"
              label="Nombre completo"
              value={formik.values.fullname}
              onChange={formik.handleChange}
              error={formik.touched.fullname && Boolean(formik.errors.fullname)}
              helperText={formik.touched.fullname && formik.errors.fullname}
            />
          </Grid>

          {/* Descripcion */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción profesional"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              error={formik.touched.description && !!formik.errors.description}
              helperText={formik.touched.description && formik.errors.description}
              multiline
              rows={4}
            />
          </Grid>

          <LocalDivider title="Redes Sociales" />

          {/* Redes Sociales */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  type="email"
                  id="social.email"
                  name="social.email"
                  label="Correo Electronico"
                  placeholder="example@gmail.com"
                  value={formik.values.social.email}
                  onChange={formik.handleChange}
                  error={socials("email")?.error}
                  helperText={socials("email")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="social.facebook"
                  name="social.facebook"
                  label="Facebook"
                  placeholder="https://www.facebook.com/user"
                  value={formik.values.social.facebook}
                  onChange={formik.handleChange}
                  error={socials("facebook")?.error}
                  helperText={socials("facebook")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Facebook />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="social.x"
                  name="social.x"
                  label="X"
                  placeholder="https://x.com/user"
                  value={formik.values.social.x}
                  onChange={formik.handleChange}
                  error={socials("x")?.error}
                  helperText={socials("x")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <X />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="social.instagram"
                  name="social.instagram"
                  label="Instagram"
                  placeholder="https://www.instagram.com/user"
                  value={formik.values.social.instagram}
                  onChange={formik.handleChange}
                  error={socials("instagram")?.error}
                  helperText={socials("instagram")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Instagram />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="social.youtube"
                  name="social.youtube"
                  label="YouTube"
                  placeholder="https://www.youtube.com/@user"
                  value={formik.values.social.youtube}
                  onChange={formik.handleChange}
                  error={socials("youtube")?.error}
                  helperText={socials("youtube")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <YouTube />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="social.github"
                  name="social.github"
                  label="GitHub"
                  placeholder="https://github.com/user"
                  value={formik.values.social.github}
                  onChange={formik.handleChange}
                  error={socials("github")?.error}
                  helperText={socials("github")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHub />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="social.linkedin"
                  name="social.linkedin"
                  label="LinkedIn"
                  placeholder="https://www.linkedin.com/in/user"
                  value={formik.values.social.linkedin}
                  onChange={formik.handleChange}
                  error={socials("linkedin")?.error}
                  helperText={socials("linkedin")?.helperText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedIn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <LocalDivider title="Workstation" />

          {/* Workstation */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7} lg={9}>
                <TextField
                  size="small"
                  label="Puestos de trabajo (max 2)"
                  placeholder="Frontend"
                  value={workstationInput}
                  onChange={(e) => setWorkstationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (workstationInput.trim()) {
                        addWorkstation(workstationInput.trim());
                        setWorkstationInput("");
                      }
                    }
                  }}
                  error={
                    formik.touched.name &&
                    Boolean(formik.errors.workstation) &&
                    formik.values.workstation.length < 1
                  }
                  helperText={
                    formik.values.workstation.length < 1
                      ? formik.touched.name && formik.errors.workstation
                      : ""
                  }
                  disabled={formik.values?.workstation?.length === 2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={5} lg={3}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => {
                    if (workstationInput.trim()) {
                      addWorkstation(workstationInput.trim());
                      setWorkstationInput("");
                    }
                  }}
                  disabled={formik.values?.workstation?.length === 2 || workstationInput === ""}
                >
                  Agregar puesto
                </Button>
              </Grid>
              <Grid item xs={12} display="flex" flexWrap="wrap" gap={1}>
                {formik.values.workstation.map((station, index) => (
                  <Chip
                    key={index}
                    label={station}
                    onDelete={() => removeWorkstation(index)}
                    color="primary"
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>

          <LocalDivider title="Skills" />

          {/* Skills */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7} lg={9}>
                <TextField
                  size="small"
                  label="Habilidades"
                  placeholder="Javascript"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (skillInput.trim()) {
                        addSkill(skillInput.trim());
                        setSkillInput("");
                      }
                    }
                  }}
                  error={
                    formik.touched.name && Boolean(formik.errors.skills) && formik.values.skills.length < 1
                  }
                  helperText={
                    formik.values.skills.length < 1 ? formik.touched.name && formik.errors.skills : ""
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={5} lg={3}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => {
                    if (skillInput.trim()) {
                      addSkill(skillInput.trim());
                      setSkillInput("");
                    }
                  }}
                  disabled={skillInput === ""}
                >
                  Agregar habilidad
                </Button>
              </Grid>
              <Grid item xs={12} display="flex" flexWrap="wrap" gap={1}>
                {formik.values.skills.map((station, index) => (
                  <Chip key={index} label={station} onDelete={() => removeSkill(index)} color="success" />
                ))}
              </Grid>
            </Grid>
          </Grid>

          <LocalDivider title="Historial de trabajo" />

          {/* JobsHistory */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Nombre de la empresa */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Nombre de la empresa"
                  placeholder="Código 27"
                  name="name"
                  value={formikJob.values.name}
                  onChange={formikJob.handleChange}
                  error={formikJob.touched.name && Boolean(formikJob.errors.name)}
                  helperText={formikJob.touched.name && formikJob.errors.name}
                  fullWidth
                />
              </Grid>

              {/* Ubicación */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Ubicación de la empresa"
                  placeholder="Durango, México"
                  name="ubication"
                  value={formikJob.values.ubication}
                  onChange={formikJob.handleChange}
                  error={formikJob.touched.ubication && Boolean(formikJob.errors.ubication)}
                  helperText={formikJob.touched.ubication && formikJob.errors.ubication}
                  fullWidth
                />
              </Grid>

              {/* Tipo */}
              <Grid item xs={12} md={6}>
                <AdvancedSelect
                  size="small"
                  label="Tipo de trabajo"
                  name="type"
                  options={typeCatalog}
                  value={formikJob.values.type}
                  onChange={(e) => formikJob.setFieldValue("type", e.value)}
                  error={formikJob.touched.type && Boolean(formikJob.errors.type)}
                  helperText={formikJob.touched.type && formikJob.errors.type}
                  fullWidth
                />
              </Grid>

              {/* Tiempo laboral */}
              <Grid item xs={12} md={6}>
                <AdvancedSelect
                  size="small"
                  label="Tiempo laboral"
                  name="time"
                  options={timeCatalog}
                  value={formikJob.values.time}
                  onChange={(e) => formikJob.setFieldValue("time", e.value)}
                  error={formikJob.touched.time && Boolean(formikJob.errors.time)}
                  helperText={formikJob.touched.time && formikJob.errors.time}
                  fullWidth
                />
              </Grid>

              {/* Fecha de inicio */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Fecha de inicio"
                  type="date"
                  name="dateStart"
                  InputLabelProps={{ shrink: true }}
                  value={formikJob.values.dateStart}
                  onChange={({ target: { value } }) => {
                    formikJob.setFieldValue("dateStart", value);
                    if (formikJob.values.dateEnd && new Date(value) > new Date(formikJob.values.dateEnd)) {
                      formikJob.setFieldValue("dateEnd", "");
                    }
                  }}
                  error={formikJob.touched.dateStart && Boolean(formikJob.errors.dateStart)}
                  helperText={formikJob.touched.dateStart && formikJob.errors.dateStart}
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                  fullWidth
                />
              </Grid>

              {/* Fecha de fin */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Fecha de fin"
                  type="date"
                  name="dateEnd"
                  InputLabelProps={{ shrink: true }}
                  value={formikJob.values.dateEnd}
                  onChange={formikJob.handleChange}
                  error={formikEducation.touched.dateEnd && Boolean(formikEducation.errors.dateEnd)}
                  helperText={
                    formikJob.touched.dateEnd && formikJob.errors.dateEnd
                      ? formikJob.errors.dateEnd
                      : "Si no se selecciona, entonces sigue en proceso"
                  }
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                    min: formikJob.values.dateStart || "",
                  }}
                  disabled={formikJob.values.dateStart === ""}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={7} lg={9}>
                <TextField
                  size="small"
                  label="Habilidades"
                  placeholder="React"
                  name="jobInput"
                  value={formikJob.values.jobInput}
                  onChange={formikJob.handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (formikJob.values.jobInput.trim()) {
                        addJobItem(formikJob.values.jobInput.trim());
                      }
                    }
                  }}
                  error={
                    formikJob.touched.job && Boolean(formikJob.errors.job) && formikJob.values.job.length < 1
                  }
                  helperText={
                    formikJob.values.job.length < 1 ? formikJob.touched.job && formikJob.errors.job : ""
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={5} lg={3}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => {
                    if (formikJob.values.jobInput.trim()) {
                      addJobItem(formikJob.values.jobInput.trim());
                    }
                  }}
                  disabled={formikJob.values.jobInput === ""}
                >
                  Agregar habilidad
                </Button>
              </Grid>
              <Grid item xs={12} display="flex" flexWrap="wrap" gap={1}>
                {formikJob.values.job.map((station, index) => (
                  <Chip key={index} label={station} onDelete={() => removeJobItem(index)} color="warning" />
                ))}
              </Grid>

              <Grid item xs={12}>
                <Button color="primary" variant="outlined" fullWidth onClick={formikJob.handleSubmit}>
                  Agregar trabajo
                </Button>
              </Grid>

              {formik.values.jobsHistory.map((item, index) => (
                <Grid item xs={12} key={index} display="flex" gap={2}>
                  <Button color="error" variant="contained" onClick={() => removeJob(index)}>
                    <Icon>delete</Icon>
                  </Button>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" fontSize={16}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontSize={12} color="rgb(0 0 0/.75)">
                      {item.dateStart} - {item.dateEnd || "Actualidad"}
                    </Typography>
                    <Typography variant="body2" fontSize={13}>
                      {timeCatalog.find((time) => time.value === item.time)?.label}
                    </Typography>
                    <Box display="flex" direction="row" gap={0.6} flexWrap="wrap">
                      <Typography variant="body2" noWrap fontSize={13}>
                        {item.ubication}
                      </Typography>
                      <Typography variant="body2">-</Typography>
                      <Typography variant="body2" noWrap fontSize={13}>
                        {typeCatalog.find((type) => type.value === item.type)?.label}
                      </Typography>
                    </Box>
                    <Box display="flex" direction="row" gap={1} py={1} flexWrap="wrap">
                      {item.job.map((jobTitle, index) => (
                        <Chip key={index} size="small" label={jobTitle} />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <LocalDivider title="Educación" />

          {/* educationHistory */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Nombre de la institución */}
              <Grid item xs={12}>
                <TextField
                  size="small"
                  label="Nombre de la institución"
                  placeholder="Universidad Politécnica de Durango"
                  name="name"
                  value={formikEducation.values.name}
                  onChange={formikEducation.handleChange}
                  error={formikEducation.touched.name && Boolean(formikEducation.errors.name)}
                  helperText={formikEducation.touched.name && formikEducation.errors.name}
                  fullWidth
                />
              </Grid>

              {/* Titulo */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Titulo"
                  placeholder="Ingeniería de software"
                  name="title"
                  value={formikEducation.values.title}
                  onChange={formikEducation.handleChange}
                  error={formikEducation.touched.title && Boolean(formikEducation.errors.title)}
                  helperText={formikEducation.touched.title && formikEducation.errors.title}
                  fullWidth
                />
              </Grid>

              {/* Ubicación */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Ubicación de la institución"
                  placeholder="Durango, México"
                  name="ubication"
                  value={formikEducation.values.ubication}
                  onChange={formikEducation.handleChange}
                  error={formikEducation.touched.ubication && Boolean(formikEducation.errors.ubication)}
                  helperText={formikEducation.touched.ubication && formikEducation.errors.ubication}
                  fullWidth
                />
              </Grid>

              {/* Fecha de inicio */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Fecha de inicio"
                  type="date"
                  name="dateStart"
                  InputLabelProps={{ shrink: true }}
                  value={formikEducation.values.dateStart}
                  onChange={({ target: { value } }) => {
                    formikEducation.setFieldValue("dateStart", value);
                    if (
                      formikEducation.values.dateEnd &&
                      new Date(value) > new Date(formikEducation.values.dateEnd)
                    ) {
                      formikEducation.setFieldValue("dateEnd", "");
                    }
                  }}
                  error={formikEducation.touched.dateStart && Boolean(formikEducation.errors.dateStart)}
                  helperText={formikEducation.touched.dateStart && formikEducation.errors.dateStart}
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                  fullWidth
                />
              </Grid>

              {/* Fecha de fin */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Fecha de fin"
                  type="date"
                  name="dateEnd"
                  InputLabelProps={{ shrink: true }}
                  value={formikEducation.values.dateEnd}
                  onChange={formikEducation.handleChange}
                  error={formikEducation.touched.dateEnd && Boolean(formikEducation.errors.dateEnd)}
                  helperText={
                    formikEducation.touched.dateEnd && formikEducation.errors.dateEnd
                      ? formikEducation.errors.dateEnd
                      : "Si no se selecciona, entonces sigue en proceso"
                  }
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                    min: formikEducation.values.dateStart || "",
                  }}
                  disabled={formikEducation.values.dateStart === ""}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button color="primary" variant="outlined" fullWidth onClick={formikEducation.handleSubmit}>
                  Agregar educación
                </Button>
              </Grid>

              {formik.values.educationHistory.map((item, index) => (
                <Grid item xs={12} key={index} display="flex" gap={2}>
                  <Button color="error" variant="contained" onClick={() => removeEducation(index)}>
                    <Icon>delete</Icon>
                  </Button>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" fontSize={16}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontSize={12} color="rgb(0 0 0/.75)">
                      {item.dateStart} - {item.dateEnd || "Actualidad"}
                    </Typography>
                    <Typography variant="body2" fontSize={13}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" fontSize={13}>
                      {item.ubication}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <LocalDivider title="Certificaciones" />

          {/* certificationsHistory */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Nombre del certificado */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Nombre del certificado"
                  placeholder="Inteligencia Artificial y Machine Learning de AWS"
                  name="name"
                  value={formikCertification.values.name}
                  onChange={formikCertification.handleChange}
                  error={formikCertification.touched.name && Boolean(formikCertification.errors.name)}
                  helperText={formikCertification.touched.name && formikCertification.errors.name}
                  fullWidth
                />
              </Grid>

              {/* Compañia */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Compañia"
                  placeholder="Netec"
                  name="company"
                  value={formikCertification.values.company}
                  onChange={formikCertification.handleChange}
                  error={formikCertification.touched.company && Boolean(formikCertification.errors.company)}
                  helperText={formikCertification.touched.company && formikCertification.errors.company}
                  fullWidth
                />
              </Grid>

              {/* Link del certificado */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Link del certificado"
                  placeholder="https://learn.microsoft.com"
                  name="link"
                  value={formikCertification.values.link}
                  onChange={formikCertification.handleChange}
                  error={formikCertification.touched.link && Boolean(formikCertification.errors.link)}
                  helperText={formikCertification.touched.link && formikCertification.errors.link}
                  fullWidth
                />
              </Grid>

              {/* Fecha */}
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  label="Fecha de expedición"
                  type="date"
                  name="date"
                  InputLabelProps={{ shrink: true }}
                  value={formikCertification.values.date}
                  onChange={formikCertification.handleChange}
                  error={formikCertification.touched.date && Boolean(formikCertification.errors.date)}
                  helperText={formikCertification.touched.date && formikCertification.errors.date}
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  onClick={formikCertification.handleSubmit}
                >
                  Agregar certificación
                </Button>
              </Grid>

              {formik.values.certificationsHistory.map((item, index) => (
                <Grid item xs={12} key={index} display="flex" gap={2}>
                  <Button color="error" variant="contained" onClick={() => removeCertification(index)}>
                    <Icon>delete</Icon>
                  </Button>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" fontSize={16}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontSize={12} color="rgb(0 0 0/.75)">
                      Expedición: {item?.date}
                    </Typography>
                    <Typography variant="body2">{item.company}</Typography>

                    {item.link && (
                      <Link
                        href={item.link}
                        sx={{ fontSize: 12, fontWeight: 500 }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver certificado
                      </Link>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <LocalDivider title="" />

          <Grid item xs={12}>
            <Button
              color="success"
              variant="contained"
              fullWidth
              onClick={(e) => {
                if (Object.keys(formik.errors).length > 0) {
                  showSnackbar({
                    message: "Por favor corrige los errores antes de enviar.",
                    color: "error",
                  });
                }

                setJsonData("");
                formik.handleSubmit(e);
              }}
            >
              Mostrar datos
            </Button>
          </Grid>

          {jsonData && (
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Typography variant="h6">JSON exportado:</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={jsonData}
                multiline
                rows={15}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                <Button onClick={handleCopy} variant="contained" color="secondary">
                  Copiar al portapapeles
                </Button>
                <Button onClick={handleDownload} variant="contained" color="secondary">
                  Descargar JSON
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Fade>
    </Container>
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

export default MyForm;
