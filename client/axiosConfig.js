import axios from "axios";
import { toast } from "react-toastify";
import { getAccessToken } from "../client/src/utils/getAccessToken"; // adjust path as needed

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

// ✅ Request interceptor - injects fresh Microsoft token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken(); // gets fresh token
      console.log("Access token in interceptor:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to acquire access token", error);
      toast.error("Authentication failed. Please log in again.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Authentication required. Please log in again.");
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.request && !error.response) {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
