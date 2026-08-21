// Helpers d'affichage partagés entre les blocs de sessions (Nouvelle
// session) et la barre latérale (AuthenticatedLayout).

import type { SourceType } from "@/lib/api";

export const sourceTypeLabels: Record<SourceType, string> = {
  youtube: "YouTube",
  article: "Article",
  free_question: "Question libre",
};

export function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
