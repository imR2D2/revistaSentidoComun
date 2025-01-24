import Yup from "@utils/Yupi18n";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const formSchema = Yup.object().shape({
  name: Yup.string().required("Nombre es requerido"),
  lastname: Yup.string().required("Apellido es requerido"),
  fullname: Yup.string().required("Nombre completo es requerido"),
  description: Yup.string().required("Descripción es requerida"),
  workstation: Yup.array()
    .min(1, "Se requiere al menos un puesto")
    .max(2, "Solo se pueden agregar 2 puestos")
    .required("Se requiere al menos 1"),
  social: Yup.object().shape({
    email: Yup.string().email("Correo inválido").required("Email es requerido"),
    facebook: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
    x: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
    instagram: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
    youtube: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
    github: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
    linkedin: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
  }),
  skills: Yup.array()
    .min(1, "Se requiere al menos una habilidad")
    .required("Se requiere al menos una habilidad"),
  jobsHistory: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Nombre es requerido"),
      job: Yup.array().required("Se requiere al menos 1"),
      ubication: Yup.string().required("Ubicación es requerida"),
      type: Yup.string().required("Tipo es requerido"),
      time: Yup.string().required("Tiempo es requerido"),
      dateStart: Yup.date().required("Fecha de inicio es requerida"),
      dateEnd: Yup.date(),
    })
  ),
  educationHistory: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Nombre es requerido"),
      title: Yup.string().required("Título es requerido"),
      ubication: Yup.string().required("Ubicación es requerida"),
      dateStart: Yup.date().required("Fecha de inicio es requerida"),
      dateEnd: Yup.date(),
    })
  ),
  certificationsHistory: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Nombre es requerido"),
      company: Yup.string().required("Compañía es requerida"),
      date: Yup.date().required("Fecha es requerida"),
      link: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
    })
  ),
});

const jobSchema = Yup.object({
  name: Yup.string().min(4, "El nombre debe tener más de 3 caracteres").required("Nombre es requerido"),
  ubication: Yup.string()
    .min(4, "La ubicación debe tener más de 3 caracteres")
    .required("Ubicación es requerida"),
  type: Yup.number().min(1, "Debe seleccionar el tipo de trabajo").required("Tipo de trabajo es requerido"),
  time: Yup.number().min(1, "Debe seleccionar el tiempo laboral").required("Tiempo laboral es requerido"),
  dateStart: Yup.string().required("Debe seleccionar la fecha de inicio"),
  dateEnd: Yup.date(),
  job: Yup.array().min(1, "Debe agregar al menos una habilidad"),
});

const educationSchema = Yup.object().shape({
  name: Yup.string().required("Nombre es requerido"),
  title: Yup.string().required("Título es requerido"),
  ubication: Yup.string().required("Ubicación es requerida"),
  dateStart: Yup.date().required("Fecha de inicio es requerida"),
  dateEnd: Yup.date(),
});

const certificationSchema = Yup.object().shape({
  name: Yup.string().required("Nombre es requerido"),
  company: Yup.string().required("Compañía es requerida"),
  date: Yup.date().required("Fecha es requerida"),
  link: Yup.string().test("valid-url", "URL inválida", (value) => !value || isValidUrl(value)),
});

export { formSchema, jobSchema, educationSchema, certificationSchema };
