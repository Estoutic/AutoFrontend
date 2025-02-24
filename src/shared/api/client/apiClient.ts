import axios from "axios";

const createHttpClient = (url: string) => {
  const httpClient = axios.create({
    baseURL: url,
    withCredentials: true,
  });

  httpClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return httpClient;
};

export default createHttpClient;
