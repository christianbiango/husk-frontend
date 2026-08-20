import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getStoredToken } from "@/lib/http";

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/connexion" replace />;
  }

  return <>{children}</>;
}
