import { defineConfig } from "drizzle-kit";
import { resolveMigrationDatabaseUrl } from "./src/db/database-url.js";

// Resolved eagerly so Drizzle commands fail fast with an explicit message.
// Nothing else in the API imports this file, so install, tests and builds
// never require a database connection string.
const databaseUrl = resolveMigrationDatabaseUrl(process.env);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
});
