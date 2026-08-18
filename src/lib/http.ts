// Client HTTP réel (axios) — distinct de src/lib/api.ts qui est la couche mock.
// Sert aux appels qui doivent effectivement toucher le réseau (ex. /health),
// pas aux écrans métier (Login, sessions, flashcards...) qui restent branchés sur le mock.

import axios from "axios";

export const TOKEN_STORAGE_KEY = "husk_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = async <T = unknown>(
  url: string,
  config?: Parameters<typeof axiosInstance.request>[0]
): Promise<T> => {
  const response = await axiosInstance.request<T>({ url, ...config });
  return response.data;
};
