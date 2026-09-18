import { describe, expect, it } from "vitest";
import { resolveMigrationDatabaseUrl, resolveRuntimeDatabaseUrl } from "./database-url.js";

const direct =
  "postgresql://user:password@ep-cool-name.eu-central-1.aws.neon.tech/db?sslmode=require";
const pooled =
  "postgresql://user:password@ep-cool-name-pooler.eu-central-1.aws.neon.tech/db?sslmode=require";

describe("resolveMigrationDatabaseUrl", () => {
  it("accepts the direct connection", () => {
    expect(resolveMigrationDatabaseUrl({ DATABASE_URL_UNPOOLED: direct })).toBe(direct);
  });

  it("never falls back to the pooled runtime connection", () => {
    expect(() => resolveMigrationDatabaseUrl({ DATABASE_URL: pooled })).toThrow(
      "DATABASE_URL_UNPOOLED is required when running Drizzle migrations",
    );
  });

  it("rejects a blank migration connection", () => {
    expect(() => resolveMigrationDatabaseUrl({ DATABASE_URL_UNPOOLED: "   " })).toThrow(
      "DATABASE_URL_UNPOOLED is required when running Drizzle migrations",
    );
  });

  it("rejects a connection that is not a PostgreSQL URL", () => {
    expect(() => resolveMigrationDatabaseUrl({ DATABASE_URL_UNPOOLED: "not-a-url" })).toThrow(
      "DATABASE_URL_UNPOOLED must be a valid PostgreSQL connection URL",
    );
    expect(() =>
      resolveMigrationDatabaseUrl({ DATABASE_URL_UNPOOLED: "mysql://user@host/db" }),
    ).toThrow("DATABASE_URL_UNPOOLED must be a valid PostgreSQL connection URL");
  });

  it("rejects the pooled host, which cannot run migrations", () => {
    expect(() => resolveMigrationDatabaseUrl({ DATABASE_URL_UNPOOLED: pooled })).toThrow(
      "DATABASE_URL_UNPOOLED must use a direct PostgreSQL connection",
    );
  });
});

describe("resolveRuntimeDatabaseUrl", () => {
  it("uses the pooled connection at runtime", () => {
    expect(resolveRuntimeDatabaseUrl({ DATABASE_URL: pooled, DATABASE_URL_UNPOOLED: direct })).toBe(
      pooled,
    );
  });

  it("rejects a missing runtime connection", () => {
    expect(() => resolveRuntimeDatabaseUrl({ DATABASE_URL_UNPOOLED: direct })).toThrow(
      "DATABASE_URL is required when the API queries the database",
    );
  });

  it("rejects a connection that is not a PostgreSQL URL", () => {
    expect(() => resolveRuntimeDatabaseUrl({ DATABASE_URL: "https://example.com" })).toThrow(
      "DATABASE_URL must be a valid PostgreSQL connection URL",
    );
  });
});
