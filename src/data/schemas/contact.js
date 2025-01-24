import Yup from "@utils/Yupi18n";

const contacto = Yup.object({
  nombre: Yup.string().required("El nombre es requerido").min(2),
  telefono: Yup.string().required("El teléfono es requerido").min(10).max(10),
  mensaje: Yup.string().required("El mensaje es requerido").min(2).max(500),
});

export { contacto };
