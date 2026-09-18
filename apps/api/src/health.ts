import { healthResponseSchema } from "@app/shared";
import { Hono } from "hono";

export const healthRoute = new Hono().get("/", (context) => {
  const response = healthResponseSchema.parse({ status: "ok" });
  return context.json(response, 200);
});
