import { z } from "zod";

/**
 * Technical health contract shared by the API and the browser client.
 * It describes transport shape only; product contracts belong beside it as
 * separate modules once a product spec earns them.
 */
export const healthResponseSchema = z
  .object({
    status: z.literal("ok"),
  })
  .readonly();

export type HealthResponse = z.infer<typeof healthResponseSchema>;
