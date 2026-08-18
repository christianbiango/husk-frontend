import { useHealth } from "@/hooks/useHealth";

// Diagnostic temporaire : visualise que l'appel réel /health (axios) fonctionne,
// en attendant les vrais écrans. À retirer une fois ce point validé.
export function ApiStatusBadge() {
  const health = useHealth();

  return (
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
  );
}
