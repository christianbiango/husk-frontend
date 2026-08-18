import { api } from "@/lib/http";

export interface HealthResponse {
  status: string;
}

export const fetchHealth = async () =>
  await api<HealthResponse>("/health", { method: "GET" });
