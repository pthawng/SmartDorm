import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for Error Handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401, 403, etc.
    return Promise.reject(error);
  }
);

export default axiosClient;
