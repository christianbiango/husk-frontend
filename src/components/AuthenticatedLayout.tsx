import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { HuskMark } from "@/components/HuskMark";
import { RequireAuth } from "@/components/RequireAuth";
import { setStoredToken } from "@/lib/http";

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    setStoredToken(null);
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    navigate("/connexion", { replace: true });
  }

  return (
    <RequireAuth>
      <div className="flex min-h-svh flex-col">
        <header className="border-border flex items-center justify-between border-b px-4 py-3">
          <span className="flex items-center gap-2">
            <HuskMark size={24} />
            <span className="font-heading text-lg font-medium">Husk</span>
          </span>
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
