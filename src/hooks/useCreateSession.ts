import { useMutation } from "@tanstack/react-query";
import { createYoutubeSession } from "@/lib/sessions";

// Seul YouTube est câblé — Article/Question libre n'ont pas d'UI tant que
// husk-backend ne les supporte pas (voir CLAUDE.md).
export function useCreateSession() {
  return useMutation({
    mutationFn: (url: string) => createYoutubeSession(url),
  });
}
