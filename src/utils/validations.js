// Validar formato del celular
export const validatePhone = (input) => {
  const regex = /^[0-9]*$/;
  if (input.match(regex) && input.length <= 10) return true;
  else return false;
};


// Validar formato del numero
export const validateNumber = (input) => {
  const pattern = /^\d+$/;
  return pattern.test(input);
};

// Validar formato letras con acentos
export const validateLetters = (input) => {
  const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+$/;
  return pattern.test(input);
};

// Validar formato letras con acentos y espacios
export const validateLettersWithSpaces = (input) => {
  const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$/;
  return pattern.test(input);
};

// Validar formato alfanumérico sin acentos
export const validateAlphanumeric = (input) => {
  const pattern = /^[A-Za-z0-9]+$/;
  return pattern.test(input);
};

// Validar formato alfanumérico con acentos
export const validateAlphanumericExtra = (input) => {
  const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9]+$/;
  return pattern.test(input);
};

// Validar formato de fecha dd/mm/aaaa
export const validateDateFormat = (dateString) => {
  const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return pattern.test(dateString);
};

// Validar formato de CURP
export const validateCURP = (input) => {
  const pattern = /^[A-Z]{4}[0-9]{6}[A-Z]{7}[0-9]{1}$/;
  return pattern.test(input);
};

// Validar formato de RFC
export const validateRFC = (input) => {
  const pattern = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
  return pattern.test(input);
};

export const isNullOrUndefined = (value) => value === null || value === undefined;

export const isEmptyOrInvalidString = (value) => {
  if (value) return typeof value === "string" ? value.split(/\s+/).join("") === "" : false;
  return true;
};

export const isEmptyOrInvalidArray = (value) => isNullOrUndefined(value) || value.length === 0;

export const isEmptyOrNullObject = (value) => {
  if (isNullOrUndefined(value)) return true;
  if (typeof value === "object") for (var key in value) return false;
  return true;
};
