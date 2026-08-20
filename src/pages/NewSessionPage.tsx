import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircleQuestion, Newspaper, Video } from "lucide-react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCreateSession } from "@/hooks/useCreateSession";
import type { SourceType } from "@/lib/api";

const SOURCE_TYPES = ["youtube", "article", "free_question"] as const;

const sourceTypeConfig: Record<
  SourceType,
  { chip: string; label: string; placeholder: string; icon: typeof Video }
> = {
  youtube: {
    chip: "YouTube",
    label: "Lien YouTube",
    placeholder: "https://www.youtube.com/watch?v=...",
    icon: Video,
  },
  article: {
    chip: "Article",
    label: "Lien de l'article",
    placeholder: "https://exemple.com/article",
    icon: Newspaper,
  },
  free_question: {
    chip: "Question libre",
    label: "Ta question",
    placeholder: "Quelle est la différence entre TCP et UDP ?",
    icon: MessageCircleQuestion,
  },
};

// Reflète la validation faite côté backend (husk-backend) pour cet endpoint.
const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

const newSessionSchema = z
  .object({
    sourceType: z.enum(SOURCE_TYPES),
    content: z.string().min(1, "Ce champ est requis."),
  })
  .superRefine((values, ctx) => {
    if (values.sourceType === "free_question") return;
    if (values.sourceType === "youtube") {
      if (!YOUTUBE_URL_PATTERN.test(values.content)) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message:
            "Utilise un lien du type https://www.youtube.com/watch?v=... ou https://youtu.be/...",
        });
      }
      return;
    }
    if (!z.string().url().safeParse(values.content).success) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "Entre un lien valide (https://...).",
      });
    }
  });

type NewSessionValues = z.infer<typeof newSessionSchema>;

export function NewSessionPage() {
  const navigate = useNavigate();
  const form = useForm<NewSessionValues>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: { sourceType: "youtube", content: "" },
  });
  const createSessionMutation = useCreateSession();

  const sourceType = form.watch("sourceType");
  const activeConfig = sourceTypeConfig[sourceType];

  function onSubmit(values: NewSessionValues) {
    createSessionMutation.mutate(values, {
      onSuccess: (session) => navigate(`/session/${session.id}`),
    });
  }

  return (
    <div className="w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Nouvelle session</CardTitle>
          <CardDescription>Colle un lien ou pose une question.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6"
            >
              <FormField
                control={form.control}
                name="sourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de source</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        variant="outline"
                        className="w-full flex-col items-stretch sm:w-fit sm:flex-row sm:flex-wrap sm:items-center"
                        value={[field.value]}
                        onValueChange={(values: string[]) => {
                          if (values.length > 0) {
                            field.onChange(values[0]);
                          }
                        }}
                      >
                        {SOURCE_TYPES.map((type) => {
                          const Icon = sourceTypeConfig[type].icon;
                          return (
                            <ToggleGroupItem
                              key={type}
                              value={type}
                              className="h-11 w-full justify-start gap-2 sm:w-auto sm:justify-center aria-pressed:border-primary! aria-pressed:bg-primary! aria-pressed:text-primary-foreground!"
                            >
                              <Icon />
                              {sourceTypeConfig[type].chip}
                            </ToggleGroupItem>
                          );
                        })}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{activeConfig.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder={activeConfig.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {createSessionMutation.isError && (
                <p className="text-destructive text-sm">
                  {createSessionMutation.error.message}
                </p>
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
  );
}
