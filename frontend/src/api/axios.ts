import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'tripvault_token';

const instance = axios.create({
  baseURL: '/api/v1',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return instance(config).then((res) => res.data);
};
