import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// Request Interceptor for Authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // ✅ Only set `multipart/form-data` for file uploads
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
