import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/RequireAuth";
import { setStoredToken } from "@/lib/http";

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function handleLogout() {
    setStoredToken(null);
    navigate("/connexion", { replace: true });
  }

  return (
    <RequireAuth>
      <div className="flex min-h-svh flex-col">
        <header className="border-border flex items-center justify-between border-b px-4 py-3">
          <span className="font-heading text-lg font-medium">Husk</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 sm:size-8"
            onClick={handleLogout}
            aria-label="Se déconnecter"
          >
            <LogOut />
          </Button>
        </header>
        <div className="flex flex-1 flex-col items-center p-4 sm:justify-center">
          {children}
        </div>
      </div>
    </RequireAuth>
  );
}
