import Swal from "sweetalert2";
import { showSnackbar } from "@global/alerts/CustomSnack";

import { isEmptyOrNullObject, isEmptyOrInvalidString } from "@utils/validations";

import { DEBUG, URL_PUBLICA, PUBLIC_API_KEY, getVars, encryptVars, decryptVars } from "@utils/global";

const handleParams = (data) => {
  const params = data ?? {};
  return DEBUG ? JSON.stringify(params) : encryptVars(JSON.stringify(params));
};

export const fetchAPI = (params, route, method = "POST") => {
  const headers = new Headers();

  const token = getVars("token", "");
  if (!isEmptyOrInvalidString(token)) headers.append("Authorization", `Bearer ${token}`);

  if (DEBUG) headers.append("Content-Type", "application/json");
  else headers.append("Content-Type", "text/plain;charset=UTF-8");

  return new Promise((resolve, reject) => {
    const request = {
      method: method,
      body: handleParams(params),
      headers: headers,
    };
    let url = "";

    switch (method) {
      case "GET":
        url = new URL(URL_PUBLICA + route);
        delete request.body;
        if (!isEmptyOrNullObject(params)) {
          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value !== "") url.searchParams.append(key, params[key]);
          });
        }
        break;

      case "POST":
      case "PUT":
      case "DELETE":
      case "PATCH":
      default:
        url = URL_PUBLICA + route;
        break;
    }

    fetch(url, request)
      .then((res) => {
        if (res.ok) return res.json();

        const msj = errorMessage(res);

        if (msj.json) return res.json();

        if (msj.swal) {
          return Swal.fire({
            title: msj.title,
            text: msj.text,
            iconHtml: msj.iconHtml ?? "",
            denyButtonText: msj.denyButtonText,
            ...swalClass,
          }).then((res) => {
            if (res.isDenied) {
              sessionStorage.clear();
              window.location.href = "/login";
            }
          });
        }

        throw new Error(msj.message);
      })
      .then((RS) => {
        if (!RS.success) reject({ ...RS, results: false });
        else {
          resolve({
            ...RS,
            response: DEBUG ? RS.response : decryptVars(RS.response),
          });
        }
      })
      .catch((e) => {
        if (data.snack) return reject(showSnackbar({ message: data.message }));
        const data = errorFetch(e.message);
        if (data.snack) return reject(showSnackbar({ message: data.message }));
        reject({ data: {}, ...data });
      });
  });
};

export const fetchPublicAPI = (params, route, method = "POST") => {
  const headers = new Headers({ Authorization: PUBLIC_API_KEY });

  if (DEBUG) headers.append("Content-Type", "application/json");
  else headers.append("Content-Type", "text/plain;charset=UTF-8");

  return new Promise((resolve, reject) => {
    const request = {
      method: method,
      body: handleParams(params),
      headers: headers,
    };
    let url = "";

    switch (method) {
      case "GET":
        url = new URL(URL_PUBLICA + route);
        delete request.body;
        if (!isEmptyOrNullObject(params)) {
          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value !== "") url.searchParams.append(key, params[key]);
          });
        }
        break;

      case "POST":
      case "PUT":
      case "DELETE":
      case "PATCH":
      default:
        url = URL_PUBLICA + route;
        break;
    }

    fetch(url, request)
      .then((res) => {
        if (res.ok) return res.json();

        const msj = errorMessage(res);

        if (msj.json) return res.json();

        if (msj.swal) {
          return Swal.fire({
            title: msj.title,
            text: msj.text,
            iconHtml: msj.iconHtml ?? "",
            denyButtonText: msj.denyButtonText,
            ...swalClass,
          }).then((res) => {
            if (res.isDenied) {
              sessionStorage.clear();
              window.location.href = "/login";
            }
          });
        }

        throw new Error(msj.message);
      })
      .then((RS) => {
        if (!RS.success) reject({ ...RS, results: false });
        else {
          resolve({
            ...RS,
            response: DEBUG ? RS.response : decryptVars(RS.response),
          });
        }
      })
      .catch((e) => {
        const data = errorFetch(e.message);
        if (data.snack) return reject(showSnackbar({ message: data.message }));
        reject({ data: {}, ...data });
      });
  });
};

const errorFetch = (message) => {
  const error = { success: false, results: false, response: {} };
  if (!window.navigator.onLine) return { ...error, snack: true, message: "Revisa tu conexión a internet." };
  else if (message === "Failed to fetch")
    return {
      ...error,
      snack: true,
      message: "La plataforma está en actualización, en breve se restablece el servicio.",
    };
  else return { ...error, message };
};

const swalClass = {
  icon: "warning",
  iconColor: "#dc3741",
  showDenyButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  focusConfirm: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
  customClass: { container: "modal-alert" },
};

const errorMessage = (res) => {
  switch (res.status) {
    case 400:
      return { json: true };
    // return "Validación fallida. Revise los campos e intente de nuevo.";

    case 401:
      return {
        swal: true,
        title: "¡Su sesión ha caducado!",
        text: "Por favor, vuelva a iniciar sesión.",
        denyButtonText: "Renovar sesión",
      };

    case 403:
      return {
        swal: true,
        title: "Se inicio sesión desde otro dispositivo",
        text: "Si no fue usted, por favor, renueve su sesión y cambie la contraseña",
        denyButtonText: "Renovar sesión",
      };

    case 404:
      return { message: "API no encontrada." };

    case 406:
      return {
        swal: true,
        title: "Fuera de Horario",
        text: "Lo sentimos, las operaciones están restringidas fuera del horario permitido.",
        denyButtonText: "Cerrar sesión",
      };

    case 428:
      return { message: "Captcha no válido. Por favor, contacte al administrador." };

    case 429:
      return { message: "Cuenta suspendida 5 min por intentos inválidos. Intente después." };

    case 500:
      return { message: "Ocurrió un inconveniente. Por favor, contacte al administrador." };

    default:
      return { message: res.statusText };
  }
};

export default fetchAPI;
