import { describe, expect, it } from "vitest";
import { resolveMigrationDatabaseUrl, resolveRuntimeDatabaseUrl } from "./database-url.js";

describe("resolveMigrationDatabaseUrl", () => {
  it("prefers the unpooled connection for migrations", () => {
    expect(
      resolveMigrationDatabaseUrl({
        DATABASE_URL: "postgresql://pooled",
        DATABASE_URL_UNPOOLED: "postgresql://direct",
      }),
    ).toBe("postgresql://direct");
  });

  it("falls back to the pooled connection", () => {
    expect(resolveMigrationDatabaseUrl({ DATABASE_URL: "postgresql://pooled" })).toBe(
      "postgresql://pooled",
    );
  });

  it("rejects a missing migration connection", () => {
    expect(() => resolveMigrationDatabaseUrl({})).toThrow(
      "DATABASE_URL_UNPOOLED or DATABASE_URL is required only when running Drizzle commands",
    );
  });
});

describe("resolveRuntimeDatabaseUrl", () => {
  it("uses the pooled connection at runtime", () => {
    expect(
      resolveRuntimeDatabaseUrl({
        DATABASE_URL: "postgresql://pooled",
        DATABASE_URL_UNPOOLED: "postgresql://direct",
      }),
    ).toBe("postgresql://pooled");
  });

  it("rejects a missing runtime connection", () => {
    expect(() =>
      resolveRuntimeDatabaseUrl({ DATABASE_URL_UNPOOLED: "postgresql://direct" }),
    ).toThrow("DATABASE_URL is required only when the API queries the database");
  });
});
