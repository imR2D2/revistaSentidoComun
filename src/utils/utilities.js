import { Swal } from "@utils/alerts";

// Ordenar de la A a la Z
export const sortOptionsAlphabetically = (options) => {
  return options.slice().sort((a, b) => {
    const normalizedA = typeof a === "number" ? a.toString() : a.toLowerCase();
    const normalizedB = typeof b === "number" ? b.toString() : b.toLowerCase();

    if (normalizedA < normalizedB) return -1;
    if (normalizedA > normalizedB) return 1;
    return 0;
  });
};

// Ordenar de la Z a la A
export const sortOptionsReverseAlphabetically = (options) => {
  return options.slice().sort((a, b) => {
    const normalizedA = typeof a === "number" ? a.toString() : a.toLowerCase();
    const normalizedB = typeof b === "number" ? b.toString() : b.toLowerCase();

    if (normalizedA < normalizedB) return 1;
    if (normalizedA > normalizedB) return -1;
    return 0;
  });
};

// Añade un item vacio
export const addBlankItem = (options) => {
  options.unshift("");
  return options;
};

// Colores
export const getColor = (value) => {
  const val = parseFloat("" + value);
  if (val >= 0 && val < 20) return { color: "#EF4624", font: "#ffffff", icon: "block" };
  if (val >= 20 && val < 40) return { color: "#F9912A", font: "#000000", icon: "priority_high" };
  if (val >= 40 && val < 60) return { color: "#EBC100", font: "#000000", icon: "commit" };
  if (val >= 60 && val < 80) return { color: "#76B947", font: "#000000", icon: "done" };
  return { color: "#1D741B", font: "#ffffff", icon: "done_all" };
};

// Oscurecer un hexadecimal
export const darkenHexColor = (hex, percent = 10) => {
  // Convertir el color hexadecimal a RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Calcular el porcentaje de oscurecimiento
  const amount = Math.round(255 * (percent / 100));

  // Oscurecer el color reduciendo los componentes RGB
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Convertir el nuevo color RGB a hexadecimal
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Redirecciona a un sitio web
export const handleShare = (URL, target = "_blank", features = "noopener,noreferrer") =>
  window.open(URL, target, features);

// Dato random true y false
export const showRandom = (value = 0.5) => Math.random() < value;

// Trae un array de la longitud enviada
export const getArray = (value = 5) => Array.from({ length: value }, (_, i) => i);

// Simula ser una API
export const testAPI = async (data) => {
  const {
    success = true,
    results = true,
    message = "API local de pruebas",
    response = {},
    time = 2000,
    params = {},
  } = data;
  return await new Promise((resolve) =>
    setTimeout(() => resolve({ success, results, message, response, params }), time)
  );
};

export const downloadFileURL = ({ url, name }) => {
  const filename = name ?? url?.substring(url?.lastIndexOf("/") + 1);

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("");
      return response.blob();
    })
    .then((blob) => {
      // Crear un objeto URL temporal con el blob
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Crear un enlace temporal para descargar el archivo
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Limpiar después de la descarga
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch(() => Swal.fire({ title: "Ocurrió un inconveniente al descargar el archivo" }));
};

export const downloadFileFromBuffer = ({
  arrayBuffer,
  name = "download",
  fileType = "application/pdf",
  byURL = false,
  url = null,
}) => {
  let bufferURL = url;

  if (!byURL) {
    const blob = new Blob([arrayBuffer], { type: fileType });
    bufferURL = URL.createObjectURL(blob);
  }

  const a = document.createElement("a");
  a.href = bufferURL;
  a.download = name || "download";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(bufferURL);
  document.body.removeChild(a);
};

export const scrollToElement = (id, top = 52) => {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - top;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

export const intercambiarEspeciales = (texto) => {
  const caracteres = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "A",
    É: "E",
    Í: "I",
    Ó: "O",
    Ú: "U",
    ñ: "n",
    Ñ: "N",
    ü: "u",
    Ü: "U",
  };

  if (texto) {
    const textoEditado = ("" + texto).replace(/[áéíóúÁÉÍÓÚñÑüÜ]/g, (match) => caracteres[match] || match);
    return textoEditado;
  }
  return texto;
};

export const generarURL = (texto) => {
  if (texto) {
    const text = intercambiarEspeciales(texto) + "";

    const slug = text
      .toLowerCase() // Convertir a minúsculas
      .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales excepto letras, números, espacios y guiones
      .replace(/\s+/g, "_") // Reemplazar espacios con guiones
      .replace(/--+/g, "_") // Reemplazar múltiples guiones medios
      .replace(/__+/g, "_") // Reemplazar múltiples guiones bajos
      .replace(/^-+|-+$/g, ""); // Eliminar guiones al principio y al final

    return slug;
  }
  return texto;
};