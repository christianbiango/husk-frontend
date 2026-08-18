import { useState } from "react";

import { LoginPage } from "@/pages/LoginPage";
import { useHealth } from "@/hooks/useHealth";
import { getStoredToken, setStoredToken } from "@/lib/http";

function AuthenticatedPlaceholder({ onLogout }: { onLogout: () => void }) {
  const health = useHealth();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold">Connecté à Husk</h1>
      <p className="text-muted-foreground text-sm">
        Les écrans suivants (nouvelle session, flashcards, historique...)
        restent à construire.
      </p>
      <span
        className={
          "rounded-full border px-3 py-1 text-xs font-medium " +
          (health.isLoading
            ? "border-border bg-muted text-muted-foreground"
            : health.isError
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
              : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400")
        }
      >
        {health.isLoading
          ? "Vérification de l'API..."
          : health.isError
            ? "API injoignable"
            : "Connecté à l'API"}
      </span>
      <button
        type="button"
        className="text-sm underline"
        onClick={onLogout}
      >
        Se déconnecter
      </button>
    </div>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  function handleLogout() {
    setStoredToken(null);
    setToken(null);
  }

  if (!token) {
    return <LoginPage onLoginSuccess={() => setToken(getStoredToken())} />;
  }

  return <AuthenticatedPlaceholder onLogout={handleLogout} />;
}

export default App;
