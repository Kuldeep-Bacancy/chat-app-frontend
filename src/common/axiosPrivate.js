import axios from "axios";
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    'Accept': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken')) || Cookies.get('accessToken')

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      Cookies.remove('accessToken')

      return axios(config);
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axiosInstance;