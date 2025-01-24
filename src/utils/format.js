import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Formato del celular
export const formatPhone = (input) => {
  const cleaned = ("" + input).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return "";
  return match[1] + (match[2] ? "-" : "") + match[2] + (match[3] ? "-" : "") + match[3];
};

// Si pasas un numero "12", "12.3", "12,300", "1%", "1.2%", "1,200.3%" lo regresa como numero
export const convertToNumber = (text) => {
  if (text !== undefined && text !== null) {
    const input = removeMinus(removeSpaces(text));

    const number = /^\d+$/;
    const oneDecimalPoint = /^\d+\.\d+$/;
    const numberWithCommas = /^(\d{1,3},)*\d{1,3}$/;
    const validNumber = /^(\d{1,3}(,\d{3})*(\.\d+)?|\.\d+)%?$/;

    if (number.test(input)) return parseFloat(("" + input).replace(/[^0-9]/g, ""));
    if (numberWithCommas.test(input)) return parseFloat(("" + input).replace(/,/g, ""));
    if (oneDecimalPoint.test(input)) return parseFloat("" + input);
    if (validNumber.test(input)) return parseFloat(("" + input).replace(/%/g, "").replace(/,/g, ""));

    return text;
  }
  return null;
};

export const removeSpaces = (text) => {
  if (text !== undefined && text !== null) {
    const input = ("" + text).replace(/\s/g, "");
    return input;
  }
  return null;
};

export const removeMinus = (text) => {
  if (text !== undefined && text !== null) {
    const input = ("" + text).replace(/-/g, "");
    return input;
  }
  return null;
};

export const trim = (value, comma = "") => (value?.trim() ? `${comma}${("" + value).trim()}` : "");

// Convierte tipo a boleano
export const convertToBoolean = (input) => {
  if (input !== undefined && input !== null) {
    if (typeof input === "number") {
      return input !== 0;
    } else if (typeof input === "string") {
      const lowerCaseInput = input.toLowerCase().trim();
      if (lowerCaseInput === "true" || lowerCaseInput === "false") {
        return lowerCaseInput === "true";
      }
    }
  }

  return null;
};

// Formato del numero
export const formatNumber = (input) => parseFloat(("" + input).replace(/[^0-9]/g, ""));

// Formato de letras con acentos
export const formatLetters = (input) => ("" + input).replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/g, "");

// Formato de letras con acentos y espacios
export const formatLettersWithSpaces = (input) => ("" + input).replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g, "");

// Formato de alfanumérico con acentos
export const formatAlphanumeric = (input) => ("" + input).replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9]/g, "");

// Formato de alfanumérico con acentos y espacios
export const formatAlphanumericWithSpaces = (input) =>
  ("" + input).replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9 ]/g, "");

// Formato de fecha de aaaa-mm-dd a dd/mm/aaaa
export const formatDateDMA = (dateString) => {
  const dateParts = (dateString + "").split("-");
  if (dateParts.length !== 3) return dateString; // No es un formato de fecha válido

  const day = dateParts[2];
  const month = dateParts[1];
  const year = dateParts[0];
  return `${day}/${month}/${year}`;
};

// Formato de fecha de dd/mm/aaaa a aaaa-mm-dd
export const formatDateAMD = (dateString) => {
  const dateParts = (dateString + "").split("/");
  if (dateParts.length !== 3) return dateString; // No es un formato de fecha válido

  const day = dateParts[0];
  const month = dateParts[1];
  const year = dateParts[2];
  return `${year}-${month}-${day}`;
};

// Formato de fecha de dd/mm/aaaa a mm/dd/aaaa
export const formatDateMDA = (dateString) => {
  const dateParts = (dateString + "").split("/");
  if (dateParts.length !== 3) return dateString; // No es un formato de fecha válido

  const day = dateParts[0];
  const month = dateParts[1];
  const year = dateParts[2];
  return `${month}/${day}/${year}`;
};

// Formato de fecha de aaaa-mm-dd hh:mm:ss a dia_semana dia mes - hh:mm PM/AM
export const formatDateToText = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "EEEE dd MMMM - hh:mm a", { locale: es });
};

// Formato de numero con comas
export const numberWithCommas = (input) => {
  const isNumeric = !isNaN(parseFloat(input)) && isFinite(input); // Verifica si es un numero
  if (isNumeric) return parseFloat(input).toLocaleString(); // Formatea el número con comas
  else return input;
};

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
