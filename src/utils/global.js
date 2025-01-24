import CryptoJS from "crypto-js";

import { isNullOrUndefined, isEmptyOrInvalidString } from "@utils/validations";

const { C27_VERSION, C27_DEBUG, C27_ENCRYPT_KEY /*, C27_URL_API,  C27_APP_ENCRYPT_KEY */ } = import.meta.env;

export const VERSION = `Ver ${C27_VERSION}`;
/* export const URL_PUBLICA = `${C27_URL_API}/`; */
// export const PUBLIC_API_KEY = C27_APP_ENCRYPT_KEY;
export const DEBUG = C27_DEBUG?.toLowerCase() === "true";

const getUniqueId = (id) => (DEBUG ? id : CryptoJS.SHA256(id).toString());
export const setVars = (id, value) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), C27_ENCRYPT_KEY).toString();
  localStorage.setItem(getUniqueId(id), ciphertext);
};

export const getVars = (id, defaultvar = {}) => {
  const data = localStorage.getItem(getUniqueId(id));
  const originalText = !isNullOrUndefined(data)
    ? CryptoJS.AES.decrypt(data, C27_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
    : null;
  return !isNullOrUndefined(originalText) ? JSON.parse(originalText) : defaultvar;
};

export const deleteVars = async (keep = []) => {
  const ids = ["user", "menus", "token", "sideBar", ...keep];
  const keysToKeep = ids.map((item) => getUniqueId(item));

  // Itera a través del sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!keysToKeep.includes(key)) sessionStorage.removeItem(key);
  }

  // Es recomendable hacerlo de forma inversa.
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i);
    if (!keysToKeep.includes(key)) sessionStorage.removeItem(key);
  }
};

export const setStorage = (id, value) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), C27_ENCRYPT_KEY).toString();
  localStorage.setItem(getUniqueId(id), ciphertext);
};

export const getStorage = (id, defaultvar = {}) => {
  const data = localStorage.getItem(getUniqueId(id));
  const originalText = !isNullOrUndefined(data)
    ? CryptoJS.AES.decrypt(data, C27_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
    : null;

  return !isNullOrUndefined(originalText) && !isEmptyOrInvalidString(originalText)
    ? JSON.parse(originalText)
    : defaultvar;
};

export const deleteStorage = async (keep = []) => {
  const ids = ["user", "menus", "token", "sideBar", ...keep];
  const keysToKeep = ids.map((item) => getUniqueId(item));

  // Itera a través del localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!keysToKeep.includes(key)) localStorage.removeItem(key);
  }

  // Es recomendable hacerlo de forma inversa.
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!keysToKeep.includes(key)) localStorage.removeItem(key);
  }
};

const substitutionsAfterEncryption = new Map([
  ["+", "-"],
  ["/", "_"],
  ["=", "~"],
]);
const substitutionsBeforeDecryption = new Map([
  ["-", "+"],
  ["_", "/"],
  ["~", "="],
]);

export const encryptVars = (text) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(text), C27_ENCRYPT_KEY).toString();

  return encrypted.replace(/[+/=]/g, (match) => substitutionsAfterEncryption.get(match) ?? match);
};

export const decryptVars = (text, defaultvar) => {
  let decrypted = null;

  const toDecrypt = text.replace(/[-_~]/g, (match) => substitutionsBeforeDecryption.get(match) ?? match);

  if (toDecrypt !== null) {
    const bytes = CryptoJS.AES.decrypt(toDecrypt, C27_ENCRYPT_KEY);
    decrypted = bytes.toString(CryptoJS.enc.Utf8);
  }

  return decrypted !== null ? JSON.parse(decrypted) : defaultvar;
};
