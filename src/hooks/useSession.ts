import { useQuery } from "@tanstack/react-query";
import { getSession, type Session } from "@/lib/api";

export function useSession(id: string) {
  return useQuery<Session, Error>({
    queryKey: ["session", id],
    queryFn: () => getSession(id),
  });
}
