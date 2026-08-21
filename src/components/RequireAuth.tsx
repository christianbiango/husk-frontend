import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

import { getCurrentUser } from "@/lib/auth";
import { getStoredToken } from "@/lib/http";

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = getStoredToken();

  const { isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    staleTime: 60_000,
    retry: false,
  });

  if (!token) {
    return <Navigate to="/connexion" replace />;
  }

  if (isLoading) {
    return (
      <p className="text-muted-foreground flex min-h-svh items-center justify-center text-sm">
        Vérification de la session...
      </p>
    );
  }

  if (isError) {
    // L'intercepteur axios (src/lib/http.ts) a déjà nettoyé le token et
    // lancé la redirection vers /connexion sur ce 401.
    return null;
  }

  return <>{children}</>;
}
