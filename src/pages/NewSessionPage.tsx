import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { GenerationFailedIllustration } from "@/components/illustrations/GenerationFailedIllustration";
import { ProcessingIllustration } from "@/components/illustrations/ProcessingIllustration";
import { useCreateSession } from "@/hooks/useCreateSession";

// Reflète la validation faite côté backend (husk-backend) pour cet endpoint.
// Seul YouTube est supporté par l'API pour l'instant (voir CLAUDE.md) —
// Article/Question libre n'ont pas d'UI tant que le backend ne les gère pas.
const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

const newSessionSchema = z.object({
  content: z
    .string()
    .min(1, "Ce champ est requis.")
    .regex(
      YOUTUBE_URL_PATTERN,
      "Utilise un lien du type https://www.youtube.com/watch?v=... ou https://youtu.be/..."
    ),
});

type NewSessionValues = z.infer<typeof newSessionSchema>;

export function NewSessionPage() {
  const navigate = useNavigate();
  const form = useForm<NewSessionValues>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: { content: "" },
  });
  const createSessionMutation = useCreateSession();

  function onSubmit(values: NewSessionValues) {
    createSessionMutation.mutate(values.content, {
      onSuccess: (session) => navigate(`/session/${session.id}`),
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center p-4 sm:justify-center">
      <div className="w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-display-lg">Nouvelle session</CardTitle>
          <CardDescription className="text-body">
            Colle un lien YouTube.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien YouTube</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {createSessionMutation.isPending && (
                <div className="flex flex-col items-center gap-1 text-center">
                  <ProcessingIllustration className="h-20 w-auto" />
                  <p className="text-muted-foreground text-caption">
                    Génération en cours...
                  </p>
                </div>
              )}
              {createSessionMutation.isError && (
                <div className="flex flex-col items-center gap-1 text-center">
                  <GenerationFailedIllustration className="h-20 w-auto" />
                  <p className="text-body font-medium">
                    La génération a échoué
                  </p>
                  <p className="text-muted-foreground text-caption">
                    {createSessionMutation.error.message}
                  </p>
                </div>
              )}
              <Button
                type="submit"
                disabled={createSessionMutation.isPending}
                className="h-11 w-full sm:h-9 sm:w-auto sm:justify-self-end"
              >
                {createSessionMutation.isPending
                  ? "Génération en cours..."
                  : "Générer"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
