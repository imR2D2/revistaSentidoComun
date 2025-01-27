import Yup from "@utils/Yupi18n";

const today = new Date();

const FormAcademia = Yup.object().shape({
  FullName: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(80, "El nombre debe tener como máximo 80 caracteres")
    .when('IdResponsabilidad', {
      is: (valor) => valor === 0,
      then: (item) => item.required()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(80, "El nombre debe tener como máximo 80 caracteres"),
      otherwise: (item) => item.notRequired(),
    }),
  Title: Yup.string().min(3).max(80).label("Título Completo").required("Título es requerido"),
  Contenido: Yup.string().min(100, "Escribe más contenido, mínimo 100 caracteres").required("Descripción larga es requerido"),
  ShortDescription: Yup.string().min(3).max(300).label("Descripción Corta").required("Descripción corta es requerido"),
  Ubicacion: Yup.string().min(2).max(20).label("Ubicación del Acontecimiento"),
  Link: Yup.string().min(2).max(100).label("Link Página Externa"),
  IdResponsabilidad: Yup.number().oneOf([0, 1, 2, 3]).required("Autor es requerido").label("Autor"),
  Files: Yup.array()
    .min(1)
    .max(1)
    .of(
      Yup.object().shape({
        file: Yup.string().required("Imagen es requerida"),
      })
    )
  ,
  FilesPdf: Yup.array()
    .min(1)
    .max(1)
    .of(
      Yup.object().shape({
        file: Yup.string().required("PDF es requerido"),
      })
    )
  ,
  Date: Yup.date()
    .required("Fecha de Acontecimiento es requerida")
    .max(today, "La fecha no puede ser posterior al día de hoy"),
  EducationHistory: Yup.array().of(
    Yup.object().shape({
      SocialNetworksLink: Yup.string().required("Nombre es requerido"),
      SocialNetworksType: Yup.number().required("Tipo es requerido"),
    })
  ),
});

const socialNetworks = Yup.object().shape({
  SocialNetworksLink: Yup.string()
    .when('SocialNetworksType', {
      is: 4,
      then: (item) => item.email("Debe ser un correo electrónico válido").required("El correo es requerido"),
      otherwise: (schema) => schema
        .matches(/^https?:\/\//, "El link debe comenzar con http:// o https://")
        .required("El link o correo es requerido"),
    }),
  SocialNetworksType: Yup.number().required("Tipo es requerido"),
});

export { FormAcademia, socialNetworks };

