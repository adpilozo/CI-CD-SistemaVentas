// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8083", // Cambia al puerto de tu backend si es diferente
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;