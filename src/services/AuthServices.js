import fetchAPI from "@utils/fetchAPI";

class AuthServices {
  login = (params) => fetchAPI(params, "auth/login", "POST");

  register = (params) => fetchAPI(params, "auth/register", "POST");

  logout = (params) => fetchAPI(params, "auth/logout", "POST");
}

const service = new AuthServices();
export default service;
