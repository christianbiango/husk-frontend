import { Link, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/useSession";
import type { SourceType } from "@/lib/api";

const sourceTypeLabels: Record<SourceType, string> = {
  youtube: "YouTube",
  article: "Article",
  free_question: "Question libre",
};

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading, isError, error } = useSession(id ?? "");

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
              <span className="bg-accent text-accent-foreground w-fit rounded-full px-3 py-1 text-xs font-medium">
                {sourceTypeLabels[session.sourceType]}
              </span>
              <CardTitle className="text-3xl">{session.title}</CardTitle>
              <CardDescription>
                Chat et flashcards arrivent bientôt — pour l'instant, voici le
                résumé généré.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">
                {
                  session.history.find(
                    (message) => message.role === "assistant"
                  )?.content
                }
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
