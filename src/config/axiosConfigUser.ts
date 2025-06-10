import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const instanceuser = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instanceuser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instanceuser.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instanceuser;
