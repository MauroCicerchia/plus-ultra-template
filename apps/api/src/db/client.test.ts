import { describe, expect, it } from "vitest";
import { createDatabase } from "./client.js";

describe("createDatabase", () => {
  it("does not connect until it is called", () => {
    expect(() => createDatabase({})).toThrow(
      "DATABASE_URL is required when the API queries the database",
    );
  });

  it("builds a Drizzle client from the pooled connection", () => {
    const database = createDatabase({
      DATABASE_URL: "postgresql://user:password@host-pooler.neon.tech/database?sslmode=require",
    });

    expect(typeof database.execute).toBe("function");
  });
});
