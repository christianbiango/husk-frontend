// Client HTTP réel (axios) — distinct de src/lib/api.ts qui reste la couche
// mock pour ce qui n'a pas encore d'équivalent backend (flashcards, export,
// création de session article/question libre). La liste des endpoints réels
// est documentée dans CLAUDE.md.

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

// husk-backend préfixe désormais toutes ses routes par /api — préfixe fixe
// de l'application (ne varie pas selon l'environnement), donc géré ici
// plutôt que dans VITE_API_URL (qui reste juste l'origine, ex.
// http://localhost:8000).
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Un 401 signifie un token absent/expiré/invalide (husk-backend le renvoie
// systématiquement via get_current_user) — sauf sur /auth/login lui-même,
// où un 401 veut juste dire "mauvais identifiants", pas "session expirée".
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (axios.isAxiosError(error) && error.response?.status === 401 && !isLoginRequest) {
      setStoredToken(null);
      if (window.location.pathname !== "/connexion") {
        window.location.assign("/connexion");
      }
    }
    return Promise.reject(error);
  }
);

export const api = async <T = unknown>(
  url: string,
  config?: Parameters<typeof axiosInstance.request>[0]
): Promise<T> => {
  const response = await axiosInstance.request<T>({ url, ...config });
  return response.data;
};

// Extrait le message d'erreur exact renvoyé par husk-backend (shape
// FastAPI standard { detail: "..." }), pour éviter d'afficher un message
// Axios générique ("Request failed with status code 401").
export function getApiErrorMessage(error: unknown): string | null {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.detail === "string"
  ) {
    return error.response.data.detail;
  }
  return null;
}
