// Appel réel vers husk-backend — voir CLAUDE.md, "endpoints réels".
// Remplace l'ancien login() mocké de src/lib/api.ts. Nécessite un vrai
// compte PocketBase : pas d'inscription publique, le compte se crée une
// fois via le dashboard admin PocketBase (app mono-utilisateur).

import { api } from "@/lib/http";

export interface LoginResponse {
  token: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    data: { email, password },
  });
}

export interface CurrentUser {
  id: string;
  email: string;
}

// Sert à valider un token stocké au chargement d'une route protégée
// (voir RequireAuth) : un 401 ici déclenche l'intercepteur global de
// src/lib/http.ts, qui nettoie le token et redirige vers /connexion.
export function getCurrentUser(): Promise<CurrentUser> {
  return api<CurrentUser>("/auth/me", { method: "GET" });
}
