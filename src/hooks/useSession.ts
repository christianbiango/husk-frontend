import { useQuery } from "@tanstack/react-query";
import { getSession as getMockSession, type Session } from "@/lib/api";
import { getSession as getRealSession } from "@/lib/sessions";

// Les sessions article/question libre restent mockées (id préfixé "sess_",
// voir src/lib/api.ts) tant que le backend n'accepte que type_source
// "youtube" à la création — le préfixe distingue les deux sources.
export function useSession(id: string) {
  return useQuery<Session, Error>({
    queryKey: ["session", id],
    queryFn: () =>
      id.startsWith("sess_") ? getMockSession(id) : getRealSession(id),
    retry: false,
  });
}
