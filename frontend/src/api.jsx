// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach access token on each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto-handle 401 and invalid token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.code === "token_not_valid"
    ) {
      // Token invalid or expired → clear & redirect to login
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      alert("Session expired. Please log in again.");
      // window.location.href = "/login"; // uncomment if you have a login route
    }
    return Promise.reject(error);
  }
);

export default api;
