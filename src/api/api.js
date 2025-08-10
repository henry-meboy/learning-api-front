import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Token refresh queue to avoid duplicate refresh requests ---
let isRefreshing = false;
let subscribers = [];

function subscribe(cb) {
  subscribers.push(cb);
}

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token available");

  // POST to token refresh endpoint WITHOUT using `api` instance to avoid infinite loop
  const resp = await axios.post(
    API_BASE_URL.replace(/\/$/, "") + "/token/refresh/",
    { refresh }
  );
  const newAccess = resp.data.access;
  localStorage.setItem("access", newAccess);
  return newAccess;
}

// Attach access token to each request if available
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Handle 401 Unauthorized responses: try refresh token then retry original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh in progress, queue requests
        return new Promise((resolve) => {
          subscribe((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccess = await refreshAccessToken();
        onRefreshed(newAccess);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        subscribers = [];
        // Refresh failed — propagate error (likely logout)
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/* ------------- Exported API Calls ------------- */

// AUTH
export const login = ({ username, password }) =>
  api.post("/token/", { username, password });

export const refreshToken = (refresh) =>
  axios.post(API_BASE_URL.replace(/\/$/, "") + "/token/refresh/", { refresh });

export const signup = ({ username, password }) => api.post("/signup/", { username, password });

// QUOTES
export const listQuotes = () => api.get("/quotes/");
export const getRandomQuote = () => api.get("/quotes/random/");
export const createQuote = (data) => api.post("/quotes/", data);
export const getQuote = (id) => api.get(`/quotes/${id}/`);
export const updateQuote = (id, data) => api.put(`/quotes/${id}/`, data);
export const partialUpdateQuote = (id, data) => api.patch(`/quotes/${id}/`, data);
export const deleteQuote = (id) => api.delete(`/quotes/${id}/`);

export default api;
