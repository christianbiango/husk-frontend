import { useNavigate } from "react-router-dom";

import { setStoredToken } from "@/lib/http";

export function HomePage() {
  const navigate = useNavigate();

  function handleLogout() {
    setStoredToken(null);
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold">Connecté à Husk</h1>
      <p className="text-muted-foreground text-sm">
        Les écrans suivants (nouvelle session, flashcards, historique...)
        restent à construire.
      </p>
      <button type="button" className="text-sm underline" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}
