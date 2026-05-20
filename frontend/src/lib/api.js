import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("session");
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export function getApiError(error, fallback = "Request failed") {
  return error?.response?.data?.message || error?.message || fallback;
}

export default api;
