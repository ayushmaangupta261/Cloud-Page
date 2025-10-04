const BASE_URL = (import.meta.env as any).VITE_APP_BASE_URL;

export const authEndpoint = {
  signup: BASE_URL + "/api/auth/signup",
  login: BASE_URL + "/api/auth/login",
};
