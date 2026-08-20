import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { ApiStatusBadge } from "@/components/ApiStatusBadge";
import { useLogin } from "@/hooks/useLogin";
import { getStoredToken } from "@/lib/http";

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis.").email("Email invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const loginMutation = useLogin();

  if (getStoredToken()) {
    return <Navigate to="/nouvelle-session" replace />;
  }

  function onSubmit(values: LoginValues) {
    loginMutation.mutate(values, {
      onSuccess: () => navigate("/nouvelle-session", { replace: true }),
    });
  }

  return (
    <div className="flex min-h-svh flex-col items-center p-4 pt-16 sm:justify-center sm:pt-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion à Husk</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à vos sessions.
          </CardDescription>
          <div className="pt-2">
            <ApiStatusBadge />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="vous@exemple.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loginMutation.isError && (
                <p className="text-destructive text-sm">
                  {loginMutation.error.message}
                </p>
              )}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="h-11 sm:h-9"
              >
                {loginMutation.isPending ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
