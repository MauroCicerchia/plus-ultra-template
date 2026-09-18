import type { AppType } from "@app/api/app";
import { type HealthResponse, healthResponseSchema } from "@app/shared";
import { hc } from "hono/client";

// `hc<AppType>` gives compile-time route and response types straight from the
// Hono app; the shared Zod schema validates the payload at runtime.
const client = hc<AppType>(import.meta.env.VITE_API_URL ?? "/api");

export async function getHealth(): Promise<HealthResponse> {
  const response = await client.health.$get();

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return healthResponseSchema.parse(await response.json());
}
