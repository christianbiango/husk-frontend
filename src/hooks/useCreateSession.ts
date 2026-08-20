import { useMutation } from "@tanstack/react-query";
import { createSession, type SourceType } from "@/lib/api";

interface CreateSessionInput {
  sourceType: SourceType;
  content: string;
}

export function useCreateSession() {
  return useMutation({
    mutationFn: ({ sourceType, content }: CreateSessionInput) =>
      createSession(sourceType, content),
  });
}
