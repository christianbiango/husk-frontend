// Appel réel (pas mocké) vers husk-backend — voir CLAUDE.md, section
// "endpoints réels documentés en exception". Nécessite un vrai token
// PocketBase valide (Authorization: Bearer ...), pas le token mocké de
// src/lib/api.ts.

import { api } from "@/lib/http";

export interface SummarizeYoutubeResponse {
  summary: string;
}

export function summarizeYoutube(
  url: string
): Promise<SummarizeYoutubeResponse> {
  return api<SummarizeYoutubeResponse>("/test/summarize-youtube", {
    method: "POST",
    data: { url },
  });
}
