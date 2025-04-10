import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const mensaje = error.response?.data?.error || "Error desconocido";

    if (status === 401) {
      window.location.href = "/";
    }

    return Promise.reject({ status, message: mensaje });
  }
);

export default api;
