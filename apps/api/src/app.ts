import { Hono } from "hono";
import { healthRoute } from "./health.js";

export const app = new Hono().route("/health", healthRoute);

/** Consumed by the browser client through `hono/client` for a typed boundary. */
export type AppType = typeof app;
