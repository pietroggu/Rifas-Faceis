import axios from "axios";

/**
 * Centralized HTTP client instance configuration.
 * Enforces consistent base URLs and network timeout rules across the app.
 */
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor:
 * Automatically injects the Bearer token into HTTP headers if the user is authenticated.
 */
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Catches global API behaviors (e.g., clearing expired sessions on 401 errors).
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token expired or is invalid, wipe it locally
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default httpClient;