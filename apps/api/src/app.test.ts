import { healthResponseSchema } from "@app/shared";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("GET /health", () => {
  it("returns the shared health contract", async () => {
    const response = await app.request("/health");
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(healthResponseSchema.parse(body)).toEqual({ status: "ok" });
  });
});
