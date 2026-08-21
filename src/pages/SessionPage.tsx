import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GenerationFailedIllustration } from "@/components/illustrations/GenerationFailedIllustration";
import { ProcessingIllustration } from "@/components/illustrations/ProcessingIllustration";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useSession } from "@/hooks/useSession";
import type { Message, SourceType } from "@/lib/api";

const sourceTypeLabels: Record<SourceType, string> = {
  youtube: "YouTube",
  article: "Article",
  free_question: "Question libre",
};

// Le tout premier tour est littéralement l'URL collée par l'utilisateur
// (voir src/lib/sessions.ts) — pas utile à afficher comme message.
function getVisibleHistory(
  history: Message[],
  sourceUrl: string | null
): Message[] {
  const [first] = history;
  if (first && first.role === "user" && first.content === sourceUrl) {
    return history.slice(1);
  }
  return history;
}

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading, isError, error } = useSession(id ?? "");
  const sendMessageMutation = useSendMessage(id ?? "");
  const [message, setMessage] = useState("");

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sendMessageMutation.mutate(trimmed, {
      onSuccess: () => setMessage(""),
    });
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Link
        to="/nouvelle-session"
        className="text-muted-foreground w-fit text-sm underline"
      >
        ← Nouvelle session
      </Link>
      <Card>
        {isLoading && (
          <CardContent>
            <p className="text-muted-foreground text-sm">Chargement...</p>
          </CardContent>
        )}
        {isError && (
          <CardContent>
            <p className="text-destructive text-sm">{error.message}</p>
          </CardContent>
        )}
        {session && (
          <>
            <CardHeader>
              <span className="bg-accent text-accent-foreground text-caption w-fit rounded-full px-3 py-1 font-medium tracking-[0.02em]">
                {sourceTypeLabels[session.sourceType]}
              </span>
              <CardTitle className="text-display-md">
                {session.title}
              </CardTitle>
              <CardDescription className="text-body">
                Pose une question de suivi pour affiner le résumé.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {getVisibleHistory(session.history, session.sourceUrl).map(
                (item, index) => (
                  <div
                    key={index}
                    className={
                      item.role === "assistant"
                        ? "text-body whitespace-pre-wrap"
                        : "bg-secondary text-secondary-foreground text-body w-fit max-w-[85%] self-end rounded-lg px-3 py-2 whitespace-pre-wrap"
                    }
                  >
                    {item.content}
                  </div>
                )
              )}
              {sendMessageMutation.isPending && (
                <div className="flex flex-col items-center gap-1 self-center text-center">
                  <ProcessingIllustration className="h-16 w-auto" />
                  <p className="text-muted-foreground text-caption">
                    Génération en cours...
                  </p>
                </div>
              )}
              {sendMessageMutation.isError && (
                <div className="flex flex-col items-center gap-1 self-center text-center">
                  <GenerationFailedIllustration className="h-16 w-auto" />
                  <p className="text-muted-foreground text-caption">
                    {sendMessageMutation.error.message}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSend} className="flex w-full gap-2">
                <Textarea
                  rows={1}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Pose une question de suivi..."
                  disabled={sendMessageMutation.isPending}
                  className="min-h-11 flex-1 resize-none sm:min-h-9"
                />
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending || !message.trim()}
                  className="h-11 sm:h-9"
                >
                  Envoyer
                </Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
