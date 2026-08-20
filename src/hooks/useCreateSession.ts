import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { createSession, type SourceType } from "@/lib/api";
import { summarizeYoutube } from "@/lib/gemini";

interface CreateSessionInput {
  sourceType: SourceType;
  content: string;
}

export function useCreateSession() {
  return useMutation({
    mutationFn: async ({ sourceType, content }: CreateSessionInput) => {
      if (sourceType !== "youtube") {
        return createSession(sourceType, content);
      }
      try {
        const { summary } = await summarizeYoutube(content);
        return createSession(sourceType, content, summary);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          typeof error.response?.data?.detail === "string"
        ) {
          throw new Error(error.response.data.detail);
        }
        throw error;
      }
    },
  });
}
