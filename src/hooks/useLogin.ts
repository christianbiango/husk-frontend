import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import { getApiErrorMessage, setStoredToken } from "@/lib/http";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      try {
        return await login(email, password);
      } catch (error) {
        const message = getApiErrorMessage(error);
        if (message) throw new Error(message);
        throw error;
      }
    },
    onSuccess: ({ token }) => {
      setStoredToken(token);
    },
  });
}
