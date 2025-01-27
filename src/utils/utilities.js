// Trae un array de la longitud enviada
export const getArray = (value = 5) => Array.from({ length: value }, (_, i) => i);

// Dato random true y false
export const showRandom = (value = 0.5) => Math.random() < value;

// Hacer un scroll hasta cierto elemento del DOM
export const scrollToElement = (id, top = 52) => {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - top;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
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