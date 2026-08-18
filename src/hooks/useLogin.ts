import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";
import { setStoredToken } from "@/lib/http";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),
    onSuccess: ({ token }) => {
      setStoredToken(token);
    },
  });
}
