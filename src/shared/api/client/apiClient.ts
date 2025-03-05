import axios, { AxiosError, AxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function getAccessToken() {
  return localStorage.getItem("jwtToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("jwtToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function removeTokens() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshToken");
}

const createHttpClient = (baseUrl: string) => {
  const httpClient = axios.create({
    baseURL: baseUrl,
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

  httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status !== 401 || !error.config) {
        return Promise.reject(error);
      }

      const originalRequest = error.config;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(httpClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const resp = await axios.post(`${baseUrl}/user/refresh-token`, {
          refreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } = resp.data;

        setTokens(newAccessToken, newRefreshToken);

        onRefreshed(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return httpClient(originalRequest);
      } catch (err) {
        removeTokens();
        console.log("Не удалось обновить токен, перенаправляем на /admin/login");
        window.location.href = "/admin/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return httpClient;
};

export default createHttpClient;