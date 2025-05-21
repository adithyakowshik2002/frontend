
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9090',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
