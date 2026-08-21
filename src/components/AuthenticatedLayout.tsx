import { useState, type ReactNode } from "react";
import { LogOut, Menu } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { HuskMark } from "@/components/HuskMark";
import { RequireAuth } from "@/components/RequireAuth";
import { SessionsSidebar } from "@/components/SessionsSidebar";
import { setStoredToken } from "@/lib/http";

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    setStoredToken(null);
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    navigate("/connexion", { replace: true });
  }

  return (
    <RequireAuth>
      <div className="flex min-h-svh flex-col">
        <header className="border-border bg-background sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3">
          <span className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-11 sm:size-8"
              onClick={() => setSidebarOpen(true)}
              aria-label="Voir mes sessions"
            >
              <Menu />
            </Button>
            <Link to="/nouvelle-session" className="flex items-center gap-2">
              <HuskMark size={24} />
              <span className="font-heading text-lg font-medium">Husk</span>
            </Link>
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
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
      <SessionsSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </RequireAuth>
  );
}
