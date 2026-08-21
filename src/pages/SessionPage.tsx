import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HuskMark } from "@/components/HuskMark";
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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TEXTAREA_MAX_HEIGHT = 160;

// Styles minimaux pour le markdown des réponses IA (gras, listes, titres...)
// — pas de dépendance à un plugin Tailwind typography pour un seul usage.
const MARKDOWN_CLASSES =
  "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 " +
  "[&_h1]:font-heading [&_h1]:text-display-md [&_h1]:mb-2 " +
  "[&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-medium [&_h2]:mb-2 " +
  "[&_h3]:font-medium [&_h3]:mb-1 " +
  "[&_a]:underline [&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-caption";

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading, isError, error } = useSession(id ?? "");
  const sendMessageMutation = useSendMessage(id ?? "");
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
    resizeTextarea();
  }

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(trimmed, {
      onSuccess: () => {
        setMessage("");
        requestAnimationFrame(resizeTextarea);
      },
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend(event);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isLoading && (
        <p className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
          Chargement...
        </p>
      )}
      {isError && (
        <p className="text-destructive flex flex-1 items-center justify-center p-4 text-center text-sm">
          {error.message}
        </p>
      )}
      {session && (
        <>
          <div className="border-border flex items-center gap-2 border-b px-2 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              nativeButton={false}
              render={<Link to="/nouvelle-session" aria-label="Nouvelle session" />}
            >
              <Plus />
            </Button>
            <span className="bg-accent text-accent-foreground text-caption shrink-0 rounded-full px-2.5 py-1 font-medium tracking-[0.02em]">
              {sourceTypeLabels[session.sourceType]}
            </span>
            <h1 className="font-heading truncate text-base font-medium">
              {session.title}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
              {getVisibleHistory(session.history, session.sourceUrl).map(
                (item, index) =>
                  item.role === "assistant" ? (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <HuskMark size={20} />
                        <span className="text-caption text-muted-foreground">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <div className={`text-body ${MARKDOWN_CLASSES}`}>
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="flex flex-col items-end gap-1">
                      <span className="text-caption text-muted-foreground">
                        {formatTime(item.timestamp)}
                      </span>
                      <div className="bg-secondary text-secondary-foreground text-body max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap">
                        {item.content}
                      </div>
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
            </div>
          </div>

          <div className="border-border border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <form
              onSubmit={handleSend}
              className="border-input focus-within:border-ring focus-within:ring-ring/50 mx-auto flex w-full max-w-2xl items-end gap-2 rounded-3xl border px-2 py-2 focus-within:ring-3"
            >
              <Textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={sendMessageMutation.isPending}
                placeholder="Pose une question de suivi..."
                className="max-h-40 min-h-11 flex-1 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
              <Button
                type="submit"
                size="icon"
                disabled={sendMessageMutation.isPending || !message.trim()}
                className="size-11 shrink-0 rounded-full"
                aria-label="Envoyer"
              >
                <ArrowUp />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
