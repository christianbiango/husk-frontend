import { useQuery } from "@tanstack/react-query";
import { fetchHealth, type HealthResponse } from "@/lib/health";

export function useHealth() {
  return useQuery<HealthResponse, Error>({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
  });
}
