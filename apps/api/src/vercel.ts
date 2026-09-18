import { Hono } from "hono";
import { app } from "./app.js";

// Vercel forwards the original path to the function, so the `/api` prefix is
// re-added here instead of inside the app the local Node server serves.
export const vercelApp = new Hono().route("/api", app);

export default vercelApp;
