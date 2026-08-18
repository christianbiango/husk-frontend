import { useState } from "react";

import { LoginPage } from "@/pages/LoginPage";
import { getStoredToken, setStoredToken } from "@/lib/http";

function AuthenticatedPlaceholder({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold">Connecté à Husk</h1>
      <p className="text-muted-foreground text-sm">
        Les écrans suivants (nouvelle session, flashcards, historique...)
        restent à construire.
      </p>
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
