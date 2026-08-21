import { useQuery } from "@tanstack/react-query";
import { getSessions } from "@/lib/sessions";
import type { Session } from "@/lib/api";

// N'inclut que les sessions réelles (YouTube) — les sessions mockées
// (article/question libre) ne sont plus créables depuis l'UI et ne
// vivent que côté client, voir CLAUDE.md.
export function useSessions(options: { enabled?: boolean } = {}) {
  return useQuery<Session[], Error>({
    queryKey: ["sessions"],
    queryFn: getSessions,
    retry: false,
    enabled: options.enabled,
  });
}
