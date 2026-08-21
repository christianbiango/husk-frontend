import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSession as getMockSession,
  sendMessage as sendMockMessage,
  type Message,
  type Session,
} from "@/lib/api";
import { sendMessage as sendRealMessage } from "@/lib/sessions";

// Même logique de routage par préfixe d'id que useSession (voir CLAUDE.md).
async function sendMessage(sessionId: string, message: string): Promise<Message[]> {
  if (sessionId.startsWith("sess_")) {
    await sendMockMessage(sessionId, message);
    const updated = await getMockSession(sessionId);
    return updated.history;
  }
  return sendRealMessage(sessionId, message);
}

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation<Message[], Error, string>({
    mutationFn: (message: string) => sendMessage(sessionId, message),
    onSuccess: (history) => {
      queryClient.setQueryData<Session>(["session", sessionId], (old) =>
        old ? { ...old, history } : old
      );
    },
  });
}
