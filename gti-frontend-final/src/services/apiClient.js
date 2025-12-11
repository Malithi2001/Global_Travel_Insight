import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});

export default api;