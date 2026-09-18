import { healthResponseSchema } from "@app/shared";
import { describe, expect, it } from "vitest";
import { vercelApp } from "./vercel.js";

describe("Vercel API adapter", () => {
  it("mounts the Hono API below /api", async () => {
    const response = await vercelApp.request("/api/health");
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(healthResponseSchema.parse(body)).toEqual({ status: "ok" });
  });
});
